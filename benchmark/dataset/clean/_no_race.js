// clean/08 — no shared mutable state, count derived from DB
const placeOrder = async (order) => {
  const saved = await saveToDatabase(order)
  const orderCount = await db.count('orders')
  return { order: saved, totalOrders: orderCount }
}