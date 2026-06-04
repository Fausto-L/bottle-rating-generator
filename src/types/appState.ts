import type { Bottle } from './bottle'
import type { ThemeColorId } from './theme'

export type AppState = {
  version: 1
  templateId: string
  title: string
  subtitle: string
  themeColor: ThemeColorId
  showPercent: boolean
  bottles: Bottle[]
  updatedAt: number
}
