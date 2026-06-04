import type {
  BackgroundId,
  BottleShape,
  BottleShapeId,
  FrameId,
  PosterBackground,
  PosterFrame,
} from '../types/decoration'

export const posterBackgrounds: PosterBackground[] = [
  { id: 'scrapbook', name: '手账贴纸', file: 'backgrounds/scrapbook.png' },
  { id: 'cream', name: '奶油纸纹', file: 'backgrounds/cream-paper.png' },
  { id: 'doodle', name: '涂鸦边角', file: 'backgrounds/doodle-corners.png' },
]

export const posterFrames: PosterFrame[] = [
  { id: 'sticker', name: '贴纸粗框' },
  { id: 'stamp', name: '邮票锯齿' },
  { id: 'photo', name: '褪色相片' },
  { id: 'window', name: '苹果窗口' },
]

export const bottleShapes: BottleShape[] = [
  { id: 'classic', name: '经典瓶' },
  { id: 'star', name: '星星瓶' },
  { id: 'shell', name: '贝壳瓶' },
]

export function getPosterBackground(id: BackgroundId): PosterBackground {
  return (
    posterBackgrounds.find((background) => background.id === id) ?? posterBackgrounds[0]
  )
}

export function getPosterFrame(id: FrameId): PosterFrame {
  return posterFrames.find((frame) => frame.id === id) ?? posterFrames[0]
}

export function getBottleShape(id: BottleShapeId): BottleShape {
  return bottleShapes.find((shape) => shape.id === id) ?? bottleShapes[0]
}
