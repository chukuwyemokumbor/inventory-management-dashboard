import { useEffect, useState } from 'react'
import type { Product, ProductInput } from '../types/inventory'
import { api } from './api'

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    api.listProducts().then(setProducts).catch(console.error)
  }, [])

  const replace = (saved: Product) => setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)))

  return {
    products,
    addProduct: (input: ProductInput) =>
      api
        .createProduct(input)
        .then((saved) => setProducts((prev) => [...prev, saved]))
        .catch(console.error),
    updateProduct: (id: string, input: ProductInput) => api.updateProduct(id, input).then(replace).catch(console.error),
    /** Receive (positive delta) or remove (negative) stock; never goes below zero. */
    adjustStock: (id: string, delta: number) => {
      const current = products.find((p) => p.id === id)
      if (!current) return
      return api
        .updateProduct(id, { quantity: Math.max(0, current.quantity + delta) })
        .then(replace)
        .catch(console.error)
    },
    deleteProduct: (id: string) =>
      api
        .deleteProduct(id)
        .then(() => setProducts((prev) => prev.filter((p) => p.id !== id)))
        .catch(console.error),
  }
}
