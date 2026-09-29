import { useState, type FormEvent } from 'react'
import type { Product } from '../types/inventory'
import { formatNumber } from '../data/format'
import { errorMessage } from '../data/api'
import { Modal } from './Modal'

interface Props {
  product: Product
  onAdjust: (delta: number) => Promise<void>
  onClose: () => void
}

/** Receive or remove stock for one product. */
export function StockDialog({ product, onAdjust, onClose }: Props) {
  // Suggest topping up to twice the reorder point.
  const suggested = Math.max(0, product.reorderPoint * 2 - product.quantity)
  const [mode, setMode] = useState<'in' | 'out'>('in')
  const [qty, setQty] = useState(suggested || 1)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const delta = mode === 'in' ? qty : -Math.min(qty, product.quantity)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (qty <= 0) return
    setError(null)
    setSaving(true)
    try {
      await onAdjust(delta)
      onClose()
    } catch (err) {
      setError(errorMessage(err))
      setSaving(false)
    }
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
        {error && (
          <p className="form__error" role="alert">
            {error}
          </p>
        )}
        <div className="form__actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={qty <= 0 || saving}>
            {saving ? 'Saving…' : 'Apply'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
