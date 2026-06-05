import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Bottle } from '../components/Bottle'
import { BottleGrid } from '../components/BottleGrid'
import { DecorationPicker } from '../components/DecorationPicker'
import { ResultCanvas } from '../components/ResultCanvas'
import { createStateFromTemplate, templates } from '../data/templates'

describe('components', () => {
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
})
