import { Card } from '../../../components/ui/Card'
import { LoadingState } from '../../../components/ui/LoadingState'

interface ScanProcessingProps {
  title: string
  label: string
}

export function ScanProcessing({ title, label }: ScanProcessingProps) {
  return (
    <Card title={title}>
      <LoadingState label={label} />
    </Card>
  )
}
