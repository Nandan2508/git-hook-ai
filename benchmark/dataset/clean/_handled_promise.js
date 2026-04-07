// clean/03 — promise with proper error handling
const loadUser = async (id) => {
  try {
    const data = await fetchData(`/api/users/${id}`)
    renderUser(data)
  } catch (err) {
    console.error('Failed to load user:', err)
    showErrorMessage()
  }
}