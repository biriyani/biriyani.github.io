import { Helmet } from 'react-helmet-async'

export const SITE = 'https://biriyani.wiki'
export const SITE_NAME = 'Biriyani'

type LdJson = Record<string, unknown> | Record<string, unknown>[]

type Props = {
  title: string
  description: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  jsonLd?: LdJson
}

export function PageHead({
  title,
  description,
  url = SITE,
  image = `${SITE}/og-cover.png`,
  type = 'website',
  noIndex = false,
  jsonLd,
}: Props) {
  const blocks: Record<string, unknown>[] = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}
