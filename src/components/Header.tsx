type HeaderProps = {
  onHome?: () => void
}

export function Header({ onHome }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <button type="button" className="text-left" onClick={onHome}>
          <p className="text-base font-black text-neutral-950">瓶子评价图生成器</p>
          <p className="text-xs font-medium text-neutral-500">Bottle Rating Generator</p>
        </button>
      </div>
    </header>
  )
}
