import { bottleShapes, posterBackgrounds, posterFrames } from '../data/decorations'
import type { BackgroundId, BottleShapeId, FrameId } from '../types/decoration'
import { Bottle } from './Bottle'

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
  const baseUrl = import.meta.env.BASE_URL

  return (
    <section className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="grid gap-2">
        <h2 className="text-sm font-black text-neutral-950">生成图背景</h2>
        <div className="grid grid-cols-3 gap-2">
          {posterBackgrounds.map((background) => (
            <button
              key={background.id}
              type="button"
              className={[
                'grid gap-2 rounded-lg border p-2 text-left transition active:scale-[0.98]',
                backgroundId === background.id
                  ? 'border-neutral-950 bg-neutral-950 text-white'
                  : 'border-neutral-200 bg-white text-neutral-950',
              ].join(' ')}
              onClick={() => onBackgroundChange(background.id)}
              aria-pressed={backgroundId === background.id}
            >
              <span
                className="h-20 rounded-md border border-neutral-200 bg-cover bg-center"
                style={{ backgroundImage: `url('${baseUrl}${background.file}')` }}
              />
              <span className="text-center text-xs font-black">{background.name}</span>
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
              className={[
                'grid gap-2 rounded-lg border p-2 transition active:scale-[0.98]',
                frameId === frame.id
                  ? 'border-neutral-950 bg-neutral-950 text-white'
                  : 'border-neutral-200 bg-white text-neutral-950',
              ].join(' ')}
              onClick={() => onFrameChange(frame.id)}
              aria-pressed={frameId === frame.id}
            >
              <span
                className={`decoration-frame-preview decoration-frame-preview-${frame.id}`}
              >
                <span />
              </span>
              <span className="text-xs font-black">{frame.name}</span>
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
              className={[
                'grid justify-items-center gap-1 rounded-lg border p-2 transition active:scale-[0.98]',
                bottleShapeId === shape.id
                  ? 'border-neutral-950 bg-neutral-950 text-white'
                  : 'border-neutral-200 bg-white text-neutral-950',
              ].join(' ')}
              onClick={() => onBottleShapeChange(shape.id)}
              aria-pressed={bottleShapeId === shape.id}
            >
              <div className="scale-75">
                <Bottle
                  bottle={{ id: `preview-${shape.id}`, label: '', value: 55 }}
                  color="#F48FB1"
                  shapeId={shape.id}
                />
              </div>
              <span className="text-xs font-black">{shape.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
