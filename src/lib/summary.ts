import type { Bottle } from '../types/bottle'

export function getAverageValue(bottles: Bottle[]): number {
  if (bottles.length === 0) return 0
  return Math.round(bottles.reduce((sum, bottle) => sum + bottle.value, 0) / bottles.length)
}

export function getSummaryText(bottles: Bottle[]): string {
  const average = getAverageValue(bottles)
  if (average <= 20) return '综合评价：瓶子很空，故事很多。'
  if (average <= 40) return '综合评价：有点东西，但不算太多。'
  if (average <= 60) return '综合评价：大体正常，局部离谱。'
  if (average <= 80) return '综合评价：优点不少，缺点也挺有存在感。'
  return '综合评价：基本拉满，建议重点观察。'
}
