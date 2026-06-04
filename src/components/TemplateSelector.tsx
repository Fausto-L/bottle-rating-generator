import { templates } from '../data/templates'

type TemplateSelectorProps = {
  onSelect: (id: string) => void
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid gap-3">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          className="rounded-lg border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-950"
          onClick={() => onSelect(template.id)}
        >
          <span className="text-lg font-black text-neutral-950">{template.name}</span>
          <span className="mt-1 block text-sm text-neutral-500">{template.subtitle}</span>
        </button>
      ))}
    </div>
  )
}
