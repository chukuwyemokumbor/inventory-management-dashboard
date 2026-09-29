import type { Product, ProductInput } from '../types/inventory'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    // fetch only rejects when the server can't be reached at all.
    throw new Error(`Can't reach the inventory API at ${BASE_URL}. Is it running? Start it with "npm run api".`)
  }
  if (!res.ok) throw new Error(`The server rejected the request (${res.status} ${res.statusText}).`)
  return res.json() as Promise<T>
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong.'
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
