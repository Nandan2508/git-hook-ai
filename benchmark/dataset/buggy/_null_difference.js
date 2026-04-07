// Null dereference — no null check before accessing property
// crashes if getUserById returns null

const displayUserEmail = (userId) => {
  const user = getUserById(userId)
  console.log(user.email.toLowerCase())
}