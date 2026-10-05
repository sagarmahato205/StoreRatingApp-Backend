const pool = require("../config/db")

const getOwnerDashboard = async (ownerId) => {

  const storeResult = await pool.query(
    `SELECT id, name, email, address
     FROM stores
     WHERE owner_id = $1`,
    [ownerId]
  )

  if (storeResult.rows.length === 0) {
    return null
  }

  const store = storeResult.rows[0]

  const averageResult = await pool.query(
    `SELECT COALESCE(AVG(rating), 0) AS average_rating
     FROM ratings
     WHERE store_id = $1`,
    [store.id]
  )

  const ratingsResult = await pool.query(
    `SELECT
        u.id AS user_id,
        u.name,
        u.email,
        r.rating,
        r.created_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY r.created_at DESC`,
    [store.id]
  )

  return {
    store,
    averageRating: averageResult.rows[0].average_rating,
    ratings: ratingsResult.rows
  }
}

module.exports = {
  getOwnerDashboard
}