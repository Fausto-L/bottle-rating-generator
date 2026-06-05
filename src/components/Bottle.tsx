import { useEffect, useId, useMemo, useState } from 'react'
import type { Bottle as BottleType } from '../types/bottle'
import { useBottleDrag } from '../hooks/useBottleDrag'
import type { BottleShapeId } from '../types/decoration'

type BottleProps = {
  bottle: BottleType
  color: string
  editable?: boolean
  showPercent?: boolean
  compact?: boolean
  poster?: boolean
  focus?: boolean
  shapeId?: BottleShapeId
  onValueChange?: (id: string, value: number) => void
  onSelect?: (id: string) => void
}

const shapePaths: Record<BottleShapeId, string> = {
  classic:
    'M34 7h28v22c0 6 18 10 18 28v46c0 10-7 17-17 17H33c-10 0-17-7-17-17V57c0-18 18-22 18-28V7Z',
  star: 'M48 8l10 28 30 2-23 19 8 30-25-16-25 16 8-30L8 38l30-2 10-28Z',
  shell: 'M48 13c22 0 38 18 38 43 0 36-16 61-38 61S10 92 10 56c0-25 16-43 38-43Z',
}

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 9973
  }
  return hash
}

function capForShape(shapeId: BottleShapeId) {
  if (shapeId === 'star') {
    return (
      <path
        d="M43 31h10l3 12H40l3-12Z"
        fill="#d8ecff"
        stroke="#111"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    )
  }

  if (shapeId === 'shell') {
    return (
      <path
        d="M38 20c6-7 14-7 20 0l-3 12H41l-3-12Z"
        fill="#d8ecff"
        stroke="#111"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    )
  }

  return (
    <path
      d="M36 1h24v12H36z"
      fill="#d8ecff"
      stroke="#111"
      strokeLinejoin="round"
      strokeWidth="4"
    />
  )
}

export function Bottle({
  bottle,
  color,
  editable = false,
  showPercent = false,
  compact = false,
  poster = false,
  focus = false,
  shapeId = 'classic',
  onValueChange,
  onSelect,
}: BottleProps) {
  const reactId = useId()
  const [tiltOffset, setTiltOffset] = useState(0)
  const { fillRef, activeValue, isDragging, pointerHandlers } = useBottleDrag({
    value: bottle.value,
    onChange: (value) => onValueChange?.(bottle.id, value),
  })
  const liquidHeight = (activeValue / 100) * 76
  const liquidY = 108 - liquidHeight
  const clipId = `clip-${reactId.replace(/:/g, '')}-${bottle.id}`
  const outlinePath = shapePaths[shapeId]
  const wave = useMemo(() => {
    const seed = hashString(`${bottle.id}-${bottle.value}-${shapeId}`)
    return {
      amplitude: 4 + (seed % 5),
      phase: (seed % 11) - 5,
      pull: 12 + (seed % 10),
      offset: (seed % 9) - 4,
    }
  }, [bottle.id, bottle.value, shapeId])
  const liveTiltOffset = editable && focus && !poster ? tiltOffset : 0
  const waveY = liquidY + wave.offset

  useEffect(() => {
    if (!editable || !focus || poster) return
    if (!('DeviceOrientationEvent' in window)) return

    function handleOrientation(event: DeviceOrientationEvent) {
      const gamma = event.gamma ?? 0
      setTiltOffset(Math.max(-7, Math.min(7, gamma / 6)))
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [editable, focus, poster])

  return (
    <button
      className={[
        'group relative flex min-w-0 flex-col items-center text-center',
        poster ? 'gap-2' : 'gap-1',
      ].join(' ')}
      type="button"
      onClick={() => onSelect?.(bottle.id)}
      aria-label={`${bottle.label}，当前 ${activeValue}%`}
    >
      <svg
        className={[
          'touch-none overflow-visible',
          focus
            ? 'h-64 w-48'
            : poster
              ? 'h-[136px] w-[104px]'
              : compact
                ? 'h-24 w-20'
                : 'h-28 w-24',
          editable ? 'cursor-pointer' : '',
        ].join(' ')}
        viewBox="0 0 96 128"
        role="img"
        aria-label={`${bottle.label} 水位 ${activeValue}%`}
        {...(editable ? pointerHandlers : {})}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={outlinePath} />
          </clipPath>
        </defs>
        <path
          d={outlinePath}
          fill="#fff"
          stroke="#111"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        {capForShape(shapeId)}
        <rect ref={fillRef} x="18" y="32" width="60" height="76" fill="transparent" />
        <g clipPath={`url(#${clipId})`}>
          <g
            className={poster ? undefined : 'bottle-liquid-bob'}
            transform={`translate(${liveTiltOffset} 0)`}
          >
            <path
              className={poster ? undefined : 'bottle-liquid-wave'}
              d={`M4 ${waveY} C${18 + wave.phase} ${waveY - wave.amplitude}, ${34 + wave.phase} ${waveY + wave.amplitude}, ${48} ${waveY} S${72 - wave.phase} ${waveY - wave.amplitude}, 92 ${waveY + wave.pull / 8} V128 H4 Z`}
              fill={color}
              opacity="0.78"
            />
            <path
              className={poster ? undefined : 'bottle-liquid-wave'}
              d={`M4 ${waveY} C${18 + wave.phase} ${waveY - wave.amplitude}, ${34 + wave.phase} ${waveY + wave.amplitude}, ${48} ${waveY} S${72 - wave.phase} ${waveY - wave.amplitude}, 92 ${waveY + wave.pull / 8}`}
              fill="none"
              stroke={color}
              strokeLinecap="round"
              strokeWidth="5"
            />
          </g>
        </g>
        {showPercent && (
          <text
            x="48"
            y="68"
            textAnchor="middle"
            className="fill-neutral-950 text-[17px] font-bold"
          >
            {activeValue}%
          </text>
        )}
      </svg>
      <span
        className={[
          'line-clamp-2 max-w-full break-all font-black leading-tight text-neutral-950',
          focus
            ? 'h-16 text-2xl'
            : poster
              ? 'h-[62px] text-[30px]'
              : 'h-9 text-base font-semibold',
        ].join(' ')}
      >
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
