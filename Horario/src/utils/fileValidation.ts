import {
  ACCEPTED_FILE_TYPES,
  ACCEPTED_FILE_TYPES_LABEL,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_LABEL,
} from '../constants/scanner'

export interface FileValidationResult {
  valid: boolean
  error?: string
}

export function validateScheduleFile(file: File): FileValidationResult {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: `Unsupported file type. Please upload a ${ACCEPTED_FILE_TYPES_LABEL} file.` }
  }
  if (file.size === 0) {
    return { valid: false, error: 'This file appears to be empty.' }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.` }
  }
  return { valid: true }
}
