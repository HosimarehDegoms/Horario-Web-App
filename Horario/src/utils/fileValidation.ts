export interface FileValidationResult {
  valid: boolean
  error?: string
}

export interface FileValidationRules {
  acceptedTypes: string[]
  acceptedTypesLabel: string
  maxSizeBytes: number
  maxSizeLabel: string
}

export function validateFile(file: File, rules: FileValidationRules): FileValidationResult {
  if (!rules.acceptedTypes.includes(file.type)) {
    return { valid: false, error: `Unsupported file type. Please upload a ${rules.acceptedTypesLabel} file.` }
  }
  if (file.size === 0) {
    return { valid: false, error: 'This file appears to be empty.' }
  }
  if (file.size > rules.maxSizeBytes) {
    return { valid: false, error: `File is too large. Maximum size is ${rules.maxSizeLabel}.` }
  }
  return { valid: true }
}
