import { useMemo, useState } from 'react'
import { useInventory } from '../data/useInventory'
import type { Product, StockStatus } from '../types/inventory'
import { stockStatus, STATUS_LABEL } from '../data/format'
import { InventoryTable } from '../components/InventoryTable'
import { ProductDialog } from '../components/ProductDialog'
import { StatTiles } from '../components/StatTiles'
import { LowStockList } from '../components/LowStockList'
import { StockDialog } from '../components/StockDialog'
import { StatusMessage } from '../components/StatusMessage'
import { errorMessage } from '../data/api'

type DialogState = { kind: 'add' } | { kind: 'edit'; product: Product } | { kind: 'adjust'; product: Product } | null

export function Dashboard() {
  const inv = useInventory()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState<'all' | StockStatus>('all')
  const [dialog, setDialog] = useState<DialogState>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const categories = useMemo(() => [...new Set(inv.products.map((p) => p.category))].sort(), [inv.products])

  // Category + search scope the tiles, alerts and table; status narrows the table only.
  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase()
    return inv.products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!q || [p.name, p.sku, p.supplier, p.location].some((f) => f.toLowerCase().includes(q))),
    )
  }, [inv.products, query, category])

  const visible = status === 'all' ? scoped : scoped.filter((p) => stockStatus(p) === status)

  const isFiltered = query !== '' || category !== 'all' || status !== 'all'

  async function handleDelete(p: Product) {
    if (!confirm(`Delete ${p.name} (${p.sku})? This can't be undone.`)) return
    setActionError(null)
    try {
      await inv.deleteProduct(p.id)
    } catch (err) {
      setActionError(`Couldn't delete ${p.name}. ${errorMessage(err)}`)
    }
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
          <p className="page__sub">Stock levels and reorder alerts across all locations</p>
        </div>
        <div className="page__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setDialog({ kind: 'add' })}
            disabled={inv.load.status !== 'ready'}
          >
            + Add product
          </button>
        </div>
      </header>

      {actionError && (
        <div className="banner" role="alert">
          <span className="status__icon banner__icon" aria-hidden="true">
            ✕
          </span>
          <span className="banner__text">{actionError}</span>
          <button type="button" className="btn btn--small btn--ghost" onClick={() => setActionError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {inv.load.status === 'loading' && <StatusMessage kind="loading" title="Loading inventory…" />}

      {inv.load.status === 'error' && (
        <StatusMessage kind="error" title="Couldn't load your inventory">
          <p>{inv.load.message}</p>
          <button type="button" className="btn" onClick={inv.retry}>
            Try again
          </button>
        </StatusMessage>
      )}

      {inv.load.status === 'ready' && (
        <>
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

          <StatTiles products={scoped} />

          <section className="card">
            <h2 className="card__title">Reorder alerts</h2>
            <p className="card__sub">Products at or below their reorder point</p>
            <LowStockList products={scoped} onRestock={(product) => setDialog({ kind: 'adjust', product })} />
          </section>

          <section className="card">
            <h2 className="card__title">Products</h2>
            <p className="card__sub">
              {visible.length} of {inv.products.length} products
            </p>
            <InventoryTable
              products={visible}
              onEdit={(product) => setDialog({ kind: 'edit', product })}
              onAdjust={(product) => setDialog({ kind: 'adjust', product })}
              onDelete={handleDelete}
            />
          </section>
        </>
      )}

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
      {dialog?.kind === 'adjust' && (
        <StockDialog
          product={dialog.product}
          onAdjust={(delta) => inv.adjustStock(dialog.product.id, delta)}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}
