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
      className="result-canvas relative h-[1920px] w-[1080px] overflow-hidden bg-[#fff7f4] text-neutral-950"
      data-testid="result-canvas"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 248, 246, 0.34), rgba(255, 248, 246, 0.34)), url('${backgroundUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="pointer-events-none absolute left-10 top-9 h-24 w-60 -rotate-6 rounded-[28px] bg-[#f9c7d5]/70 blur-[1px]" />
      <div className="pointer-events-none absolute right-8 top-20 h-20 w-48 rotate-6 rounded-[24px] bg-[#ffd9a6]/60 blur-[1px]" />

      <div className="relative z-10 h-full w-full">
        <header className="absolute left-12 right-12 top-[54px] h-[304px] text-center">
          <div className="relative mx-auto max-w-[860px] rounded-[34px] border-[6px] border-neutral-950 bg-white/92 px-10 py-6 shadow-[14px_14px_0_rgba(17,17,17,0.16)]">
            <span className="absolute -left-5 -top-7 rotate-[-10deg] rounded-full border-[4px] border-neutral-950 bg-[#f9c7d5] px-6 py-2 text-[28px] font-black">
              36瓶测评
            </span>
            <h1 className="poster-title mx-auto max-w-[800px] break-words text-[64px] font-black leading-[1.04] text-neutral-950">
              {state.title}
            </h1>
          </div>
          <p className="mx-auto mt-8 max-w-[780px] rotate-[-1deg] rounded-[24px] border-[4px] border-neutral-950 bg-[#fff0a8] px-7 py-3 text-[28px] font-black leading-tight shadow-[8px_8px_0_rgba(17,17,17,0.12)]">
            {state.subtitle}
          </p>
        </header>

        <main className="absolute left-12 right-12 top-[400px] h-[1110px]">
          <div
            className={[
              'poster-frame h-full w-full bg-white/78 px-9 py-8 backdrop-blur-[1px]',
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

        <footer className="absolute left-12 right-12 top-[1542px] h-[250px] text-center">
          <p className="mx-auto max-w-[820px] -rotate-1 rounded-[30px] border-[5px] border-neutral-950 bg-white/94 px-9 py-6 text-[38px] font-black leading-tight shadow-[10px_10px_0_rgba(17,17,17,0.13)]">
            {getSummaryText(state.bottles)}
          </p>
          <div className="mt-8 flex items-center justify-center gap-5 text-[25px] font-black text-neutral-600">
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
