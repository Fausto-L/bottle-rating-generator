type ToolbarProps = {
  onRandomize: () => void
  onClear: () => void
  onFull: () => void
  onReset: () => void
}

export function Toolbar({ onRandomize, onClear, onFull, onReset }: ToolbarProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button className="btn-secondary" type="button" onClick={onRandomize}>
        随机生成
      </button>
      <button className="btn-secondary" type="button" onClick={onClear}>
        全部清空
      </button>
      <button className="btn-secondary" type="button" onClick={onFull}>
        全部拉满
      </button>
      <button className="btn-secondary" type="button" onClick={onReset}>
        恢复默认
      </button>
    </div>
  )
}
