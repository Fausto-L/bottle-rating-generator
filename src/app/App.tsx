import { useMemo, useRef, useState } from 'react'
import { BottleGrid } from '../components/BottleGrid'
import { EditorPanel } from '../components/EditorPanel'
import { Header } from '../components/Header'
import { ResultCanvas } from '../components/ResultCanvas'
import { TemplateSelector } from '../components/TemplateSelector'
import { Toolbar } from '../components/Toolbar'
import { createStateFromTemplate, getTemplate, templates } from '../data/templates'
import { getThemeColor } from '../data/themeColors'
import { useLocalDraft } from '../hooks/useLocalDraft'
import { copyShareLink, readStateFromUrl } from '../hooks/useShareState'
import { exportNodeToPng } from '../lib/exportImage'
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
import type { Bottle } from '../types/bottle'
import type { ThemeColorId } from '../types/theme'

function getInitialState(): AppState | null {
  const sharedState = readStateFromUrl()
  if (sharedState) return sharedState

  const draft = loadDraft()
  if (draft && window.confirm('检测到本地草稿，是否继续编辑？')) return draft

  return null
}

function updateBottle(bottles: Bottle[], id: string, patch: Partial<Bottle>): Bottle[] {
  return bottles.map((bottle) => (bottle.id === id ? { ...bottle, ...patch } : bottle))
}

export function App() {
  const [route, setRoute] = useState<AppRoute>(() =>
    readStateFromUrl() ? 'editor' : 'home',
  )
  const [state, setState] = useState<AppState | null>(() => getInitialState())
  const [selectedId, setSelectedId] = useState('bottle-1')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const canvasRef = useRef<HTMLDivElement | null>(null)

  useLocalDraft(state)

  const selectedBottle = useMemo(() => {
    return (
      state?.bottles.find((bottle) => bottle.id === selectedId) ?? state?.bottles[0] ?? null
    )
  }, [selectedId, state?.bottles])

  const color = state ? getThemeColor(state.themeColor).hex : getThemeColor('pink').hex

  function startTemplate(templateId: string) {
    const next = createStateFromTemplate(getTemplate(templateId))
    setState(next)
    setSelectedId(next.bottles[0].id)
    setGeneratedImage(null)
    setStatus('')
    setRoute('editor')
  }

  function patchState(patch: Partial<AppState>) {
    setState((current) =>
      current ? { ...current, ...patch, updatedAt: Date.now() } : current,
    )
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header
        onHome={() => {
          setRoute('home')
          setStatus('')
        }}
      />

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

      {route === 'editor' && state && selectedBottle && (
        <main className="mx-auto grid max-w-3xl gap-6 px-4 py-6">
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
          <section className="grid gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black">瓶子矩阵</h2>
              <span className="text-sm font-semibold text-neutral-500">
                在瓶内上下滑动填水位
              </span>
            </div>
            <BottleGrid
              bottles={state.bottles}
              color={color}
              editable
              showPercent={state.showPercent}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onValueChange={changeBottleValue}
            />
          </section>
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
              <div className="aspect-[9/16] w-full overflow-hidden bg-[#fff9fb]">
                <div className="origin-top-left scale-[0.33] sm:scale-[0.42]">
                  <ResultCanvas state={state} />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-primary" type="button" onClick={generateImage}>
              保存图片
            </button>
            <button className="btn-secondary" type="button" onClick={share}>
              复制分享链接
            </button>
            <button
              className="btn-secondary"
              type="button"
              onClick={() => setRoute('editor')}
            >
              返回编辑
            </button>
            <button
              className="btn-secondary"
              type="button"
              onClick={() => setRoute('home')}
            >
              重新制作
            </button>
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
