import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../app/App'
import { Bottle } from '../components/Bottle'
import { BottleGrid } from '../components/BottleGrid'
import { DecorationPicker } from '../components/DecorationPicker'
import { ResultCanvas } from '../components/ResultCanvas'
import { TemplateSelector } from '../components/TemplateSelector'
import { Toolbar } from '../components/Toolbar'
import { createStateFromTemplate, templates } from '../data/templates'

describe('components', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders bottle value text', () => {
    render(
      <Bottle
        bottle={{ id: 'test', label: '靠谱', value: 75 }}
        color="#F48FB1"
        showPercent
      />,
    )

    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders 36 bottles in a grid', () => {
    render(<BottleGrid bottles={templates[0].bottles} color="#F48FB1" />)
    expect(screen.getAllByRole('button')).toHaveLength(36)
  })

  it('result canvas excludes editor controls', () => {
    const state = createStateFromTemplate(templates[0])
    render(<ResultCanvas state={state} />)
    expect(screen.getByTestId('result-canvas')).toBeInTheDocument()
    expect(screen.queryByText('保存图片')).not.toBeInTheDocument()
  })

  it('renders background preview controls', () => {
    render(
      <DecorationPicker
        backgroundId="scrapbook"
        frameId="sticker"
        bottleShapeId="classic"
        onBackgroundChange={() => undefined}
        onFrameChange={() => undefined}
        onBottleShapeChange={() => undefined}
      />,
    )

    expect(screen.getByRole('button', { name: /手账贴纸/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /邮票锯齿/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /经典瓶/ })).toBeInTheDocument()
  })

  it('renders six template entries with custom last', () => {
    render(<TemplateSelector onSelect={() => undefined} />)
    const buttons = screen.getAllByRole('button')

    expect(buttons).toHaveLength(6)
    expect(buttons[5]).toHaveTextContent('空白自定义模板')
  })

  it('keeps template flow focused on bottle filling', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /让你的女友评价你/ }))

    expect(screen.getByText('瓶子矩阵')).toBeInTheDocument()
    expect(screen.queryByText('主标题')).not.toBeInTheDocument()
    expect(screen.queryByText('生成图背景')).not.toBeInTheDocument()
  })

  it('opens full editing controls for the custom template', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /空白自定义模板/ }))

    expect(screen.getByText('瓶子矩阵')).toBeInTheDocument()
    expect(screen.getByText('主标题')).toBeInTheDocument()
    expect(screen.getByText('生成图背景')).toBeInTheDocument()
  })

  it('renders icon toolbar actions', () => {
    render(
      <Toolbar
        onRandomize={() => undefined}
        onClear={() => undefined}
        onFull={() => undefined}
        onReset={() => undefined}
      />,
    )

    expect(screen.getByRole('button', { name: /随机/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /清空/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /拉满/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /默认/ })).toBeInTheDocument()
  })
})
