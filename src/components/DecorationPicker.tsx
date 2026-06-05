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
    <section className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="grid gap-2">
        <h2 className="text-xs font-black text-neutral-950">生成图背景</h2>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {posterBackgrounds.map((background) => (
            <button
              key={background.id}
              type="button"
              className={[
                'grid w-[104px] shrink-0 gap-1 rounded-lg border p-1.5 text-left transition active:scale-[0.98]',
                backgroundId === background.id
                  ? 'border-neutral-950 bg-neutral-100 text-neutral-950 ring-2 ring-neutral-950/10'
                  : 'border-neutral-200 bg-white text-neutral-950',
              ].join(' ')}
              onClick={() => onBackgroundChange(background.id)}
              aria-pressed={backgroundId === background.id}
            >
              <span
                className="h-14 rounded-md border border-neutral-200 bg-cover bg-center"
                style={{ backgroundImage: `url('${baseUrl}${background.file}')` }}
              />
              <span className="truncate text-center text-[11px] font-black leading-5">
                {background.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-xs font-black text-neutral-950">生成图边框</h2>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {posterFrames.map((frame) => (
            <button
              key={frame.id}
              type="button"
              className={[
                'grid w-[116px] shrink-0 gap-1 rounded-lg border p-1.5 transition active:scale-[0.98]',
                frameId === frame.id
                  ? 'border-neutral-950 bg-neutral-100 text-neutral-950 ring-2 ring-neutral-950/10'
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
              <span className="truncate text-[11px] font-black leading-5">
                {frame.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-xs font-black text-neutral-950">瓶子外观</h2>
        <div className="grid grid-cols-3 gap-2">
          {bottleShapes.map((shape) => (
            <button
              key={shape.id}
              type="button"
              className={[
                'grid min-h-[92px] justify-items-center gap-1 rounded-lg border p-1.5 transition active:scale-[0.98]',
                bottleShapeId === shape.id
                  ? 'border-neutral-950 bg-neutral-100 text-neutral-950 ring-2 ring-neutral-950/10'
                  : 'border-neutral-200 bg-white text-neutral-950',
              ].join(' ')}
              onClick={() => onBottleShapeChange(shape.id)}
              aria-pressed={bottleShapeId === shape.id}
            >
              <div className="flex h-14 items-center justify-center overflow-hidden">
                <div className="scale-[0.48]">
                  <Bottle
                    bottle={{ id: `preview-${shape.id}`, label: '', value: 55 }}
                    color="#F48FB1"
                    shapeId={shape.id}
                  />
                </div>
              </div>
              <span className="truncate text-[11px] font-black leading-5">
                {shape.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
