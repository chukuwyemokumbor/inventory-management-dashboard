import { useEffect, useState } from 'react'
import type { Product, ProductInput } from '../types/inventory'
import { api, errorMessage } from './api'

export type LoadState = { status: 'loading' } | { status: 'ready' } | { status: 'error'; message: string }

/**
 * Products from the API plus mutations. Mutations reject on failure so the
 * caller can keep its dialog open and show the error.
 */
export function useInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    api
      .listProducts()
      .then((list) => {
        if (cancelled) return
        setProducts(list)
        setLoad({ status: 'ready' })
      })
      .catch((err) => {
        if (!cancelled) setLoad({ status: 'error', message: errorMessage(err) })
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const replace = (saved: Product) => setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)))

  return {
    products,
    load,
    retry: () => {
      setLoad({ status: 'loading' })
      setAttempt((n) => n + 1)
    },
    addProduct: async (input: ProductInput) => {
      const saved = await api.createProduct(input)
      setProducts((prev) => [...prev, saved])
    },
    updateProduct: async (id: string, input: ProductInput) => {
      replace(await api.updateProduct(id, input))
    },
    /** Receive (positive delta) or remove (negative) stock; never goes below zero. */
    adjustStock: async (id: string, delta: number) => {
      const current = products.find((p) => p.id === id)
      if (!current) throw new Error('This product no longer exists.')
      replace(await api.updateProduct(id, { quantity: Math.max(0, current.quantity + delta) }))
    },
    deleteProduct: async (id: string) => {
      await api.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    },
  }
}
