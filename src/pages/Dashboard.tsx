import { useMemo, useState } from 'react'
import { useInventory } from '../data/useInventory'
import type { Product, StockStatus } from '../types/inventory'
import { formatCurrency, formatNumber, stockStatus, STATUS_LABEL } from '../data/format'
import { InventoryTable } from '../components/InventoryTable'
import { ProductDialog } from '../components/ProductDialog'

type DialogState = { kind: 'add' } | { kind: 'edit'; product: Product } | null

export function Dashboard() {
  const inv = useInventory()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState<'all' | StockStatus>('all')
  const [dialog, setDialog] = useState<DialogState>(null)

  const units = inv.products.reduce((sum, p) => sum + p.quantity, 0)
  const value = inv.products.reduce((sum, p) => sum + p.quantity * p.unitCost, 0)

  const categories = useMemo(() => [...new Set(inv.products.map((p) => p.category))].sort(), [inv.products])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return inv.products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (status === 'all' || stockStatus(p) === status) &&
        (!q || [p.name, p.sku, p.supplier, p.location].some((f) => f.toLowerCase().includes(q))),
    )
  }, [inv.products, query, category, status])

  const isFiltered = query !== '' || category !== 'all' || status !== 'all'

  function handleDelete(p: Product) {
    if (confirm(`Delete ${p.name} (${p.sku})? This can't be undone.`)) inv.deleteProduct(p.id)
  }

  function clearFilters() {
    setQuery('')
    setCategory('all')
    setStatus('all')
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Inventory</h1>
          <p className="page__sub">
            {inv.products.length} products · {formatNumber(units)} units · {formatCurrency(value)} at cost
          </p>
        </div>
        <div className="page__actions">
          <button type="button" className="btn btn--ghost" onClick={inv.resetData}>
            Reset sample data
          </button>
          <button type="button" className="btn btn--primary" onClick={() => setDialog({ kind: 'add' })}>
            + Add product
          </button>
        </div>
      </header>

      <div className="filters" role="search">
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'all' | StockStatus)} aria-label="Stock status">
          <option value="all">Any status</option>
          {(Object.keys(STATUS_LABEL) as StockStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Search name, SKU, supplier…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
        {isFiltered && (
          <button type="button" className="btn btn--ghost" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <section className="card">
        <h2 className="card__title">Products</h2>
        <p className="card__sub">
          {visible.length} of {inv.products.length} products
        </p>
        <InventoryTable
          products={visible}
          onEdit={(product) => setDialog({ kind: 'edit', product })}
          onDelete={handleDelete}
        />
      </section>

      {dialog?.kind === 'add' && (
        <ProductDialog
          categories={categories}
          existingSkus={inv.products.map((p) => p.sku)}
          onSave={inv.addProduct}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.kind === 'edit' && (
        <ProductDialog
          product={dialog.product}
          categories={categories}
          existingSkus={inv.products.map((p) => p.sku)}
          onSave={(input) => inv.updateProduct(dialog.product.id, input)}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}
