const pool = require("../config/db");

const findUserByEmail = async (email)=>{
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0];
};

const createUser = async (name, email, password, address, role = "user") => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, address, role`,
        [name, email, password, address, role]
    );

    return result.rows[0];
};

const getStoresForUser = async (userId, filters = {}) => {
    
    const {
        search,
        sortBy = "name",
        sortOrder = "asc"
    } = filters;

    let query = `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            COALESCE(AVG(all_ratings.rating), 0) AS overall_rating,
            my_rating.rating AS my_rating
        FROM stores s
        LEFT JOIN ratings all_ratings
            ON all_ratings.store_id = s.id
        LEFT JOIN ratings my_rating
            ON my_rating.store_id = s.id
            AND my_rating.user_id = $1
        WHERE 1=1
    `;

    const values = [userId];

    if (search) {
        values.push(`%${search}%`);

        query += `
            AND (
                s.name ILIKE $${values.length}
                OR s.address ILIKE $${values.length}
            )
        `;
    }

    const allowedSortColumns = {
        name: "s.name",
        address: "s.address",
        rating: "overall_rating"
    };

    const sortColumn = allowedSortColumns[sortBy] || "s.name";
    const order = sortOrder === "desc" ? "DESC" : "ASC";

    query += `
        GROUP BY s.id, my_rating.rating
        ORDER BY ${sortColumn} ${order}
    `;

        const result = await pool.query(query, values);

        return result.rows;
    };

module.exports = {
    findUserByEmail,
    createUser,
    getStoresForUser
};