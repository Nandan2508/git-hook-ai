// Unhandled promise rejection
// if fetchData throws, the error is silently swallowed

const loadUser = (id) => {
  fetchData(`/api/users/${id}`)
    .then(data => {
      renderUser(data)
    })
}

loadUser(42)