import { useMemo, useRef, useState } from 'react'
import { Bottle } from '../components/Bottle'
import { BottleGrid } from '../components/BottleGrid'
import { ColorPicker } from '../components/ColorPicker'
import { DecorationPicker } from '../components/DecorationPicker'
import { EditorPanel } from '../components/EditorPanel'
import { Header } from '../components/Header'
import { ResultCanvas } from '../components/ResultCanvas'
import { TemplateSelector } from '../components/TemplateSelector'
import { Toolbar } from '../components/Toolbar'
import { createStateFromTemplate, getTemplate, templates } from '../data/templates'
import { getThemeColor } from '../data/themeColors'
import { useLocalDraft } from '../hooks/useLocalDraft'
import { copyShareLink, readStateFromUrl } from '../hooks/useShareState'
import { createPngFilename, downloadDataUrl, exportNodeToPng } from '../lib/exportImage'
import { shouldAskToRestoreDraft } from '../lib/draftPrompt'
import { randomizeBottles } from '../lib/randomize'
import { loadDraft } from '../lib/storage'
import { getSummaryText } from '../lib/summary'
import {
  validateBottleValue,
  validateLabel,
  validateSubtitle,
  validateTitle,
} from '../lib/validation'
import type { AppRoute } from './routes'
import type { AppState } from '../types/appState'
import type { Bottle as BottleType } from '../types/bottle'
import type { BackgroundId, BottleShapeId, FrameId } from '../types/decoration'
import type { ThemeColorId } from '../types/theme'

type InitialApp = {
  route: AppRoute
  state: AppState | null
}

function getInitialApp(): InitialApp {
  const sharedState = readStateFromUrl()
  if (sharedState) return { route: 'decorate', state: sharedState }

  const draft = loadDraft()
  if (
    draft &&
    shouldAskToRestoreDraft() &&
    window.confirm('检测到本地草稿，是否继续编辑？')
  ) {
    return { route: draft.templateId === 'blank' ? 'custom' : 'fill', state: draft }
  }

  return { route: 'home', state: null }
}

function updateBottle(
  bottles: BottleType[],
  id: string,
  patch: Partial<BottleType>,
): BottleType[] {
  return bottles.map((bottle) => (bottle.id === id ? { ...bottle, ...patch } : bottle))
}

type ActionIcon = 'spark' | 'download' | 'share' | 'edit' | 'home'

function ActionSvg({ icon }: { icon: ActionIcon }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2.4,
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      {icon === 'spark' && (
        <path
          {...common}
          d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        />
      )}
      {icon === 'download' && <path {...common} d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14" />}
      {icon === 'share' && (
        <path
          {...common}
          d="M8.5 13.5l7 4m0-11l-7 4M7 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm10 5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0-11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        />
      )}
      {icon === 'edit' && (
        <path {...common} d="M4 20h4l11-11a2.8 2.8 0 00-4-4L4 16v4zM13 6l5 5" />
      )}
      {icon === 'home' && <path {...common} d="M4 11l8-7 8 7v9h-5v-6H9v6H4v-9z" />}
    </svg>
  )
}

function ActionButton({
  icon,
  label,
  variant = 'secondary',
  onClick,
}: {
  icon: ActionIcon
  label: string
  variant?: 'primary' | 'secondary'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={[
        'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-3 text-xs font-black shadow-sm transition active:scale-[0.97]',
        variant === 'primary'
          ? 'bg-neutral-950 text-white'
          : 'border border-neutral-200 bg-white text-neutral-950',
      ].join(' ')}
      onClick={onClick}
    >
      <ActionSvg icon={icon} />
      {label}
    </button>
  )
}

function StepHeader({
  title,
  subtitle,
  onHome,
  onBack,
}: {
  title: string
  subtitle: string
  onHome: () => void
  onBack?: () => void
}) {
  return (
    <section className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-black text-neutral-950">{title}</h1>
        <p className="mt-1 text-sm font-semibold text-neutral-500">{subtitle}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        {onBack && (
          <button className="btn-secondary min-h-10 px-3" type="button" onClick={onBack}>
            返回
          </button>
        )}
        <button className="btn-secondary min-h-10 px-3" type="button" onClick={onHome}>
          主页
        </button>
      </div>
    </section>
  )
}

export function App() {
  const [initialApp] = useState(() => getInitialApp())
  const [route, setRoute] = useState<AppRoute>(initialApp.route)
  const [state, setState] = useState<AppState | null>(initialApp.state)
  const [selectedId, setSelectedId] = useState('bottle-1')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [editorMode, setEditorMode] = useState<'single' | 'grid'>('single')
  const [status, setStatus] = useState('')
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const touchStartX = useRef<number | null>(null)

  useLocalDraft(state)

  const selectedBottle = useMemo(() => {
    return (
      state?.bottles.find((bottle) => bottle.id === selectedId) ?? state?.bottles[0] ?? null
    )
  }, [selectedId, state?.bottles])

  const color = state ? getThemeColor(state.themeColor).hex : getThemeColor('pink').hex
  const selectedIndex = Math.max(
    0,
    state?.bottles.findIndex((bottle) => bottle.id === selectedId) ?? 0,
  )
  const isCustomTemplate = state?.templateId === 'blank'

  function startTemplate(templateId: string) {
    const next = createStateFromTemplate(getTemplate(templateId))
    setState(next)
    setSelectedId(next.bottles[0].id)
    setGeneratedImage(null)
    setStatus('')
    setRoute(templateId === 'blank' ? 'custom' : 'fill')
  }

  function patchState(patch: Partial<AppState>) {
    setState((current) =>
      current ? { ...current, ...patch, updatedAt: Date.now() } : current,
    )
    setGeneratedImage(null)
  }

  function changeBottleValue(id: string, value: number) {
    setState((current) =>
      current
        ? {
            ...current,
            bottles: updateBottle(current.bottles, id, {
              value: validateBottleValue(value),
            }),
            updatedAt: Date.now(),
          }
        : current,
    )
  }

  function changeBottleLabel(id: string, label: string) {
    setState((current) =>
      current
        ? {
            ...current,
            bottles: updateBottle(current.bottles, id, { label: validateLabel(label) }),
            updatedAt: Date.now(),
          }
        : current,
    )
  }

  function moveSelection(delta: number) {
    if (!state) return
    const nextIndex = Math.min(Math.max(selectedIndex + delta, 0), state.bottles.length - 1)
    setSelectedId(state.bottles[nextIndex].id)
  }

  function handleSingleTouchEnd(clientX: number) {
    if (touchStartX.current === null) return
    const delta = clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 40) return
    moveSelection(delta < 0 ? 1 : -1)
  }

  async function generateImage() {
    if (!canvasRef.current) return
    setStatus('正在生成图片...')
    try {
      const dataUrl = await exportNodeToPng(canvasRef.current)
      setGeneratedImage(dataUrl)
      setStatus('图片已生成，移动端可长按保存。')
    } catch {
      setStatus('图片生成失败，请稍后重试，或直接截图保存。')
    }
  }

  async function downloadImage() {
    if (!canvasRef.current) return
    setStatus('正在生成 PNG...')
    try {
      const dataUrl = generatedImage ?? (await exportNodeToPng(canvasRef.current))
      setGeneratedImage(dataUrl)
      downloadDataUrl(dataUrl, createPngFilename())
      setStatus('PNG 已开始下载；如果浏览器拦截下载，可长按下方图片保存。')
    } catch {
      setStatus('图片下载失败，请先生成图片，或直接截图保存。')
    }
  }

  async function share() {
    if (!state) return
    try {
      await copyShareLink(state)
      setStatus('分享链接已复制。')
    } catch {
      setStatus('复制失败，请检查浏览器权限。')
    }
  }

  function resetCurrentTemplate() {
    if (!state) return
    startTemplate(state.templateId)
  }

  function goHome() {
    setRoute('home')
    setStatus('')
  }

  function goBackFromDecorate() {
    setRoute(isCustomTemplate ? 'custom' : 'fill')
    setStatus('')
  }

  function editFromResult() {
    setRoute(isCustomTemplate ? 'custom' : 'decorate')
    setStatus('')
  }

  function renderBottleEditor() {
    if (!state || !selectedBottle) return null

    return (
      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black">瓶子矩阵</h2>
          <div className="grid grid-cols-2 rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
            <button
              className={
                editorMode === 'single'
                  ? 'min-h-10 rounded-full bg-neutral-950 px-4 py-1 text-sm font-black text-white'
                  : 'min-h-10 rounded-full px-4 py-1 text-sm font-black text-neutral-500'
              }
              type="button"
              onClick={() => setEditorMode('single')}
            >
              逐题填写
            </button>
            <button
              className={
                editorMode === 'grid'
                  ? 'min-h-10 rounded-full bg-neutral-950 px-4 py-1 text-sm font-black text-white'
                  : 'min-h-10 rounded-full px-4 py-1 text-sm font-black text-neutral-500'
              }
              type="button"
              onClick={() => setEditorMode('grid')}
            >
              网格总览
            </button>
          </div>
        </div>
        {editorMode === 'single' ? (
          <div
            className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-5 text-center shadow-sm"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null
            }}
            onTouchEnd={(event) => {
              handleSingleTouchEnd(event.changedTouches[0]?.clientX ?? 0)
            }}
          >
            <div className="flex items-center justify-between text-sm font-black text-neutral-500">
              <span>
                第 {selectedIndex + 1} / {state.bottles.length} 瓶
              </span>
              <span>还剩 {state.bottles.length - selectedIndex - 1} 道</span>
            </div>
            <Bottle
              bottle={selectedBottle}
              color={color}
              editable
              focus
              showPercent
              shapeId={state.bottleShapeId}
              onValueChange={changeBottleValue}
            />
            <div className="grid grid-cols-2 gap-3 rounded-[24px] bg-neutral-50 p-2">
              <button
                className="min-h-12 rounded-2xl border border-neutral-200 bg-white text-sm font-black shadow-sm active:scale-[0.98]"
                type="button"
                onClick={() => moveSelection(-1)}
              >
                上一瓶
              </button>
              <button
                className="min-h-12 rounded-2xl bg-neutral-950 text-sm font-black text-white shadow-sm active:scale-[0.98]"
                type="button"
                onClick={() => moveSelection(1)}
              >
                下一瓶
              </button>
            </div>
          </div>
        ) : (
          <BottleGrid
            bottles={state.bottles}
            color={color}
            editable
            showPercent={state.showPercent}
            selectedId={selectedId}
            shapeId={state.bottleShapeId}
            onSelect={setSelectedId}
            onValueChange={changeBottleValue}
          />
        )}
      </section>
    )
  }

  function renderToolbar() {
    if (!state) return null

    return (
      <Toolbar
        onRandomize={() => patchState({ bottles: randomizeBottles(state.bottles) })}
        onClear={() =>
          patchState({
            bottles: state.bottles.map((bottle) => ({ ...bottle, value: 0 })),
          })
        }
        onFull={() =>
          patchState({
            bottles: state.bottles.map((bottle) => ({ ...bottle, value: 100 })),
          })
        }
        onReset={resetCurrentTemplate}
      />
    )
  }

  function renderDecorationControls() {
    if (!state) return null

    return (
      <>
        <section className="grid gap-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
          <span className="text-xs font-black text-neutral-950">液体颜色</span>
          <ColorPicker
            value={state.themeColor}
            onChange={(themeColor: ThemeColorId) => patchState({ themeColor })}
          />
        </section>
        <DecorationPicker
          backgroundId={state.backgroundId}
          frameId={state.frameId}
          bottleShapeId={state.bottleShapeId}
          onBackgroundChange={(backgroundId: BackgroundId) => patchState({ backgroundId })}
          onFrameChange={(frameId: FrameId) => patchState({ frameId })}
          onBottleShapeChange={(bottleShapeId: BottleShapeId) =>
            patchState({ bottleShapeId })
          }
        />
      </>
    )
  }

  function renderPreview() {
    if (!state) return null

    return (
      <section className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-neutral-950">生成图预览</h2>
          <span className="text-xs font-bold text-neutral-500">背景/边框实时预览</span>
        </div>
        <div className="flex aspect-[9/16] justify-center overflow-hidden rounded-lg bg-[#fff7f4]">
          <div className="origin-top scale-[0.29]">
            <ResultCanvas state={state} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onHome={goHome} />

      {route === 'home' && (
        <main className="mx-auto grid max-w-3xl gap-8 px-4 py-8">
          <section className="grid gap-4">
            <h1 className="text-4xl font-black leading-tight text-neutral-950">
              瓶子评价图生成器
            </h1>
            <p className="text-lg font-semibold text-neutral-600">
              自由填写属性，滑动填满瓶子，生成你的专属 9:16 评价梗图。
            </p>
          </section>
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <BottleGrid bottles={templates[0].bottles.slice(0, 6)} color={color} />
          </section>
          <TemplateSelector onSelect={startTemplate} />
        </main>
      )}

      {route === 'fill' && state && selectedBottle && (
        <main className="mx-auto grid max-w-3xl gap-6 px-4 py-6">
          <StepHeader
            title={state.title}
            subtitle="先把 36 个瓶子填完，下一步再选背景和样式。"
            onHome={goHome}
          />
          {renderBottleEditor()}
          {renderToolbar()}
          <button
            className="btn-primary sticky bottom-4 z-10"
            type="button"
            onClick={() => {
              setRoute('decorate')
              setStatus('')
            }}
          >
            下一步：查看预览
          </button>
        </main>
      )}

      {route === 'custom' && state && selectedBottle && (
        <main className="mx-auto grid max-w-3xl gap-6 px-4 py-6">
          <StepHeader
            title="自定义瓶子"
            subtitle="标题、标签、瓶子和生成图样式都可以改。"
            onHome={goHome}
          />
          {renderBottleEditor()}
          {renderToolbar()}
          <EditorPanel
            title={state.title}
            subtitle={state.subtitle}
            themeColor={state.themeColor}
            selectedBottle={selectedBottle}
            onTitleChange={(title) => patchState({ title: validateTitle(title) })}
            onSubtitleChange={(subtitle) =>
              patchState({ subtitle: validateSubtitle(subtitle) })
            }
            onThemeChange={(themeColor: ThemeColorId) => patchState({ themeColor })}
            onLabelChange={changeBottleLabel}
            onValueChange={changeBottleValue}
          />
          {renderDecorationControls()}
          {renderPreview()}
          <button
            className="btn-primary sticky bottom-4 z-10"
            type="button"
            onClick={() => {
              setRoute('decorate')
              setStatus('')
            }}
          >
            查看最终预览
          </button>
        </main>
      )}

      {route === 'decorate' && state && (
        <main className="mx-auto grid max-w-3xl gap-6 px-4 py-6">
          <StepHeader
            title="选择生成图样式"
            subtitle="确认背景、瓶子外观和颜色，再生成图片。"
            onHome={goHome}
            onBack={goBackFromDecorate}
          />
          {renderDecorationControls()}
          {renderPreview()}
          <button
            className="btn-primary sticky bottom-4 z-10"
            type="button"
            onClick={() => {
              setRoute('result')
              setStatus('')
            }}
          >
            生成图片
          </button>
        </main>
      )}

      {route === 'result' && state && (
        <main className="mx-auto grid max-w-3xl gap-5 px-4 py-6">
          <section className="grid gap-2">
            <h1 className="text-2xl font-black">{state.title}</h1>
            <p className="font-semibold text-neutral-500">
              {getSummaryText(state.bottles)}
            </p>
          </section>
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            {generatedImage ? (
              <img className="block w-full" src={generatedImage} alt="生成的瓶子评价图" />
            ) : (
              <div className="flex aspect-[9/16] w-full justify-center overflow-hidden bg-[#fff7f4]">
                <div className="origin-top scale-[0.34] sm:scale-[0.42] md:scale-[0.48]">
                  <ResultCanvas state={state} />
                </div>
              </div>
            )}
          </div>
          <div className="sticky bottom-3 z-20 grid grid-cols-5 gap-2 rounded-[24px] border border-neutral-200 bg-white/95 p-2 shadow-xl backdrop-blur">
            <ActionButton
              icon="spark"
              label="生成"
              variant="primary"
              onClick={generateImage}
            />
            <ActionButton
              icon="download"
              label="下载"
              variant="primary"
              onClick={downloadImage}
            />
            <ActionButton icon="share" label="分享" onClick={share} />
            <ActionButton icon="edit" label="编辑" onClick={editFromResult} />
            <ActionButton icon="home" label="重做" onClick={goHome} />
          </div>
          {status && (
            <p className="rounded-lg bg-white p-3 text-sm font-bold text-neutral-700">
              {status}
            </p>
          )}
        </main>
      )}

      {state && (
        <div className="fixed -left-[9999px] top-0" aria-hidden="true">
          <div ref={canvasRef}>
            <ResultCanvas state={state} />
          </div>
        </div>
      )}
    </div>
  )
}
