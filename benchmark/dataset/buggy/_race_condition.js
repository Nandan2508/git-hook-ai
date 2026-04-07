// Race condition on shared counter
// concurrent calls will produce incorrect totals

let orderCount = 0

const placeOrder = async (order) => {
  const current = orderCount
  await saveToDatabase(order)
  orderCount = current + 1  // stale read — another call may have incremented between read and write
}