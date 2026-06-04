import { getThemeColor } from '../data/themeColors'
import { getPosterBackground } from '../data/decorations'
import { getSummaryText } from '../lib/summary'
import type { AppState } from '../types/appState'
import { BottleGrid } from './BottleGrid'

type ResultCanvasProps = {
  state: AppState
}

export function ResultCanvas({ state }: ResultCanvasProps) {
  const color = getThemeColor(state.themeColor).hex
  const background = getPosterBackground(state.backgroundId)
  const backgroundUrl = `${import.meta.env.BASE_URL}${background.file}`
  const date = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  return (
    <div
      className="result-canvas relative flex h-[1920px] w-[1080px] overflow-hidden bg-[#fff7f4] px-12 py-14 text-neutral-950"
      data-testid="result-canvas"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 248, 246, 0.34), rgba(255, 248, 246, 0.34)), url('${backgroundUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="pointer-events-none absolute left-10 top-9 h-24 w-60 -rotate-6 rounded-[28px] bg-[#f9c7d5]/70 blur-[1px]" />
      <div className="pointer-events-none absolute right-8 top-20 h-20 w-48 rotate-6 rounded-[24px] bg-[#ffd9a6]/60 blur-[1px]" />

      <div className="relative z-10 flex h-full w-full flex-col gap-8">
        <header className="flex h-[330px] flex-col items-center justify-start pt-8 text-center">
          <div className="relative max-w-[960px] rounded-[34px] border-[6px] border-neutral-950 bg-white/92 px-12 py-7 shadow-[14px_14px_0_rgba(17,17,17,0.16)]">
            <span className="absolute -left-8 -top-8 rotate-[-10deg] rounded-full border-[4px] border-neutral-950 bg-[#f9c7d5] px-6 py-2 text-[28px] font-black">
              36瓶测评
            </span>
            <h1 className="poster-title max-w-[900px] break-words text-[70px] font-black leading-[1.02] text-neutral-950">
              {state.title}
            </h1>
          </div>
          <p className="mt-8 max-w-[820px] rotate-[-1deg] rounded-[26px] border-[4px] border-neutral-950 bg-[#fff0a8] px-8 py-4 text-[30px] font-black leading-tight shadow-[8px_8px_0_rgba(17,17,17,0.12)]">
            {state.subtitle}
          </p>
        </header>

        <main className="flex h-[1120px] items-center justify-center">
          <div
            className={[
              'poster-frame w-full bg-white/78 px-9 py-9 backdrop-blur-[1px]',
              `poster-frame-${state.frameId}`,
            ].join(' ')}
          >
            <BottleGrid
              bottles={state.bottles}
              color={color}
              poster
              shapeId={state.bottleShapeId}
            />
          </div>
        </main>

        <footer className="flex h-[330px] flex-col items-center justify-start pt-6 text-center">
          <p className="max-w-[920px] -rotate-1 rounded-[30px] border-[5px] border-neutral-950 bg-white/92 px-10 py-7 text-[42px] font-black leading-tight shadow-[10px_10px_0_rgba(17,17,17,0.13)]">
            {getSummaryText(state.bottles)}
          </p>
          <div className="mt-7 flex items-center gap-5 text-[25px] font-black text-neutral-600">
            <span className="rounded-full bg-white/75 px-5 py-2">{date}</span>
            <span className="rounded-full bg-white/75 px-5 py-2">
              Bottle Rating Generator
            </span>
          </div>
        </footer>
      </div>

      <div className="pointer-events-none absolute bottom-7 left-12 text-[38px] font-black text-[#f48fb1]/80">
        ♡
      </div>
      <div className="pointer-events-none absolute bottom-10 right-14 text-[34px] font-black text-neutral-950/70">
        ✦
      </div>
    </div>
  )
}
