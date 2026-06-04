import { useEffect } from 'react'
import type { AppState } from '../types/appState'
import { saveDraft } from '../lib/storage'

export function useLocalDraft(state: AppState | null): void {
  useEffect(() => {
    if (!state) return
    saveDraft({ ...state, updatedAt: Date.now() })
  }, [state])
}
