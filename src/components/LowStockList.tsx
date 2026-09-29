import type { Product } from '../types/inventory'
import { formatNumber, stockStatus } from '../data/format'
import { StatusBadge } from './StatusBadge'

interface Props {
  products: Product[]
  onRestock: (product: Product) => void
}

/** Products at or below their reorder point, most urgent first. */
export function LowStockList({ products, onRestock }: Props) {
  const items = products
    .filter((p) => stockStatus(p) !== 'in-stock')
    .sort((a, b) => a.quantity / Math.max(1, a.reorderPoint) - b.quantity / Math.max(1, b.reorderPoint))

  if (items.length === 0) return <div className="empty">Everything is above its reorder point.</div>

  return (
    <ul className="alerts">
      {items.map((p) => {
        const fill = Math.min(1, p.quantity / Math.max(1, p.reorderPoint))
        return (
          <li key={p.id} className="alert">
            <div className="alert__main">
              <div className="cell-name">{p.name}</div>
              <div className="cell-meta">
                {p.sku} · {formatNumber(p.quantity)} of {formatNumber(p.reorderPoint)} reorder point
              </div>
              <div className={`meter meter--${stockStatus(p)}`} aria-hidden="true">
                <div className="meter__fill" style={{ width: `${fill * 100}%` }} />
              </div>
            </div>
            <div className="alert__side">
              <StatusBadge status={stockStatus(p)} />
              <button type="button" className="btn btn--small" onClick={() => onRestock(p)}>
                Restock
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
