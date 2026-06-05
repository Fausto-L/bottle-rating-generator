import { useEffect, useState } from 'react'
import { themeColors } from '../data/themeColors'
import type { ThemeColorId } from '../types/theme'

type ColorPickerProps = {
  value: ThemeColorId
  onChange: (value: ThemeColorId) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 1200)
    return () => window.clearTimeout(timer)
  }, [notice])

  return (
    <div className="relative">
      <div
        className="flex items-center justify-between gap-3 rounded-2xl bg-neutral-900 px-5 py-4"
        role="radiogroup"
        aria-label="液体颜色"
      >
        {themeColors.map((color) => (
          <button
            key={color.id}
            type="button"
            className={[
              'grid h-12 w-12 place-items-center rounded-full transition active:scale-95',
              value === color.id ? 'bg-white/60 ring-2 ring-white/80' : 'bg-transparent',
            ].join(' ')}
            onClick={() => {
              onChange(color.id)
              setNotice(color.name)
            }}
            role="radio"
            aria-label={color.name}
            aria-checked={value === color.id}
          >
            <span
              className={[
                'block rounded-full border-2 border-neutral-950',
                value === color.id ? 'h-10 w-10' : 'h-9 w-9',
              ].join(' ')}
              style={{ backgroundColor: color.hex }}
            />
          </button>
        ))}
      </div>
      {notice && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-color-toast rounded-full bg-neutral-950 px-4 py-2 text-sm font-black text-white shadow-xl">
          {notice}
        </div>
      )}
    </div>
  )
}
