import { describe, expect, it, vi } from 'vitest'
import { createStateFromTemplate, templates } from '../data/templates'
import { clamp } from '../lib/clamp'
import { snapValue } from '../lib/fill'
import { randomBottleValue } from '../lib/randomize'
import { decodeShareState, encodeShareState } from '../lib/shareCodec'
import { getAverageValue, getSummaryText } from '../lib/summary'
import { validateLabel } from '../lib/validation'

describe('core utilities', () => {
  it('clamps values', () => {
    expect(clamp(-1)).toBe(0)
    expect(clamp(50)).toBe(50)
    expect(clamp(120)).toBe(100)
  })

  it('snaps near quick points', () => {
    expect(snapValue(48)).toBe(50)
    expect(snapValue(77)).toBe(75)
    expect(snapValue(64)).toBe(64)
  })

  it('summarizes average values', () => {
    const bottles = templates[0].bottles.map((bottle) => ({ ...bottle, value: 50 }))
    expect(getAverageValue(bottles)).toBe(50)
    expect(getSummaryText(bottles)).toBe('综合评价：大体正常，局部离谱。')
  })

  it('keeps label non-empty and limited', () => {
    expect(validateLabel('')).toBe('标签')
    expect(validateLabel('一二三四五六')).toBe('一二三四五')
  })

  it('random value stays in range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2)
    expect(randomBottleValue()).toBeGreaterThanOrEqual(90)
    expect(randomBottleValue()).toBeLessThanOrEqual(100)
    vi.restoreAllMocks()
  })

  it('encodes and decodes share state', () => {
    const state = createStateFromTemplate(templates[0])
    const encoded = encodeShareState(state)
    expect(decodeShareState(encoded)?.title).toBe(state.title)
    expect(decodeShareState('bad-data')).toBeNull()
  })
})
