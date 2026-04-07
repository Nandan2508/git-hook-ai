// clean/05 — null check before property access
const displayUserEmail = (userId) => {
  const user = getUserById(userId)
  if (!user || !user.email) {
    console.warn('User or email not found for id:', userId)
    return
  }
  console.log(user.email.toLowerCase())
}