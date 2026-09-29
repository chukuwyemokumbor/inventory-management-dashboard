export interface Product {
  id: string
  sku: string
  name: string
  category: string
  quantity: number
  reorderPoint: number
  unitCost: number
  price: number
  supplier: string
  location: string
  updatedAt: string
}

/** The fields a user fills in; id and updatedAt are set by the app. */
export type ProductInput = Omit<Product, 'id' | 'updatedAt'>

export type StockStatus = 'in-stock' | 'low' | 'out'
