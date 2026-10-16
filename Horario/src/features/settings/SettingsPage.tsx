import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { useThemePreferences } from '../../hooks/useThemePreferences'
import { ThemePreviewCard } from './components/ThemePreviewCard'
import {
  THEME_COLOR_FAMILY_LABELS,
  THEME_COLOR_FAMILY_ORDER,
  THEME_COLOR_SCALES,
  THEME_FINISH_DESCRIPTIONS,
  THEME_FINISH_LABELS,
  THEME_FINISH_ORDER,
  THEME_PRESETS,
  DEFAULT_THEME_COLOR_FAMILY,
  DEFAULT_THEME_FINISH,
} from '../../constants/themeColors'
import type { ThemeColorFamily, ThemeFinish } from '../../types/themePreferences'

export function SettingsPage() {
  const { preferences, loading, error, refetch, savePreferences } = useThemePreferences()

  const [candidateFamily, setCandidateFamily] = useState<ThemeColorFamily>(DEFAULT_THEME_COLOR_FAMILY)
  const [candidateFinish, setCandidateFinish] = useState<ThemeFinish>(DEFAULT_THEME_FINISH)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Sync candidates once the real saved preference finishes loading — adjusting state during
  // render (not an effect) per React's guidance for resetting state when a prop changes.
  const [syncedPreferencesId, setSyncedPreferencesId] = useState<string | null>(null)
  if (preferences && preferences.id !== syncedPreferencesId) {
    setSyncedPreferencesId(preferences.id)
    setCandidateFamily(preferences.colorFamily)
    setCandidateFinish(preferences.finish)
  }

  const isDirty = preferences
    ? preferences.colorFamily !== candidateFamily || preferences.finish !== candidateFinish
    : true

  async function handleApply() {
    setSaving(true)
    try {
      await savePreferences({ colorFamily: candidateFamily, finish: candidateFinish })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Settings</h1>

      {loading ? (
        <LoadingState label="Loading your theme…" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <Card title="Appearance" className="motion-safe:animate-fade-in-up">
          <p className="mb-4 text-sm text-slate-500">
            Pick a theme, or mix your own color and finish. Nothing changes until you hit Apply.
          </p>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Themes</p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {THEME_PRESETS.map((preset) => {
                    const isActive = candidateFamily === preset.colorFamily && candidateFinish === preset.finish
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setCandidateFamily(preset.colorFamily)
                          setCandidateFinish(preset.finish)
                        }}
                        className={`rounded-clay-sm border p-2.5 text-left transition-[transform,box-shadow] duration-150 ease-clay hover:-translate-y-0.5 ${
                          isActive ? 'border-slate-900 shadow-clay-hover' : 'border-slate-200 shadow-clay'
                        }`}
                      >
                        <div
                          data-theme-finish={preset.finish}
                          style={
                            {
                              '--color-primary-300': THEME_COLOR_SCALES[preset.colorFamily]['300'],
                              '--color-primary-400': THEME_COLOR_SCALES[preset.colorFamily]['400'],
                              '--color-primary-500': THEME_COLOR_SCALES[preset.colorFamily]['500'],
                              '--color-primary-600': THEME_COLOR_SCALES[preset.colorFamily]['600'],
                              '--color-primary-700': THEME_COLOR_SCALES[preset.colorFamily]['700'],
                              '--color-primary-800': THEME_COLOR_SCALES[preset.colorFamily]['800'],
                              '--color-primary-900': THEME_COLOR_SCALES[preset.colorFamily]['900'],
                            } as React.CSSProperties
                          }
                          className="theme-surface mb-1.5 flex h-10 items-center justify-center rounded-md text-lg"
                        >
                          {preset.emoji}
                        </div>
                        <p className="text-xs font-semibold text-slate-800">{preset.label}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Or pick your own color</p>
                <div className="flex flex-wrap gap-2.5">
                  {THEME_COLOR_FAMILY_ORDER.map((family) => (
                    <button
                      key={family}
                      type="button"
                      onClick={() => setCandidateFamily(family)}
                      aria-label={THEME_COLOR_FAMILY_LABELS[family]}
                      title={THEME_COLOR_FAMILY_LABELS[family]}
                      className={`h-10 w-10 rounded-full transition-[transform,box-shadow] duration-150 ease-clay hover:-translate-y-0.5 ${
                        candidateFamily === family
                          ? 'shadow-clay-hover ring-2 ring-slate-900 ring-offset-2'
                          : 'shadow-clay'
                      }`}
                      style={{ backgroundColor: THEME_COLOR_SCALES[family]['500'] }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Finish</p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {THEME_FINISH_ORDER.map((finish) => (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => setCandidateFinish(finish)}
                      className={`rounded-clay-sm border p-2.5 text-left transition-[transform,box-shadow] duration-150 ease-clay hover:-translate-y-0.5 ${
                        candidateFinish === finish
                          ? 'border-slate-900 shadow-clay-hover'
                          : 'border-slate-200 shadow-clay'
                      }`}
                    >
                      <div
                        data-theme-finish={finish}
                        style={{
                          '--color-primary-300': THEME_COLOR_SCALES[candidateFamily]['300'],
                          '--color-primary-400': THEME_COLOR_SCALES[candidateFamily]['400'],
                          '--color-primary-500': THEME_COLOR_SCALES[candidateFamily]['500'],
                          '--color-primary-600': THEME_COLOR_SCALES[candidateFamily]['600'],
                          '--color-primary-700': THEME_COLOR_SCALES[candidateFamily]['700'],
                          '--color-primary-800': THEME_COLOR_SCALES[candidateFamily]['800'],
                          '--color-primary-900': THEME_COLOR_SCALES[candidateFamily]['900'],
                        } as React.CSSProperties}
                        className="theme-surface mb-1.5 h-6 w-full rounded-md"
                      />
                      <p className="text-xs font-semibold text-slate-800">{THEME_FINISH_LABELS[finish]}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{THEME_FINISH_DESCRIPTIONS[finish]}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button type="button" onClick={() => void handleApply()} disabled={!isDirty || saving}>
                  {saving ? 'Applying…' : 'Apply Theme'}
                </Button>
                {saved && <span className="text-sm font-medium text-emerald-600">Theme applied ✓</span>}
              </div>
            </div>

            <div className="w-full lg:w-64">
              <p className="mb-2 text-sm font-medium text-slate-700">Preview</p>
              <ThemePreviewCard colorFamily={candidateFamily} finish={candidateFinish} />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
