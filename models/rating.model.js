const pool = require("../config/db");

const createOrUpdateRating = async (
    userId,
    storeId,
    rating
) => {
    const result = await pool.query(
        `INSERT INTO ratings (user_id, store_id, rating)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, store_id)
         DO UPDATE SET
            rating = EXCLUDED.rating,
            updated_at = CURRENT_TIMESTAMP
         RETURNING id, user_id, store_id, rating, created_at, updated_at`,
        [userId, storeId, rating]
    );

    return result.rows[0];
};

module.exports = {
    createOrUpdateRating
};  