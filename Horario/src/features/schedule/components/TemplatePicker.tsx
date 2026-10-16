import { useRef } from 'react'
import {
  TIMETABLE_TEMPLATE_DESCRIPTIONS,
  TIMETABLE_TEMPLATE_LABELS,
  TIMETABLE_TEMPLATE_ORDER,
} from '../../../constants/timetableTemplates'
import { TemplatePreviewMock } from './TemplatePreviewMock'
import type { TimetableTemplate } from '../../../types/timetablePreferences'

interface TemplatePickerProps {
  value: TimetableTemplate
  onChange: (template: TimetableTemplate) => void
}

const CARD_SCROLL_WIDTH = 216

export function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollByCard(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * CARD_SCROLL_WIDTH, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Choose a template</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous templates"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors duration-150 hover:bg-slate-100"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next templates"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors duration-150 hover:bg-slate-100"
          >
            ›
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2">
        {TIMETABLE_TEMPLATE_ORDER.map((template) => {
          const isSelected = template === value
          return (
            <button
              key={template}
              type="button"
              onClick={() => onChange(template)}
              aria-pressed={isSelected}
              className={`w-48 shrink-0 snap-center rounded-clay-sm border-2 p-3 text-left transition-[transform,box-shadow] duration-200 ease-clay hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                isSelected ? 'border-primary-500 shadow-clay-hover' : 'border-transparent shadow-clay'
              }`}
            >
              <TemplatePreviewMock template={template} />
              <p className="mt-2 text-sm font-semibold text-slate-900">{TIMETABLE_TEMPLATE_LABELS[template]}</p>
              <p className="mt-0.5 text-xs text-slate-500">{TIMETABLE_TEMPLATE_DESCRIPTIONS[template]}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
