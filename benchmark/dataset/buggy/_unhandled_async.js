
const loadDashboard = async (userId) => {
  const user = await fetchUser(userId)
  const stats = await fetchStats(userId)
  renderDashboard(user, stats)
}

loadDashboard(42)