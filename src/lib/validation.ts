import { clamp } from './clamp'

function limitByUnits(input: string, maxUnits: number): string {
  let units = 0
  let output = ''

  for (const char of input.trim()) {
    const charUnits = /[\u4e00-\u9fff]/.test(char) ? 2 : 1
    if (units + charUnits > maxUnits) break
    units += charUnits
    output += char
  }

  return output
}

export function validateTitle(input: string): string {
  return limitByUnits(input, 36)
}

export function validateSubtitle(input: string): string {
  return limitByUnits(input, 48)
}

export function validateLabel(input: string): string {
  const value = limitByUnits(input, 10)
  return value.length > 0 ? value : '标签'
}

export function validateBottleValue(input: number): number {
  return clamp(Math.round(Number.isFinite(input) ? input : 0))
}
