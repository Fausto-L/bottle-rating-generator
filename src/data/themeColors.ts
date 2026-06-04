import type { ThemeColor, ThemeColorId } from '../types/theme'

export const themeColors: ThemeColor[] = [
  { id: 'pink', name: '粉色', hex: '#F48FB1' },
  { id: 'blue', name: '蓝色', hex: '#64B5F6' },
  { id: 'green', name: '绿色', hex: '#81C784' },
  { id: 'purple', name: '紫色', hex: '#BA68C8' },
  { id: 'orange', name: '橙色', hex: '#FFB74D' },
]

export function getThemeColor(id: ThemeColorId): ThemeColor {
  return themeColors.find((color) => color.id === id) ?? themeColors[0]
}
