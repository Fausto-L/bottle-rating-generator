import type { AppState } from '../types/appState'
import { normalizeState } from './shareCodec'

export const draftStorageKey = 'bottle_rating_draft_v1'

export function loadDraft(): AppState | null {
  try {
    const raw = window.localStorage.getItem(draftStorageKey)
    if (!raw) return null
    return normalizeState(JSON.parse(raw) as AppState)
  } catch {
    return null
  }
}

export function saveDraft(state: AppState): void {
  try {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(normalizeState(state)))
  } catch {
    // localStorage may fail in private browsing; the app should keep working.
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(draftStorageKey)
  } catch {
    // ignore
  }
}
