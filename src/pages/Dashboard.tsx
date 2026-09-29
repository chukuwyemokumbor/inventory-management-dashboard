import { useInventory } from '../data/useInventory'
import { formatCurrency, formatNumber } from '../data/format'

export function Dashboard() {
  const inv = useInventory()
  const units = inv.products.reduce((sum, p) => sum + p.quantity, 0)
  const value = inv.products.reduce((sum, p) => sum + p.quantity * p.unitCost, 0)

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Inventory</h1>
          <p className="page__sub">
            {inv.products.length} products · {formatNumber(units)} units · {formatCurrency(value)} at cost
          </p>
        </div>
        <button type="button" className="btn" onClick={inv.resetData}>
          Reset sample data
        </button>
      </header>
    </div>
  )
}
