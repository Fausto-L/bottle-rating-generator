import type { Bottle } from './bottle'
import type { BackgroundId, BottleShapeId, FrameId } from './decoration'
import type { ThemeColorId } from './theme'

export type AppState = {
  version: 1
  templateId: string
  title: string
  subtitle: string
  themeColor: ThemeColorId
  backgroundId: BackgroundId
  frameId: FrameId
  bottleShapeId: BottleShapeId
  showPercent: boolean
  bottles: Bottle[]
  updatedAt: number
}
