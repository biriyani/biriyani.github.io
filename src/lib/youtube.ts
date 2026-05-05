// Extract a YouTube video id from any of the common URL shapes:
//   https://www.youtube.com/watch?v=ID
//   https://youtu.be/ID
//   https://www.youtube.com/embed/ID
//   https://www.youtube.com/shorts/ID
//   https://www.youtube.com/v/ID
export function youtubeId(url: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([^&?#/]+)/)
  return m ? m[1] : null
}

export function youtubeThumb(url: string): string | null {
  const id = youtubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

export function youtubeEmbed(url: string): string | null {
  const id = youtubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}
