import { getThemeColor } from '../data/themeColors'
import { getSummaryText } from '../lib/summary'
import type { AppState } from '../types/appState'
import { BottleGrid } from './BottleGrid'

type ResultCanvasProps = {
  state: AppState
}

export function ResultCanvas({ state }: ResultCanvasProps) {
  const color = getThemeColor(state.themeColor).hex
  const date = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  return (
    <div
      className="result-canvas flex h-[1920px] w-[1080px] flex-col bg-[#fff9fb] px-16 py-20 text-neutral-950"
      data-testid="result-canvas"
    >
      <header className="flex h-[220px] flex-col items-center justify-center text-center">
        <h1 className="max-w-[920px] break-words text-7xl font-black leading-tight">
          {state.title}
        </h1>
        <p className="mt-6 max-w-[860px] break-words text-3xl font-semibold text-neutral-500">
          {state.subtitle}
        </p>
      </header>
      <main className="flex h-[1300px] items-center justify-center">
        <div className="w-full">
          <BottleGrid bottles={state.bottles} color={color} compact />
        </div>
      </main>
      <footer className="flex h-[300px] flex-col items-center justify-center text-center">
        <p className="max-w-[900px] text-4xl font-black">{getSummaryText(state.bottles)}</p>
        <p className="mt-8 text-2xl font-semibold text-neutral-500">{date}</p>
        <p className="mt-4 text-2xl font-bold text-neutral-400">Bottle Rating Generator</p>
      </footer>
    </div>
  )
}
