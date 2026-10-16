import { useContext } from 'react'
import { TimetableTemplateStyleContext } from './templateStyleContext'
import type { TimetableTemplateStyle } from '../../constants/timetableTemplates'

export function useTimetableTemplateStyle(): TimetableTemplateStyle {
  return useContext(TimetableTemplateStyleContext)
}
