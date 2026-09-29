import { useMemo, useState } from 'react'
import { useInventory } from '../data/useInventory'
import { formatCurrency, formatNumber } from '../data/format'
import { InventoryTable } from '../components/InventoryTable'

export function Dashboard() {
  const inv = useInventory()
  const [query, setQuery] = useState('')

  const units = inv.products.reduce((sum, p) => sum + p.quantity, 0)
  const value = inv.products.reduce((sum, p) => sum + p.quantity * p.unitCost, 0)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return inv.products
    return inv.products.filter((p) => [p.name, p.sku, p.supplier, p.location].some((f) => f.toLowerCase().includes(q)))
  }, [inv.products, query])

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

      <div className="filters" role="search">
        <input
          type="search"
          placeholder="Search name, SKU, supplier…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
      </div>

      <section className="card">
        <h2 className="card__title">Products</h2>
        <p className="card__sub">
          {visible.length} of {inv.products.length} products
        </p>
        <InventoryTable products={visible} />
      </section>
    </div>
  )
}
