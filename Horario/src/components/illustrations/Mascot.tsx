import { useId } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { FocusIcon, ScheduleIcon, TasksIcon } from '../layout/icons'
import { useActiveThemePreset } from '../../app/theme/useActiveThemePreset'

export type MascotVariant = 'welcome' | 'schedule' | 'tasks' | 'focus' | 'celebrate'

export type MascotAccessory =
  | 'none'
  | 'glasses'
  | 'headband'
  | 'headphones'
  | 'party-hat'
  | 'cat-ears'
  | 'dog-ears'
  | 'leaf'
  | 'wave'
  | 'crown'
  | 'cloud-puff'
  | 'scribble'

/** The character's head/ear silhouette — distinct from `accessory`, which is a small add-on worn on top of it. */
export type MascotBodyShape = 'blob' | 'cat' | 'dog'

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  )
}

interface VariantConfig {
  pose: 'wave' | 'level'
  accessory: MascotAccessory
  prop?: ComponentType<SVGProps<SVGSVGElement>>
}

const VARIANTS: Record<MascotVariant, VariantConfig> = {
  welcome: { pose: 'wave', accessory: 'none' },
  schedule: { pose: 'level', accessory: 'glasses', prop: ScheduleIcon },
  tasks: { pose: 'level', accessory: 'headband', prop: TasksIcon },
  focus: { pose: 'level', accessory: 'headphones', prop: FocusIcon },
  celebrate: { pose: 'wave', accessory: 'party-hat', prop: SparkleIcon },
}

interface MascotProps {
  variant: MascotVariant
  className?: string
  /** Gentle idle float — on by default; set false where a static image reads better (e.g. tiny inline use). */
  animated?: boolean
  /** Overrides the variant's default accessory — used to give the active theme its own character look. */
  accessoryOverride?: MascotAccessory
  /** Overrides the variant's default head silhouette (blob) — used for theme presets like Cozy Cat / Sunny Pup. */
  bodyShapeOverride?: MascotBodyShape
}

/**
 * Horario's mascot: one consistent soft-clay character whose head silhouette,
 * accessory, and floating "prop" badge can each vary by page context and by
 * the active theme — rather than unrelated illustrations per page. Hand-drawn
 * SVG (simple shapes, not a 3D render or a copy of any existing character) —
 * the original, license-free alternative to sourcing third-party illustrations.
 * Colors read the live --color-primary-* theme variables via style (not
 * hard-coded hex), so the whole character automatically recolors with the theme.
 */
export function Mascot({
  variant,
  className = '',
  animated = true,
  accessoryOverride,
  bodyShapeOverride,
}: MascotProps) {
  const gradientId = useId()
  const config = VARIANTS[variant]
  const activePreset = useActiveThemePreset()
  const themedAccessory =
    activePreset && activePreset.characterAccessory !== 'none' ? activePreset.characterAccessory : undefined
  const accessory = accessoryOverride ?? themedAccessory ?? config.accessory
  const bodyShape = bodyShapeOverride ?? activePreset?.bodyShape ?? 'blob'
  const leftArmRotation = config.pose === 'wave' ? -48 : -18
  const rightArmRotation = config.pose === 'wave' ? 14 : 18
  const Prop = config.prop
  const headFill = `url(#${gradientId})`

  return (
    <svg
      viewBox="0 0 200 200"
      className={`${animated ? 'motion-safe:animate-float' : ''} ${className}`}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--color-primary-300)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-primary-600)' }} />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="186" rx="52" ry="9" fill="rgba(15,23,42,0.08)" />

      <ellipse
        cx="40"
        cy="118"
        rx="15"
        ry="32"
        style={{ fill: 'var(--color-primary-400)' }}
        transform={`rotate(${leftArmRotation} 40 118)`}
      />
      <ellipse
        cx="160"
        cy="118"
        rx="15"
        ry="32"
        style={{ fill: 'var(--color-primary-400)' }}
        transform={`rotate(${rightArmRotation} 160 118)`}
      />

      {/* Ears, drawn before the head so the head's top edge overlaps their base — reads as one silhouette. */}
      {bodyShape === 'cat' && (
        <g stroke="#1e293b" strokeWidth="2" strokeLinejoin="round">
          <path d="M48 56 L36 16 L78 48 Z" fill={headFill} />
          <path d="M152 56 L164 16 L122 48 Z" fill={headFill} />
          <path d="M52 48 L46 24 L68 42 Z" fill="#fda4af" stroke="none" />
          <path d="M148 48 L154 24 L132 42 Z" fill="#fda4af" stroke="none" />
        </g>
      )}
      {bodyShape === 'dog' && (
        <g stroke="#1e293b" strokeWidth="2">
          <path
            d="M44 70c-18 6-26 34-14 54 10 16 30 10 32-8 2-18-4-42-18-46z"
            fill={headFill}
          />
          <path
            d="M156 70c18 6 26 34 14 54-10 16-30 10-32-8-2-18 4-42 18-46z"
            fill={headFill}
          />
        </g>
      )}

      <ellipse cx="100" cy="118" rx="60" ry="66" fill={headFill} />
      <ellipse cx="80" cy="92" rx="20" ry="24" fill="white" opacity="0.22" />

      {bodyShape === 'cat' ? (
        <>
          <ellipse cx="73" cy="130" rx="7" ry="4.5" fill="#f472b6" opacity="0.4" />
          <ellipse cx="127" cy="130" rx="7" ry="4.5" fill="#f472b6" opacity="0.4" />
        </>
      ) : (
        <>
          <ellipse cx="73" cy="124" rx="8" ry="5" fill="#f472b6" opacity="0.35" />
          <ellipse cx="127" cy="124" rx="8" ry="5" fill="#f472b6" opacity="0.35" />
        </>
      )}

      <circle cx="82" cy="106" r="5.5" fill="#1e293b" />
      <circle cx="118" cy="106" r="5.5" fill="#1e293b" />
      <circle cx="84" cy="103.5" r="1.8" fill="white" />
      <circle cx="120" cy="103.5" r="1.8" fill="white" />

      {bodyShape === 'dog' ? (
        <>
          {/* Snout */}
          <ellipse cx="100" cy="132" rx="24" ry="17" fill={headFill} stroke="#1e293b" strokeWidth="1.5" />
          <ellipse cx="100" cy="126" rx="5" ry="4" fill="#1e293b" />
          <path d="M90 138 Q100 146 110 138" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path
            d="M96 141 Q100 150 104 141"
            fill="#fb7185"
            stroke="#1e293b"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </>
      ) : bodyShape === 'cat' ? (
        <>
          <path d="M96 118 L104 118 L100 123 Z" fill="#1e293b" />
          <path d="M100 123 Q100 127 100 127" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <path d="M88 128 Q100 134 112 128" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <g stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round">
            <path d="M66 120h-16M66 126h-16M66 132h-14" />
            <path d="M134 120h16M134 126h16M134 132h14" />
          </g>
        </>
      ) : (
        <path d="M84 126 Q100 137 116 126" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}

      {accessory === 'glasses' && (
        <g stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round">
          <circle cx="82" cy="106" r="13" />
          <circle cx="118" cy="106" r="13" />
          <path d="M95 104h10" />
        </g>
      )}

      {accessory === 'headband' && (
        <path d="M46 88 Q100 58 154 88" stroke="#15803d" strokeWidth="9" fill="none" strokeLinecap="round" />
      )}

      {accessory === 'headphones' && (
        <g stroke="#0f766e" strokeWidth="7" fill="none" strokeLinecap="round">
          <path d="M50 96 Q100 48 150 96" />
          <ellipse cx="48" cy="104" rx="8" ry="13" fill="#0f766e" stroke="none" />
          <ellipse cx="152" cy="104" rx="8" ry="13" fill="#0f766e" stroke="none" />
        </g>
      )}

      {accessory === 'party-hat' && (
        <g>
          <path d="M100 38 L78 74 L122 74 Z" fill="#f472b6" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="100" cy="38" r="5" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5" />
        </g>
      )}

      {accessory === 'cat-ears' && bodyShape !== 'cat' && (
        <g stroke="#1e293b" strokeWidth="2" strokeLinejoin="round">
          <path d="M58 68 L50 38 L80 58 Z" style={{ fill: 'var(--color-primary-500)' }} />
          <path d="M142 68 L150 38 L120 58 Z" style={{ fill: 'var(--color-primary-500)' }} />
          <path d="M60 60 L56 44 L72 56 Z" fill="#fda4af" stroke="none" />
          <path d="M140 60 L144 44 L128 56 Z" fill="#fda4af" stroke="none" />
        </g>
      )}

      {accessory === 'dog-ears' && bodyShape !== 'dog' && (
        <g stroke="#1e293b" strokeWidth="2">
          <ellipse
            cx="54"
            cy="78"
            rx="14"
            ry="24"
            style={{ fill: 'var(--color-primary-600)' }}
            transform="rotate(-18 54 78)"
          />
          <ellipse
            cx="146"
            cy="78"
            rx="14"
            ry="24"
            style={{ fill: 'var(--color-primary-600)' }}
            transform="rotate(18 146 78)"
          />
        </g>
      )}

      {accessory === 'leaf' && (
        <g stroke="#15803d" strokeWidth="2" strokeLinejoin="round">
          <path d="M100 36c14 0 24 10 24 22s-10 16-24 6c-14 10-24-6-24-16s10-12 24-12z" fill="#4ade80" />
          <path d="M100 40v22" stroke="#15803d" strokeWidth="1.5" />
        </g>
      )}

      {accessory === 'wave' && (
        <path
          d="M56 70 Q72 54 88 70 T120 70 T152 60"
          stroke="#0284c7"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {accessory === 'crown' && (
        <g stroke="#1e293b" strokeWidth="2" strokeLinejoin="round">
          <path d="M70 72 L78 44 L100 60 L122 44 L130 72 Z" fill="#fcd34d" />
          <circle cx="78" cy="42" r="4" fill="#fcd34d" />
          <circle cx="100" cy="36" r="4.5" fill="#fcd34d" />
          <circle cx="122" cy="42" r="4" fill="#fcd34d" />
        </g>
      )}

      {accessory === 'cloud-puff' && (
        <g stroke="#1e293b" strokeWidth="1.5">
          <circle cx="82" cy="52" r="14" fill="white" />
          <circle cx="100" cy="44" r="18" fill="white" />
          <circle cx="120" cy="52" r="14" fill="white" />
        </g>
      )}

      {accessory === 'scribble' && (
        <path
          d="M64 54q8-14 16 0t16 0t16 0t16 0"
          stroke="#c026d3"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {Prop && (
        <g>
          <circle cx="146" cy="52" r="22" style={{ fill: 'var(--color-primary-600)' }} />
          <Prop x={135} y={41} width={22} height={22} stroke="white" />
        </g>
      )}
    </svg>
  )
}
