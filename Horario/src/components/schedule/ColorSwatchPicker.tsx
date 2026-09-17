import { SCHEDULE_COLOR_PALETTE } from '../../constants/schedule'

interface ColorSwatchPickerProps {
  value?: string
  onChange: (color: string) => void
}

export function ColorSwatchPicker({ value, onChange }: ColorSwatchPickerProps) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700">Color</span>
      <div className="flex flex-wrap gap-2">
        {SCHEDULE_COLOR_PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            aria-label={`Select color ${color}`}
            aria-pressed={value === color}
            className={`h-8 w-8 rounded-full border-2 shadow-clay transition-[transform,box-shadow,border-color] duration-150 ease-clay hover:-translate-y-0.5 hover:shadow-clay-hover active:translate-y-0 active:scale-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
              value === color ? 'border-slate-900' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}
