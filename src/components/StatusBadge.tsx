import type { StockStatus } from '../types/inventory'
import { STATUS_LABEL } from '../data/format'

const ICON: Record<StockStatus, string> = {
  'in-stock': '✓',
  low: '!',
  out: '✕',
}

/** Status is always icon + label, never color alone. */
export function StatusBadge({ status }: { status: StockStatus }) {
  return (
    <span className={`status status--${status}`}>
      <span className="status__icon" aria-hidden="true">
        {ICON[status]}
      </span>
      {STATUS_LABEL[status]}
    </span>
  )
}
