type ToolbarProps = {
  onRandomize: () => void
  onClear: () => void
  onFull: () => void
  onReset: () => void
}

type ToolIcon = 'shuffle' | 'clear' | 'full' | 'reset'

function ToolSvg({ icon }: { icon: ToolIcon }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2.3,
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      {icon === 'shuffle' && (
        <path
          {...common}
          d="M4 7h3c4 0 6 10 10 10h3M4 17h3c1.8 0 3.2-1.8 4.6-4M17 4l3 3-3 3M17 14l3 3-3 3"
        />
      )}
      {icon === 'clear' && (
        <path {...common} d="M5 7h14M9 7V5h6v2m-8 0l1 13h8l1-13M10 11v5M14 11v5" />
      )}
      {icon === 'full' && (
        <path {...common} d="M5 19h14M7 15h10M9 11h6M12 5v10m0 0l-4-4m4 4l4-4" />
      )}
      {icon === 'reset' && (
        <path {...common} d="M5 12a7 7 0 117 7M5 12h5M5 12l3-3m-3 3l3 3" />
      )}
    </svg>
  )
}

export function Toolbar({ onRandomize, onClear, onFull, onReset }: ToolbarProps) {
  const actions = [
    { icon: 'shuffle' as const, label: '随机', onClick: onRandomize },
    { icon: 'clear' as const, label: '清空', onClick: onClear },
    { icon: 'full' as const, label: '拉满', onClick: onFull },
    { icon: 'reset' as const, label: '默认', onClick: onReset },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-200 bg-white px-2 text-xs font-black text-neutral-950 shadow-sm transition active:scale-[0.98]"
          type="button"
          onClick={action.onClick}
        >
          <ToolSvg icon={action.icon} />
          {action.label}
        </button>
      ))}
    </div>
  )
}
