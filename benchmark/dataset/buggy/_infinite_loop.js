// Infinite loop risk
// loop condition never becomes false if target is not in array

const findIndex = (arr, target) => {
  let i = 0
  while (arr[i] !== target) {
    i++
  }
  return i
}