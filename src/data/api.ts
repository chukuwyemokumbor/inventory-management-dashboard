import type { Product, ProductInput } from '../types/inventory'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export const api = {
  listProducts: () => request<Product[]>('/products'),

  createProduct: (input: ProductInput) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify({ ...input, id: crypto.randomUUID(), updatedAt: new Date().toISOString() }),
    }),

  updateProduct: (id: string, changes: Partial<ProductInput>) =>
    request<Product>(`/products/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...changes, updatedAt: new Date().toISOString() }),
    }),

  deleteProduct: (id: string) => request<unknown>(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}
