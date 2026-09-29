import type { Product } from '../types/inventory'

type SeedRow = [sku: string, name: string, category: string, qty: number, reorder: number, cost: number, price: number, supplier: string, location: string]

const ROWS: SeedRow[] = [
  ['EL-1001', 'Wireless mouse', 'Electronics', 142, 40, 8.5, 24.99, 'Northwind Tech', 'A1-03'],
  ['EL-1002', 'USB-C hub, 7-port', 'Electronics', 36, 30, 19.0, 49.99, 'Northwind Tech', 'A1-04'],
  ['EL-1003', 'Mechanical keyboard', 'Electronics', 58, 20, 42.0, 109.0, 'Keystone Supply', 'A1-06'],
  ['EL-1004', '27" monitor', 'Electronics', 12, 15, 138.0, 279.0, 'Northwind Tech', 'A2-01'],
  ['EL-1005', 'Noise-cancelling headset', 'Electronics', 0, 10, 61.0, 149.0, 'Keystone Supply', 'A2-02'],
  ['OF-2001', 'Copy paper, 10 reams', 'Office supplies', 310, 100, 22.0, 44.0, 'Paperline Co.', 'B1-01'],
  ['OF-2002', 'Gel pens, 12-pack', 'Office supplies', 85, 60, 3.2, 9.99, 'Paperline Co.', 'B1-02'],
  ['OF-2003', 'Sticky notes, 24-pack', 'Office supplies', 44, 50, 6.1, 15.49, 'Paperline Co.', 'B1-03'],
  ['OF-2004', 'Desk organizer', 'Office supplies', 67, 25, 7.8, 21.0, 'Harbor Goods', 'B1-05'],
  ['FU-3001', 'Ergonomic office chair', 'Furniture', 18, 8, 165.0, 349.0, 'Oakridge Furnishings', 'C1-01'],
  ['FU-3002', 'Standing desk frame', 'Furniture', 7, 6, 210.0, 459.0, 'Oakridge Furnishings', 'C1-02'],
  ['FU-3003', 'Filing cabinet, 3-drawer', 'Furniture', 22, 5, 88.0, 179.0, 'Harbor Goods', 'C1-04'],
  ['PK-4001', 'Shipping boxes, medium (25)', 'Packaging', 420, 150, 11.0, 26.0, 'BoxWorks', 'D1-01'],
  ['PK-4002', 'Bubble wrap roll, 50 ft', 'Packaging', 95, 40, 9.5, 19.99, 'BoxWorks', 'D1-02'],
  ['PK-4003', 'Packing tape, 6 rolls', 'Packaging', 28, 45, 7.0, 16.99, 'BoxWorks', 'D1-03'],
  ['CL-5001', 'All-purpose cleaner, gallon', 'Cleaning', 54, 20, 6.4, 14.99, 'Harbor Goods', 'E1-01'],
  ['CL-5002', 'Microfiber cloths, 24-pack', 'Cleaning', 0, 15, 8.9, 19.99, 'Harbor Goods', 'E1-02'],
  ['CL-5003', 'Hand sanitizer, 12-pack', 'Cleaning', 73, 30, 14.0, 32.0, 'Harbor Goods', 'E1-03'],
]

export function createSampleProducts(): Product[] {
  const now = new Date().toISOString()
  return ROWS.map(([sku, name, category, quantity, reorderPoint, unitCost, price, supplier, location], i) => ({
    id: `seed-${i + 1}`,
    sku,
    name,
    category,
    quantity,
    reorderPoint,
    unitCost,
    price,
    supplier,
    location,
    updatedAt: now,
  }))
}
