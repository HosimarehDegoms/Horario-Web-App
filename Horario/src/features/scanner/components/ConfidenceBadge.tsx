import { Badge } from '../../../components/ui/Badge'

interface ConfidenceBadgeProps {
  confidence: number
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  if (confidence >= 0.85) return <Badge variant="success">High confidence</Badge>
  if (confidence >= 0.6) return <Badge variant="warning">Medium confidence</Badge>
  return <Badge variant="danger">Low confidence — please check</Badge>
}
