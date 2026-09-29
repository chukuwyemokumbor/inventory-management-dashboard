import { useEffect, useState } from 'react'
import type { Product, ProductInput } from '../types/inventory'
import { createSampleProducts } from './products'

const STORAGE_KEY = 'inventory-dashboard:products'

function load(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as Product[]
    }
  } catch {
    // Storage unavailable or corrupt: fall back to sample data.
  }
  return createSampleProducts()
}

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch {
      // Ignore quota / privacy-mode errors; the app still works in memory.
    }
  }, [products])

  return {
    products,
    addProduct: (input: ProductInput) =>
      setProducts((prev) => [...prev, { ...input, id: crypto.randomUUID(), updatedAt: new Date().toISOString() }]),
    resetData: () => setProducts(createSampleProducts()),
  }
}
