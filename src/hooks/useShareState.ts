import { decodeShareState, encodeShareState } from '../lib/shareCodec'
import type { AppState } from '../types/appState'

export function readStateFromUrl(): AppState | null {
  const data = new URLSearchParams(window.location.search).get('data')
  return data ? decodeShareState(data) : null
}

export async function copyShareLink(state: AppState): Promise<string> {
  const url = new URL(window.location.href)
  url.searchParams.set('data', encodeShareState(state))
  const shareUrl = url.toString()
  await navigator.clipboard.writeText(shareUrl)
  return shareUrl
}
