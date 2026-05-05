import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import * as topojson from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { Feature, FeatureCollection, Geometry, Position } from 'geojson'
import { Map as MapcnMap } from '@/registry/map'
import { regionCounts } from '@/data/types'

// TopoJSON state names → biriyani.json regions.
const NAME_NORMALIZE: Record<string, string> = {
  'Jammu & Kashmir': 'Jammu and Kashmir',
  'NCT of Delhi': 'Delhi',
}

// India bounding box. Wide enough to include J&K's northern tip (~37°N),
// Kanyakumari (~8°N), the Andaman & Nicobar dot (~93°E, off the eastern
// coast), and Gujarat's western edge (~68°E). fitBounds respects the
// canvas aspect ratio, so this guarantees the silhouette is never cropped.
const INDIA_BOUNDS: maplibregl.LngLatBoundsLike = [
  [67.0, 5.5],
  [98.5, 37.6],
]

type EnrichedProps = { name: string; region: string; count: number }
type EnrichedFC = FeatureCollection<Geometry, EnrichedProps>

type Props = {
  selected?: string
  onSelect: (region: string | null) => void
}

function bboxOfFeatures(features: Feature<Geometry, EnrichedProps>[]): [[number, number], [number, number]] {
  let w = Infinity
  let s = Infinity
  let e = -Infinity
  let n = -Infinity
  const visit = (coords: Position | Position[] | Position[][] | Position[][][]) => {
    if (typeof coords[0] === 'number') {
      const [lng, lat] = coords as Position
      if (lng < w) w = lng
      if (lat < s) s = lat
      if (lng > e) e = lng
      if (lat > n) n = lat
    } else {
      for (const c of coords as Position[] | Position[][] | Position[][][]) visit(c as never)
    }
  }
  for (const f of features) {
    const g = f.geometry as { coordinates?: Position | Position[] | Position[][] | Position[][][] }
    if (g?.coordinates) visit(g.coordinates)
  }
  return [
    [w, s],
    [e, n],
  ]
}

export function IndiaMap({ selected, onSelect }: Props) {
  const counts = useMemo(() => regionCounts(), [])
  const maxCount = useMemo(() => Math.max(...Object.values(counts)), [counts])
  const [geojson, setGeojson] = useState<EnrichedFC | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const hoverIdRef = useRef<number | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  // Refs that callbacks bound at attach time read from — keeps them in sync
  // without re-attaching listeners.
  const onSelectRef = useRef(onSelect)
  const geojsonRef = useRef<EnrichedFC | null>(null)
  onSelectRef.current = onSelect
  geojsonRef.current = geojson

  useEffect(() => {
    fetch('/india.topo.json')
      .then((r) => r.json())
      .then((topo: Topology) => {
        const fc = topojson.feature(topo, topo.objects.india) as FeatureCollection
        const enriched: EnrichedFC = {
          type: 'FeatureCollection',
          features: fc.features
            .filter((f) => f.properties && (f.properties as { name?: string }).name)
            .map((f, i) => {
              const props = f.properties as { name: string }
              const region = NAME_NORMALIZE[props.name] ?? props.name
              return {
                ...f,
                id: i,
                properties: {
                  name: props.name,
                  region,
                  count: counts[region] ?? 0,
                },
              } as Feature<Geometry, EnrichedProps>
            }),
        }
        setGeojson(enriched)
      })
  }, [counts])

  // Empty MapLibre style — no basemap, no background. The state polygons we
  // add programmatically are the only visible thing, so India floats over
  // whatever page background is behind the canvas.
  const style = useMemo<maplibregl.StyleSpecification>(
    () => ({
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {},
      layers: [],
    }),
    [],
  )

  function attachLayers(map: maplibregl.Map, fc: EnrichedFC) {
    if (map.getSource('states')) return
    map.addSource('states', { type: 'geojson', data: fc, generateId: false })
    map.addLayer({
      id: 'states-fill',
      type: 'fill',
      source: 'states',
      paint: {
        'fill-color': [
          'case',
          ['==', ['get', 'count'], 0],
          '#efe2c8',
          [
            'interpolate',
            ['linear'],
            ['get', 'count'],
            1,
            '#f1c992',
            Math.max(1, Math.ceil(maxCount / 2)),
            '#dc8d40',
            maxCount,
            '#a8421b',
          ],
        ],
        'fill-opacity': [
          'case',
          // When something else is selected, dim every other state.
          ['boolean', ['feature-state', 'dimmed'], false],
          0.18,
          ['boolean', ['feature-state', 'hover'], false],
          1,
          ['boolean', ['feature-state', 'selected'], false],
          1,
          0.95,
        ],
      },
    })
    map.addLayer({
      id: 'states-line',
      type: 'line',
      source: 'states',
      paint: {
        'line-color': '#5a3818',
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          2.4,
          ['boolean', ['feature-state', 'hover'], false],
          1.6,
          0.6,
        ],
        'line-opacity': [
          'case',
          ['boolean', ['feature-state', 'dimmed'], false],
          0.18,
          0.5,
        ],
      },
    })

    // Refit the whole subcontinent on resize so the silhouette never gets
    // cropped at any breakpoint. (Skipped while a single state is selected —
    // we don't want to undo the zoom-in on a window resize.)
    const refit = () => {
      if (!onSelectRef.current) return
      // Read latest selected via ref-style (bound below via closure capture).
      // Implemented as: just check whether any feature has dimmed=true.
      const anyDimmed = (geojsonRef.current?.features ?? []).some((f) => {
        const fs = map.getFeatureState({ source: 'states', id: f.id as number })
        return fs?.dimmed === true || fs?.selected === true
      })
      if (!anyDimmed) {
        map.fitBounds(INDIA_BOUNDS, { padding: 36, animate: false, linear: true })
      }
    }
    map.fitBounds(INDIA_BOUNDS, { padding: 36, animate: false, linear: true })
    map.on('resize', refit)

    map.on('mousemove', 'states-fill', (e) => {
      if (!e.features?.length) return
      map.getCanvas().style.cursor = 'pointer'
      const f = e.features[0]
      const id = f.id as number
      if (hoverIdRef.current !== null && hoverIdRef.current !== id) {
        map.setFeatureState({ source: 'states', id: hoverIdRef.current }, { hover: false })
      }
      hoverIdRef.current = id
      map.setFeatureState({ source: 'states', id }, { hover: true })
      const tt = tooltipRef.current
      if (tt) {
        const props = f.properties as EnrichedProps
        tt.style.opacity = '1'
        tt.style.left = `${e.point.x}px`
        tt.style.top = `${e.point.y - 12}px`
        const label = props.count === 1 ? 'variety' : 'varieties'
        tt.innerHTML =
          `<div class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream">${props.region}</div>` +
          `<div class="mt-0.5 text-cream/70">${props.count} ${label}</div>`
      }
    })
    map.on('mouseleave', 'states-fill', () => {
      map.getCanvas().style.cursor = ''
      if (hoverIdRef.current !== null) {
        map.setFeatureState({ source: 'states', id: hoverIdRef.current }, { hover: false })
        hoverIdRef.current = null
      }
      if (tooltipRef.current) tooltipRef.current.style.opacity = '0'
    })
    map.on('click', 'states-fill', (e) => {
      if (!e.features?.length) return
      const props = e.features[0].properties as EnrichedProps
      if (props.count > 0) onSelectRef.current(props.region)
    })
  }

  useEffect(() => {
    const map = mapRef.current
    if (!map || !geojson) return
    if (map.isStyleLoaded()) {
      attachLayers(map, geojson)
    } else {
      map.once('load', () => attachLayers(map, geojson))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geojson])

  // React to `selected` changes — both clicks on the map and external resets
  // (e.g. from the "Clear filter" button) flow through this single effect.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !geojson) return
    const apply = () => {
      // Update feature-state across all features.
      let selectedFeatures: Feature<Geometry, EnrichedProps>[] = []
      for (const f of geojson.features) {
        const id = f.id as number
        const isSel = f.properties.region === selected
        const dimmed = !!selected && !isSel
        try {
          map.setFeatureState({ source: 'states', id }, { selected: isSel, dimmed })
        } catch {
          /* style not ready */
        }
        if (isSel) selectedFeatures.push(f)
      }

      if (selectedFeatures.length) {
        const bbox = bboxOfFeatures(selectedFeatures)
        // maxZoom keeps tiny states (Delhi, Goa) from over-zooming into a
        // pixelated polygon; padding leaves comfortable margin around the
        // silhouette.
        map.fitBounds(bbox, { padding: 60, maxZoom: 6, duration: 700, linear: false })
      } else {
        map.fitBounds(INDIA_BOUNDS, { padding: 36, duration: 600, linear: false })
      }
    }
    if (map.isStyleLoaded() && map.getSource('states')) {
      apply()
    } else {
      map.once('idle', apply)
    }
  }, [selected, geojson])

  return (
    <div className="india-map relative w-full">
      <div className="relative aspect-[5/5] w-full sm:aspect-[6/5] md:aspect-[7/5]">
        <MapcnMap
          ref={(m) => {
            mapRef.current = m
          }}
          theme="light"
          styles={{ light: style, dark: style }}
          viewport={{ center: [82.5, 22], zoom: 3.4, bearing: 0, pitch: 0 }}
          dragRotate={false}
          touchPitch={false}
          attributionControl={false}
          scrollZoom={false}
          dragPan={false}
          touchZoomRotate={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          className="!h-full !w-full"
        />
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-lg bg-bark/95 px-3 py-2 text-xs text-cream shadow-card-hover transition-opacity duration-150"
          style={{ opacity: 0 }}
        ></div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-bark-soft">
        <span>
          {selected
            ? `Showing ${selected} · click another state to switch, or clear to see all of India`
            : 'Hover a state to see its varieties · click to zoom in and filter the grid'}
        </span>
        {selected && (
          <button
            type="button"
            className="rounded-full bg-saffron px-3 py-1 text-cream hover:bg-bark"
            onClick={() => onSelect(null)}
          >
            ← All of India
          </button>
        )}
      </div>
    </div>
  )
}
