import type { Product, StockStatus } from '../types/inventory'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const number = new Intl.NumberFormat('en-US')

export const formatCurrency = (n: number) => currency.format(n)
export const formatNumber = (n: number) => number.format(n)

export function stockStatus(p: Product): StockStatus {
  if (p.quantity <= 0) return 'out'
  if (p.quantity <= p.reorderPoint) return 'low'
  return 'in-stock'
}

export const STATUS_LABEL: Record<StockStatus, string> = {
  'in-stock': 'In stock',
  low: 'Low stock',
  out: 'Out of stock',
}
