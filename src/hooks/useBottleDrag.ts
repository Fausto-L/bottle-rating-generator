import { useCallback, useRef, useState } from 'react'
import { snapValue, valueFromPointer } from '../lib/fill'

type UseBottleDragOptions = {
  value: number
  onChange?: (value: number) => void
}

export function useBottleDrag({ value, onChange }: UseBottleDragOptions) {
  const fillRef = useRef<SVGRectElement | null>(null)
  const [draftValue, setDraftValue] = useState<number | null>(null)
  const activeValue = draftValue ?? value

  const updateFromPointer = useCallback(
    (clientY: number, final = false) => {
      const rect = fillRef.current?.getBoundingClientRect()
      if (!rect) return
      const raw = valueFromPointer(clientY, rect.top, rect.bottom)
      const next = final ? snapValue(raw) : Math.round(raw)
      setDraftValue(final ? null : next)
      onChange?.(next)
    },
    [onChange],
  )

  const onPointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId)
      updateFromPointer(event.clientY)
    },
    [updateFromPointer],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
      updateFromPointer(event.clientY)
    },
    [updateFromPointer],
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      updateFromPointer(event.clientY, true)
      navigator.vibrate?.(10)
    },
    [updateFromPointer],
  )

  return {
    fillRef,
    activeValue,
    isDragging: draftValue !== null,
    pointerHandlers: { onPointerDown, onPointerMove, onPointerUp },
  }
}
