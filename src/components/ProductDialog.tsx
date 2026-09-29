import { useState, type FormEvent } from 'react'
import type { Product, ProductInput } from '../types/inventory'
import { Modal } from './Modal'

interface Props {
  /** When set, the dialog edits this product instead of adding a new one. */
  product?: Product
  categories: string[]
  existingSkus: string[]
  onSave: (input: ProductInput) => void
  onClose: () => void
}

const EMPTY: ProductInput = {
  sku: '',
  name: '',
  category: '',
  quantity: 0,
  reorderPoint: 10,
  unitCost: 0,
  price: 0,
  supplier: '',
  location: '',
}

export function ProductDialog({ product, categories, existingSkus, onSave, onClose }: Props) {
  const [form, setForm] = useState<ProductInput>(() => {
    if (!product) return EMPTY
    const { sku, name, category, quantity, reorderPoint, unitCost, price, supplier, location } = product
    return { sku, name, category, quantity, reorderPoint, unitCost, price, supplier, location }
  })
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((f) => ({ ...f, [key]: value }))

  function submit(e: FormEvent) {
    e.preventDefault()
    const sku = form.sku.trim().toUpperCase()
    if (!sku || !form.name.trim() || !form.category.trim()) {
      setError('SKU, name and category are required.')
      return
    }
    if (sku !== product?.sku && existingSkus.includes(sku)) {
      setError(`SKU ${sku} already exists.`)
      return
    }
    if ([form.quantity, form.reorderPoint, form.unitCost, form.price].some((n) => !Number.isFinite(n) || n < 0)) {
      setError('Numbers must be zero or greater.')
      return
    }
    onSave({ ...form, sku, name: form.name.trim(), category: form.category.trim() })
    onClose()
  }

  const num = (key: 'quantity' | 'reorderPoint' | 'unitCost' | 'price', label: string, step = '1') => (
    <label className="field">
      <span>{label}</span>
      <input type="number" min="0" step={step} value={form[key]} onChange={(e) => set(key, e.target.valueAsNumber || 0)} />
    </label>
  )

  return (
    <Modal title={product ? `Edit ${product.name}` : 'Add product'} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <div className="form__grid">
          <label className="field">
            <span>SKU</span>
            <input value={form.sku} onChange={(e) => set('sku', e.target.value)} autoFocus />
          </label>
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </label>
          <label className="field">
            <span>Category</span>
            <input list="category-options" value={form.category} onChange={(e) => set('category', e.target.value)} />
            <datalist id="category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="field">
            <span>Supplier</span>
            <input value={form.supplier} onChange={(e) => set('supplier', e.target.value)} />
          </label>
          {num('quantity', 'Quantity on hand')}
          {num('reorderPoint', 'Reorder point')}
          {num('unitCost', 'Unit cost ($)', '0.01')}
          {num('price', 'Sale price ($)', '0.01')}
          <label className="field">
            <span>Location</span>
            <input value={form.location} onChange={(e) => set('location', e.target.value)} />
          </label>
        </div>
        {error && (
          <p className="form__error" role="alert">
            {error}
          </p>
        )}
        <div className="form__actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {product ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
