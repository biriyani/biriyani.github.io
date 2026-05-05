import { Helmet } from 'react-helmet-async'

const SITE = 'https://biriyani.github.io'

type Props = {
  title: string
  description: string
  url?: string
  image?: string
  type?: 'website' | 'article'
}

export function PageHead({
  title,
  description,
  url = SITE,
  image = `${SITE}/og-cover.png`,
  type = 'website',
}: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
