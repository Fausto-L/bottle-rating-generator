import type { Bottle } from '../types/bottle'

function randomInt(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min))
}

export function randomBottleValue(): number {
  const bucket = Math.random()
  if (bucket < 0.15) return randomInt(0, 30)
  if (bucket < 0.3) return randomInt(90, 100)
  return randomInt(30, 90)
}

export function randomizeBottles(bottles: Bottle[]): Bottle[] {
  return bottles.map((bottle) => ({ ...bottle, value: randomBottleValue() }))
}
