import { TIMETABLE_TEMPLATE_STYLES } from '../../../constants/timetableTemplates'
import type { TimetableTemplate } from '../../../types/timetablePreferences'

const MOCK_COLORS = ['#818cf8', '#4ade80', '#fcd34d']
const DAY_HEADER_COLORS = ['#fca5a5', '#fde68a', '#86efac', '#7dd3fc']

interface TemplatePreviewMockProps {
  template: TimetableTemplate
}

const GRID_BLOCKS = [
  { col: 1, rowStart: 1, rowSpan: 2, color: '#818cf8' },
  { col: 2, rowStart: 2, rowSpan: 3, color: '#4ade80' },
  { col: 3, rowStart: 1, rowSpan: 2, color: '#fcd34d' },
  { col: 4, rowStart: 3, rowSpan: 2, color: '#f472b6' },
]

/** A tiny, accurate CSS mockup of a template's table format — no illustration assets needed. */
export function TemplatePreviewMock({ template }: TemplatePreviewMockProps) {
  const style = TIMETABLE_TEMPLATE_STYLES[template]

  if (style.tableFormat === 'time_grid') {
    return (
      <div
        className="grid grid-cols-4 gap-0.5 rounded-lg bg-slate-100 p-2"
        style={{ gridTemplateRows: 'repeat(5, 7px)' }}
      >
        {GRID_BLOCKS.map((block) => (
          <div
            key={`${block.col}-${block.rowStart}`}
            className="rounded-sm"
            style={{
              gridColumn: block.col,
              gridRow: `${block.rowStart} / span ${block.rowSpan}`,
              backgroundColor: style.vivid ? block.color : `${block.color}33`,
            }}
          />
        ))}
      </div>
    )
  }

  if (style.tableFormat === 'spreadsheet') {
    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="grid grid-cols-4 gap-px bg-slate-200">
          {DAY_HEADER_COLORS.map((color) => (
            <div key={color} className="h-2.5" style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-px bg-slate-200 p-px">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-1.5 bg-white" />
          ))}
        </div>
      </div>
    )
  }

  if (style.tableFormat === 'day_tables') {
    return (
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-1 rounded-sm border-l-2 border-sky-300 bg-sky-50 p-1.5">
            <div className="h-1 w-6 rounded-full bg-sky-300" />
            <div className="h-1 w-8 rounded-full bg-sky-200" />
          </div>
        ))}
      </div>
    )
  }

  const isCompact = style.density === 'compact'
  return (
    <div className={`rounded-lg bg-slate-100 p-2 ${isCompact ? 'space-y-1' : 'space-y-1.5'}`}>
      {MOCK_COLORS.map((color) => (
        <div key={color} className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1">
          {style.showColorDot && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          )}
          <div className="h-1.5 flex-1 rounded-full bg-slate-300/70" />
        </div>
      ))}
    </div>
  )
}
