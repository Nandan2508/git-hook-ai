// Hardcoded API secret in source code
// will be exposed in git history forever

const sendPayment = (amount, userId) => {
  return fetch('https://api.stripe.com/v1/charges', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk_live_4eC39HqLyjWDarjtT1zdp7dc',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, userId })
  })
}