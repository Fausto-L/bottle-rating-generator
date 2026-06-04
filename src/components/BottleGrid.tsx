import type { Bottle as BottleType } from '../types/bottle'
import type { BottleShapeId } from '../types/decoration'
import { Bottle } from './Bottle'

type BottleGridProps = {
  bottles: BottleType[]
  color: string
  editable?: boolean
  showPercent?: boolean
  selectedId?: string
  compact?: boolean
  poster?: boolean
  shapeId?: BottleShapeId
  onValueChange?: (id: string, value: number) => void
  onSelect?: (id: string) => void
}

export function BottleGrid({
  bottles,
  color,
  editable = false,
  showPercent = false,
  selectedId,
  compact = false,
  poster = false,
  shapeId = 'classic',
  onValueChange,
  onSelect,
}: BottleGridProps) {
  return (
    <div
      className={
        poster
          ? 'grid grid-cols-6 gap-x-2 gap-y-3'
          : compact
            ? 'grid grid-cols-6 gap-x-3 gap-y-4'
            : 'grid grid-cols-3 gap-4 sm:grid-cols-6'
      }
    >
      {bottles.map((bottle) => (
        <div
          key={bottle.id}
          className={
            selectedId === bottle.id
              ? 'rounded-lg outline outline-2 outline-offset-4 outline-neutral-950'
              : undefined
          }
        >
          <Bottle
            bottle={bottle}
            color={color}
            editable={editable}
            showPercent={showPercent}
            compact={compact}
            poster={poster}
            shapeId={shapeId}
            onValueChange={onValueChange}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  )
}
