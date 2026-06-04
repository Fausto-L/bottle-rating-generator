import { snapPoints } from '../lib/fill'
import { validateLabel, validateSubtitle, validateTitle } from '../lib/validation'
import type { Bottle } from '../types/bottle'
import type { ThemeColorId } from '../types/theme'
import { ColorPicker } from './ColorPicker'

type EditorPanelProps = {
  title: string
  subtitle: string
  themeColor: ThemeColorId
  selectedBottle: Bottle
  onTitleChange: (value: string) => void
  onSubtitleChange: (value: string) => void
  onThemeChange: (value: ThemeColorId) => void
  onLabelChange: (id: string, value: string) => void
  onValueChange: (id: string, value: number) => void
}

export function EditorPanel({
  title,
  subtitle,
  themeColor,
  selectedBottle,
  onTitleChange,
  onSubtitleChange,
  onThemeChange,
  onLabelChange,
  onValueChange,
}: EditorPanelProps) {
  return (
    <section className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-bold">主标题</span>
        <input
          className="input"
          value={title}
          onChange={(event) => onTitleChange(validateTitle(event.target.value))}
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-bold">副标题</span>
        <input
          className="input"
          value={subtitle}
          onChange={(event) => onSubtitleChange(validateSubtitle(event.target.value))}
        />
      </label>
      <div className="grid gap-2">
        <span className="text-sm font-bold">液体颜色</span>
        <ColorPicker value={themeColor} onChange={onThemeChange} />
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-bold">当前瓶子标签</span>
        <input
          className="input"
          value={selectedBottle.label}
          onChange={(event) =>
            onLabelChange(selectedBottle.id, validateLabel(event.target.value))
          }
        />
      </label>
      <div className="grid gap-2">
        <span className="text-sm font-bold">快捷档位</span>
        <div className="grid grid-cols-5 gap-2">
          {snapPoints.map((point) => (
            <button
              className="btn-secondary px-1"
              type="button"
              key={point}
              onClick={() => onValueChange(selectedBottle.id, point)}
            >
              {point}%
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
