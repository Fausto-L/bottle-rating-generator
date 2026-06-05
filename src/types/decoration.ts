export type BackgroundId = 'scrapbook' | 'cream' | 'doodle' | 'film' | 'fear' | 'pixel'

export type FrameId = 'sticker' | 'stamp' | 'photo' | 'window' | 'film' | 'dark' | 'pixel'

export type BottleShapeId = 'classic' | 'star' | 'shell'

export type PosterBackground = {
  id: BackgroundId
  name: string
  file: string
}

export type PosterFrame = {
  id: FrameId
  name: string
}

export type BottleShape = {
  id: BottleShapeId
  name: string
}
