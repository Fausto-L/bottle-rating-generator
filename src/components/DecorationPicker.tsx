import { bottleShapes, posterBackgrounds, posterFrames } from '../data/decorations'
import type { BackgroundId, BottleShapeId, FrameId } from '../types/decoration'

type DecorationPickerProps = {
  backgroundId: BackgroundId
  frameId: FrameId
  bottleShapeId: BottleShapeId
  onBackgroundChange: (id: BackgroundId) => void
  onFrameChange: (id: FrameId) => void
  onBottleShapeChange: (id: BottleShapeId) => void
}

export function DecorationPicker({
  backgroundId,
  frameId,
  bottleShapeId,
  onBackgroundChange,
  onFrameChange,
  onBottleShapeChange,
}: DecorationPickerProps) {
  return (
    <section className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="grid gap-2">
        <h2 className="text-sm font-black text-neutral-950">生成图背景</h2>
        <div className="grid grid-cols-3 gap-2">
          {posterBackgrounds.map((background) => (
            <button
              key={background.id}
              type="button"
              className={backgroundId === background.id ? 'btn-primary' : 'btn-secondary'}
              onClick={() => onBackgroundChange(background.id)}
            >
              {background.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-sm font-black text-neutral-950">生成图边框</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {posterFrames.map((frame) => (
            <button
              key={frame.id}
              type="button"
              className={frameId === frame.id ? 'btn-primary' : 'btn-secondary'}
              onClick={() => onFrameChange(frame.id)}
            >
              {frame.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-sm font-black text-neutral-950">瓶子外观</h2>
        <div className="grid grid-cols-3 gap-2">
          {bottleShapes.map((shape) => (
            <button
              key={shape.id}
              type="button"
              className={bottleShapeId === shape.id ? 'btn-primary' : 'btn-secondary'}
              onClick={() => onBottleShapeChange(shape.id)}
            >
              {shape.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
