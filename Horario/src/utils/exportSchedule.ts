// html2canvas-pro and jspdf are both sizeable and only ever needed when the user actually opens
// the export dialog, so they're loaded dynamically rather than shipped in the main bundle.

/**
 * Elements marked `data-export-ignore` (view toggles, "not designed yet"
 * banners, etc.) are excluded from the capture — only the actual schedule
 * grid and its background should end up in the exported file.
 */
async function captureCanvas(node: HTMLElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import('html2canvas-pro')
  return html2canvas(node, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    ignoreElements: (el) => el.hasAttribute('data-export-ignore'),
  })
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function exportScheduleAsImage(node: HTMLElement, filename: string): Promise<void> {
  const canvas = await captureCanvas(node)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Could not generate an image from the schedule.')
  downloadBlob(blob, filename)
}

export async function exportScheduleAsPdf(node: HTMLElement, filename: string): Promise<void> {
  const [canvas, { jsPDF }] = await Promise.all([captureCanvas(node), import('jspdf')])
  const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait'
  const doc = new jsPDF({ orientation, unit: 'pt', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 24
  const scale = Math.min((pageWidth - margin * 2) / canvas.width, (pageHeight - margin * 2) / canvas.height)
  const imageWidth = canvas.width * scale
  const imageHeight = canvas.height * scale
  const x = (pageWidth - imageWidth) / 2
  const y = (pageHeight - imageHeight) / 2

  doc.addImage(canvas, 'PNG', x, y, imageWidth, imageHeight)
  doc.save(filename)
}

export function printSchedule(): void {
  window.print()
}
