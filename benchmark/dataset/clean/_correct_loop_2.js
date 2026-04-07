// All elements processed correctly
const applyDiscount = (prices) => {
  const discounted = []
  for (let i = 0; i < prices.length; i++) {
    discounted.push(prices[i] * 0.9)
  }
  return discounted
}