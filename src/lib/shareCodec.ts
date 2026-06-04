import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { themeColors } from '../data/themeColors'
import type { AppState } from '../types/appState'
import type { BackgroundId, BottleShapeId, FrameId } from '../types/decoration'
import {
  validateBottleValue,
  validateLabel,
  validateSubtitle,
  validateTitle,
} from './validation'

const backgroundIds = ['scrapbook', 'cream', 'doodle'] satisfies BackgroundId[]
const frameIds = ['sticker', 'stamp', 'photo', 'window'] satisfies FrameId[]
const bottleShapeIds = ['classic', 'star', 'shell'] satisfies BottleShapeId[]

function pickKnownId<T extends string>(value: unknown, ids: readonly T[], fallback: T): T {
  return typeof value === 'string' && ids.includes(value as T) ? (value as T) : fallback
}

export function normalizeState(
  state: Partial<AppState> & Pick<AppState, 'bottles'>,
): AppState {
  const themeExists = themeColors.some((color) => color.id === state.themeColor)

  return {
    version: 1,
    templateId: String(state.templateId || 'blank'),
    title: validateTitle(state.title || '瓶子评价图'),
    subtitle: validateSubtitle(state.subtitle || ''),
    themeColor: themeExists && state.themeColor ? state.themeColor : 'pink',
    backgroundId: pickKnownId(state.backgroundId, backgroundIds, 'scrapbook'),
    frameId: pickKnownId(state.frameId, frameIds, 'sticker'),
    bottleShapeId: pickKnownId(state.bottleShapeId, bottleShapeIds, 'classic'),
    showPercent: Boolean(state.showPercent),
    bottles: state.bottles.slice(0, 36).map((bottle, index) => ({
      id: bottle.id || `bottle-${index + 1}`,
      label: validateLabel(bottle.label),
      value: validateBottleValue(bottle.value),
    })),
    updatedAt: Date.now(),
  }
}

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<AppState>
  return candidate.version === 1 && Array.isArray(candidate.bottles)
}

export function encodeShareState(state: AppState): string {
  return compressToEncodedURIComponent(JSON.stringify(normalizeState(state)))
}

export function decodeShareState(data: string): AppState | null {
  try {
    const json = decompressFromEncodedURIComponent(data)
    if (!json) return null
    const parsed = JSON.parse(json) as unknown
    if (!isAppState(parsed)) return null
    const normalized = normalizeState(parsed)
    return normalized.bottles.length === 36 ? normalized : null
  } catch {
    return null
  }
}
