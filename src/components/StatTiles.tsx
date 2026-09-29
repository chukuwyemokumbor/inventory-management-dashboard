import type { Product } from '../types/inventory'
import { formatCompactCurrency, formatNumber, stockStatus } from '../data/format'

export function StatTiles({ products }: { products: Product[] }) {
  const value = products.reduce((sum, p) => sum + p.quantity * p.unitCost, 0)
  const retail = products.reduce((sum, p) => sum + p.quantity * p.price, 0)
  const units = products.reduce((sum, p) => sum + p.quantity, 0)
  const low = products.filter((p) => stockStatus(p) === 'low').length
  const out = products.filter((p) => stockStatus(p) === 'out').length

  return (
    <section className="tiles" aria-label="Inventory summary">
      <div className="tile tile--hero">
        <div className="tile__label">Inventory value at cost</div>
        <div className="tile__hero">{formatCompactCurrency(value)}</div>
        <div className="tile__sub">{formatCompactCurrency(retail)} at retail</div>
      </div>
      <div className="tile">
        <div className="tile__label">Units on hand</div>
        <div className="tile__value">{formatNumber(units)}</div>
        <div className="tile__sub">across {products.length} SKUs</div>
      </div>
      <div className="tile">
        <div className="tile__label">Needs reorder</div>
        <div className="tile__value">{low + out}</div>
        <div className="tile__sub">
          <span className="status status--low status--inline">
            <span className="status__icon" aria-hidden="true">!</span>
            {low} low
          </span>{' '}
          <span className="status status--out status--inline">
            <span className="status__icon" aria-hidden="true">✕</span>
            {out} out
          </span>
        </div>
      </div>
    </section>
  )
}
