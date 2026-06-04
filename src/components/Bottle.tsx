import type { Bottle as BottleType } from '../types/bottle'
import { useBottleDrag } from '../hooks/useBottleDrag'

type BottleProps = {
  bottle: BottleType
  color: string
  editable?: boolean
  showPercent?: boolean
  compact?: boolean
  onValueChange?: (id: string, value: number) => void
  onSelect?: (id: string) => void
}

export function Bottle({
  bottle,
  color,
  editable = false,
  showPercent = false,
  compact = false,
  onValueChange,
  onSelect,
}: BottleProps) {
  const { fillRef, activeValue, isDragging, pointerHandlers } = useBottleDrag({
    value: bottle.value,
    onChange: (value) => onValueChange?.(bottle.id, value),
  })
  const liquidHeight = (activeValue / 100) * 72
  const liquidY = 104 - liquidHeight

  return (
    <button
      className="group relative flex min-w-0 flex-col items-center gap-1 text-center"
      type="button"
      onClick={() => onSelect?.(bottle.id)}
      aria-label={`${bottle.label}，当前 ${activeValue}%`}
    >
      <svg
        className={[
          'touch-none overflow-visible',
          compact ? 'h-20 w-14' : 'h-24 w-16',
          editable ? 'cursor-pointer' : '',
        ].join(' ')}
        viewBox="0 0 72 128"
        role="img"
        aria-label={`${bottle.label} 水位 ${activeValue}%`}
        {...(editable ? pointerHandlers : {})}
      >
        <defs>
          <clipPath id={`clip-${bottle.id}`}>
            <path d="M28 8h16v23c0 5 14 8 14 25v49c0 8-5 13-13 13H27c-8 0-13-5-13-13V56c0-17 14-20 14-25V8Z" />
          </clipPath>
        </defs>
        <path
          d="M28 8h16v23c0 5 14 8 14 25v49c0 8-5 13-13 13H27c-8 0-13-5-13-13V56c0-17 14-20 14-25V8Z"
          fill="#fff"
          stroke="#111"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <rect ref={fillRef} x="14" y="32" width="44" height="72" fill="transparent" />
        <g clipPath={`url(#clip-${bottle.id})`}>
          <rect
            x="12"
            y={liquidY}
            width="48"
            height={liquidHeight + 18}
            fill={color}
            opacity="0.75"
          />
          <path
            d={`M12 ${liquidY + 2} C24 ${liquidY - 2}, 36 ${liquidY + 6}, 60 ${liquidY + 1}`}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeWidth="4"
          />
        </g>
        {showPercent && (
          <text
            x="36"
            y="68"
            textAnchor="middle"
            className="fill-neutral-950 text-[17px] font-bold"
          >
            {activeValue}%
          </text>
        )}
      </svg>
      <span className="line-clamp-2 h-9 max-w-full break-all text-sm font-semibold leading-tight text-neutral-900">
        {bottle.label}
      </span>
      {isDragging && (
        <span className="absolute -top-3 rounded-full bg-neutral-950 px-2 py-1 text-xs font-bold text-white shadow-lg">
          {activeValue}%
        </span>
      )}
    </button>
  )
}
