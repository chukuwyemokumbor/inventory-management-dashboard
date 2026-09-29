import { useState, type FormEvent } from 'react'
import type { Product } from '../types/inventory'
import { formatNumber } from '../data/format'
import { Modal } from './Modal'

interface Props {
  product: Product
  onAdjust: (delta: number) => void
  onClose: () => void
}

/** Receive or remove stock for one product. */
export function StockDialog({ product, onAdjust, onClose }: Props) {
  // Suggest topping up to twice the reorder point.
  const suggested = Math.max(0, product.reorderPoint * 2 - product.quantity)
  const [mode, setMode] = useState<'in' | 'out'>('in')
  const [qty, setQty] = useState(suggested || 1)

  const delta = mode === 'in' ? qty : -Math.min(qty, product.quantity)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (qty <= 0) return
    onAdjust(delta)
    onClose()
  }

  return (
    <Modal title={`Adjust stock · ${product.name}`} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <div className="segmented" role="radiogroup" aria-label="Adjustment type">
          {(['in', 'out'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              className={mode === m ? 'is-active' : ''}
              onClick={() => setMode(m)}
            >
              {m === 'in' ? 'Receive' : 'Ship / remove'}
            </button>
          ))}
        </div>
        <label className="field">
          <span>Quantity</span>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Math.max(0, e.target.valueAsNumber || 0))}
            autoFocus
          />
        </label>
        <p className="form__hint">
          {formatNumber(product.quantity)} on hand → <strong>{formatNumber(product.quantity + delta)}</strong> after this
          change
        </p>
        <div className="form__actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={qty <= 0}>
            Apply
          </button>
        </div>
      </form>
    </Modal>
  )
}
