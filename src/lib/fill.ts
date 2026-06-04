import { clamp } from './clamp'

export const snapPoints = [0, 25, 50, 75, 100] as const

export function snapValue(value: number, threshold = 3): number {
  const clamped = clamp(Math.round(value))
  const target = snapPoints.find((point) => Math.abs(point - clamped) <= threshold)
  return target ?? clamped
}

export function valueFromPointer(clientY: number, topY: number, bottomY: number): number {
  const height = bottomY - topY
  if (height <= 0) return 0
  return clamp(((bottomY - clientY) / height) * 100)
}
