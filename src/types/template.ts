import type { Bottle } from './bottle'
import type { BackgroundId, BottleShapeId, FrameId } from './decoration'
import type { ThemeColorId } from './theme'

export type Template = {
  id: string
  name: string
  title: string
  subtitle: string
  themeColor: ThemeColorId
  backgroundId?: BackgroundId
  frameId?: FrameId
  bottleShapeId?: BottleShapeId
  bottles: Bottle[]
}
