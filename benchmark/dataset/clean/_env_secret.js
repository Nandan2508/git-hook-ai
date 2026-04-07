
const sendPayment = (amount, userId) => {
  return fetch('https://api.stripe.com/v1/charges', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, userId })
  })
}