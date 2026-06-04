import { themeColors } from '../data/themeColors'
import type { ThemeColorId } from '../types/theme'

type ColorPickerProps = {
  value: ThemeColorId
  onChange: (value: ThemeColorId) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="液体颜色">
      {themeColors.map((color) => (
        <button
          key={color.id}
          type="button"
          className={[
            'flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-semibold',
            value === color.id
              ? 'border-neutral-950 bg-white'
              : 'border-neutral-200 bg-neutral-50',
          ].join(' ')}
          onClick={() => onChange(color.id)}
          role="radio"
          aria-checked={value === color.id}
        >
          <span
            className="h-5 w-5 rounded-full border border-neutral-900"
            style={{ backgroundColor: color.hex }}
          />
          {color.name}
        </button>
      ))}
    </div>
  )
}
