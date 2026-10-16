import type { ComponentType, SVGProps } from 'react'
import { DashboardIcon, FocusIcon, ScheduleIcon, SettingsIcon, TasksIcon } from './icons'

export interface NavItem {
  to: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  end: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/schedule', label: 'Schedule', icon: ScheduleIcon, end: false },
  { to: '/tasks', label: 'Tasks', icon: TasksIcon, end: false },
  { to: '/focus', label: 'Focus', icon: FocusIcon, end: false },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, end: false },
]
