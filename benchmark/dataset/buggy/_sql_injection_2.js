
const getUserOrders = async (userId) => {
  const result = await db.sequelize.query(
    `SELECT * FROM orders WHERE user_id = ${userId}`,
  )
  return result[0]
}