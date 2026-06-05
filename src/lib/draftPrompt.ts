const draftPromptSessionKey = 'bottle_rating_draft_prompted_v1'

export function shouldAskToRestoreDraft(storage: Storage = window.sessionStorage): boolean {
  try {
    if (storage.getItem(draftPromptSessionKey)) return false
    storage.setItem(draftPromptSessionKey, '1')
    return true
  } catch {
    return false
  }
}
