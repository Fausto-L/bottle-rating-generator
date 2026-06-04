import { describe, expect, it, vi } from 'vitest'
import { createStateFromTemplate, templates } from '../data/templates'
import { clamp } from '../lib/clamp'
import { createPngFilename, downloadDataUrl } from '../lib/exportImage'
import { snapValue } from '../lib/fill'
import { randomBottleValue } from '../lib/randomize'
import { decodeShareState, encodeShareState, normalizeState } from '../lib/shareCodec'
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

  it('adds default decoration fields to legacy state', () => {
    const legacy = createStateFromTemplate(templates[0])
    const normalized = normalizeState({
      ...legacy,
      backgroundId: undefined,
      frameId: undefined,
      bottleShapeId: undefined,
    })

    expect(normalized.backgroundId).toBe('scrapbook')
    expect(normalized.frameId).toBe('sticker')
    expect(normalized.bottleShapeId).toBe('classic')
  })

  it('creates a stable PNG filename', () => {
    expect(createPngFilename(new Date('2026-06-05T00:00:00+08:00'))).toBe(
      'bottle-rating-20260605.png',
    )
  })

  it('triggers a data URL download', () => {
    const click = vi.fn()
    const appendChild = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation((node) => node)
    vi.spyOn(document, 'createElement').mockReturnValue({
      click,
      remove: vi.fn(),
    } as unknown as HTMLAnchorElement)

    downloadDataUrl('data:image/png;base64,abc', 'test.png')

    expect(appendChild).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    vi.restoreAllMocks()
  })
})
