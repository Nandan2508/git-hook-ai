
const loadDashboard = async (userId) => {
  try {
    const user = await fetchUser(userId)
    const stats = await fetchStats(userId)
    renderDashboard(user, stats)
  } catch (err) {
    console.error('Dashboard load failed:', err)
  }
}

loadDashboard(42)