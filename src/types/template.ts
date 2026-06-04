import type { Bottle } from './bottle'
import type { ThemeColorId } from './theme'

export type Template = {
  id: string
  name: string
  title: string
  subtitle: string
  themeColor: ThemeColorId
  bottles: Bottle[]
}
