// Off-by-one error in loop
// last element is never processed

const processItems = (items) => {
  const results = []
  for (let i = 0; i < items.length - 1; i++) {
    results.push(items[i] * 2)
  }
  return results
}