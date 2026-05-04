import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import * as topojson from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { FeatureCollection, Geometry } from 'geojson'
import { Map as MapcnMap } from '@/registry/map'
import { regionCounts } from '@/data/types'

// TopoJSON state names → biriyani.json regions.
const NAME_NORMALIZE: Record<string, string> = {
  'Jammu & Kashmir': 'Jammu and Kashmir',
  'NCT of Delhi': 'Delhi',
}

type Props = {
  selected?: string
  onSelect: (region: string | null) => void
}

export function IndiaMap({ selected, onSelect }: Props) {
  const counts = useMemo(() => regionCounts(), [])
  const maxCount = useMemo(() => Math.max(...Object.values(counts)), [counts])
  const [geojson, setGeojson] = useState<FeatureCollection<Geometry, { name: string; region: string; count: number }> | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const hoverIdRef = useRef<number | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/india.topo.json')
      .then((r) => r.json())
      .then((topo: Topology) => {
        const fc = topojson.feature(topo, topo.objects.india) as FeatureCollection
        const enriched: FeatureCollection<Geometry, { name: string; region: string; count: number }> = {
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
              }
            }),
        }
        setGeojson(enriched)
      })
  }, [counts])

  const style = useMemo<maplibregl.StyleSpecification>(
    () => ({
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {},
      layers: [
        {
          id: 'cream-bg',
          type: 'background',
          paint: { 'background-color': '#f6f1e7' },
        },
      ],
    }),
    [],
  )

  function attachLayers(map: maplibregl.Map, fc: FeatureCollection) {
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
          '#efe4cd',
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
          ['boolean', ['feature-state', 'hover'], false],
          1,
          ['boolean', ['feature-state', 'selected'], false],
          1,
          0.92,
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
          ['boolean', ['feature-state', 'hover'], false],
          1.6,
          ['boolean', ['feature-state', 'selected'], false],
          2.2,
          0.5,
        ],
        'line-opacity': 0.55,
      },
    })

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
        const props = f.properties as { region: string; count: number }
        tt.style.opacity = '1'
        tt.style.left = `${e.point.x}px`
        tt.style.top = `${e.point.y - 12}px`
        tt.innerHTML = `<strong>${props.region}</strong><span>${props.count} ${props.count === 1 ? 'variety' : 'varieties'}</span>`
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
      const region = (e.features[0].properties as { region: string; count: number }).region
      const count = (e.features[0].properties as { region: string; count: number }).count
      if (count > 0) onSelect(region)
    })
  }

  // Init layers when both map and geojson are ready.
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

  // Drive selected feature state.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !geojson) return
    geojson.features.forEach((f) => {
      const id = f.id as number
      const isSel = (f.properties as { region: string }).region === selected
      try {
        map.setFeatureState({ source: 'states', id }, { selected: isSel })
      } catch {
        /* style not ready yet */
      }
    })
  }, [selected, geojson])

  return (
    <div className="relative w-full">
      <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-line bg-cream-soft shadow-paper md:h-[520px]">
        <MapcnMap
          ref={(m) => {
            mapRef.current = m
          }}
          theme="light"
          styles={{ light: style, dark: style }}
          viewport={{ center: [80.5, 22.5], zoom: 3.6, bearing: 0, pitch: 0 }}
          maxBounds={[
            [60, 5],
            [100, 38],
          ]}
          dragRotate={false}
          touchPitch={false}
          attributionControl={false}
          className="!h-full !w-full"
        />
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-bark/95 px-2.5 py-1.5 text-xs text-cream shadow-card-hover transition-opacity duration-150"
          style={{ opacity: 0 }}
        >
          <strong>state</strong>
          <span></span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-bark-soft">
        <span>Hover a state to see its varieties · click to filter the grid</span>
        {selected && (
          <button
            type="button"
            className="rounded-full bg-saffron px-3 py-1 text-cream"
            onClick={() => onSelect(null)}
          >
            Clear filter — {selected}
          </button>
        )}
      </div>
    </div>
  )
}
