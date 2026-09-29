import { useState } from 'react'
import type { Product } from '../types/inventory'
import { formatCurrency, formatNumber, stockStatus } from '../data/format'
import { StatusBadge } from './StatusBadge'

type SortKey = 'sku' | 'name' | 'category' | 'quantity' | 'value' | 'status'

const STATUS_ORDER = { out: 0, low: 1, 'in-stock': 2 }

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'quantity', label: 'On hand', numeric: true },
  { key: 'value', label: 'Value', numeric: true },
  { key: 'status', label: 'Status' },
]

interface Props {
  products: Product[]
  onEdit: (p: Product) => void
  onAdjust: (p: Product) => void
  onDelete: (p: Product) => void
}

export function InventoryTable({ products, onEdit, onAdjust, onDelete }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'status', dir: 1 })

  const sorted = [...products].sort((a, b) => {
    const val = (p: Product): string | number => {
      switch (sort.key) {
        case 'value':
          return p.quantity * p.unitCost
        case 'status':
          return STATUS_ORDER[stockStatus(p)]
        default:
          return p[sort.key]
      }
    }
    const va = val(a)
    const vb = val(b)
    const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
    return cmp * sort.dir || a.name.localeCompare(b.name)
  })

  const toggle = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))

  if (products.length === 0) return <div className="empty">No products match these filters.</div>

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                className={c.numeric ? 'num' : undefined}
                aria-sort={sort.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}
              >
                <button type="button" className="th-sort" onClick={() => toggle(c.key)}>
                  {c.label}
                  <span className="th-sort__arrow" aria-hidden="true">
                    {sort.key === c.key ? (sort.dir === 1 ? '▲' : '▼') : ''}
                  </span>
                </button>
              </th>
            ))}
            <th>
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id}>
              <td className="mono">{p.sku}</td>
              <td>
                <div className="cell-name">{p.name}</div>
                <div className="cell-meta">
                  {p.supplier}
                  {p.location && ` · ${p.location}`}
                </div>
              </td>
              <td>{p.category}</td>
              <td className="num">
                {formatNumber(p.quantity)}
                <div className="cell-meta">reorder at {formatNumber(p.reorderPoint)}</div>
              </td>
              <td className="num">{formatCurrency(p.quantity * p.unitCost)}</td>
              <td>
                <StatusBadge status={stockStatus(p)} />
              </td>
              <td className="actions">
                <button type="button" className="btn btn--small" onClick={() => onAdjust(p)}>
                  Adjust
                </button>
                <button type="button" className="btn btn--small btn--ghost" onClick={() => onEdit(p)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn--small btn--ghost btn--danger"
                  onClick={() => onDelete(p)}
                  aria-label={`Delete ${p.name}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
