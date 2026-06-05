import { templates } from '../data/templates'

type TemplateSelectorProps = {
  onSelect: (id: string) => void
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          className={[
            'min-h-32 rounded-lg border p-4 text-left shadow-sm transition active:scale-[0.98] hover:-translate-y-0.5 hover:border-neutral-950',
            template.id === 'blank'
              ? 'border-neutral-950 bg-neutral-950 text-white'
              : 'border-neutral-200 bg-white text-neutral-950',
          ].join(' ')}
          onClick={() => onSelect(template.id)}
        >
          <span className="text-lg font-black">{template.name}</span>
          <span
            className={[
              'mt-2 block text-sm font-semibold',
              template.id === 'blank' ? 'text-white/70' : 'text-neutral-500',
            ].join(' ')}
          >
            {template.subtitle}
          </span>
        </button>
      ))}
    </div>
  )
}
