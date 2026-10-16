import { useId } from 'react'
import { useActiveThemePreset } from '../../app/theme/useActiveThemePreset'
import type { ThemeBackgroundMotif } from '../../constants/themeColors'

/** Each motif is a small original shape, drawn once per tile and repeated via <pattern>. */
function MotifShape({ motif }: { motif: ThemeBackgroundMotif }) {
  switch (motif) {
    case 'wave':
      return <path d="M2 10 Q7 4 12 10 T22 10" stroke="currentColor" strokeWidth="2" fill="none" />
    case 'leaf':
      return (
        <path
          d="M12 4c6 0 10 4 10 9s-4 7-10 3c-6 4-10-2-10-7s4-5 10-5z"
          fill="currentColor"
          opacity="0.9"
        />
      )
    case 'paw':
      return (
        <g fill="currentColor">
          <ellipse cx="12" cy="16" rx="6" ry="5" />
          <circle cx="5" cy="8" r="2.4" />
          <circle cx="11" cy="4.5" r="2.4" />
          <circle cx="17" cy="8" r="2.4" />
          <circle cx="19.5" cy="13" r="2" />
        </g>
      )
    case 'bone':
      return (
        <g fill="currentColor" transform="rotate(-30 12 12)">
          <rect x="6" y="10.5" width="12" height="3" rx="1.5" />
          <circle cx="5.5" cy="9" r="2.3" />
          <circle cx="5.5" cy="15" r="2.3" />
          <circle cx="18.5" cy="9" r="2.3" />
          <circle cx="18.5" cy="15" r="2.3" />
        </g>
      )
    case 'scribble':
      return (
        <path
          d="M2 12q3-8 6 0t6 0t6 0"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )
    case 'sparkle':
      return <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="currentColor" />
    case 'cloud':
      return (
        <g fill="currentColor">
          <circle cx="9" cy="13" r="5" />
          <circle cx="14" cy="10" r="6.5" />
          <circle cx="19" cy="13" r="5" />
        </g>
      )
    case 'none':
    default:
      return null
  }
}

/**
 * A faint, full-page repeating pattern matching the active theme (paw prints
 * for Cozy Cat, bones for Sunny Pup, waves for Ocean, etc.) instead of a flat
 * white/gradient background. Fixed behind all content, non-interactive.
 * Original shapes only — see Mascot.tsx for why.
 */
export function ThemedBackgroundPattern() {
  const patternId = useId()
  const preset = useActiveThemePreset()
  const motif = preset?.backgroundMotif ?? 'none'

  if (motif === 'none') return null

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full text-primary-400 opacity-[0.08] print:hidden"
    >
      <defs>
        <pattern id={patternId} width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <g transform="translate(20 20)">
            <MotifShape motif={motif} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
