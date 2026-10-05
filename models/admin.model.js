const pool = require("../config/db");

const getDashboardStats = async () => {
    const usersResult = await pool.query(
        "SELECT COUNT(*) FROM users"
    );

    const storesResult = await pool.query(
        "SELECT COUNT(*) FROM stores"
    );

    const ratingsResult = await pool.query(
        "SELECT COUNT(*) FROM ratings"
    );

    return {
        totalUsers: Number(usersResult.rows[0].count),
        totalStores: Number(storesResult.rows[0].count),
        totalRatings: Number(ratingsResult.rows[0].count)
    };
};

const getAllUsers = async (filters = {}) => {
    const { name, email, address, role } = filters;

    let query = `
        SELECT id, name, email, address, role, created_at
        FROM users
        WHERE 1=1
    `;

    const values = [];

    if (name) {
        values.push(`%${name}%`);
        query += ` AND name ILIKE $${values.length}`;
    }

    if (email) {
        values.push(`%${email}%`);
        query += ` AND email ILIKE $${values.length}`;
    }

    if (address) {
        values.push(`%${address}%`);
        query += ` AND address ILIKE $${values.length}`;
    }

    if (role) {
        values.push(role);
        query += ` AND role = $${values.length}`;
    }

    const sortBy = filters.sortBy || "id";
    const sortOrder = filters.sortOrder === "desc" ? "DESC" : "ASC";

    const allowedSortFields = [
        "id",
        "name",
        "email",
        "address",
        "role",
        "created_at"
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "id";

    query += ` ORDER BY ${safeSortBy} ${sortOrder}`;

    const result = await pool.query(query, values);

    return result.rows;
};

const getAllStores = async (filters = {}) => {
    const { name, email, address } = filters;

    let query = `
        SELECT 
            s.id,
            s.name,
            s.email,
            s.address,
            COALESCE(AVG(r.rating), 0) AS rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE 1=1
    `;

    const values = [];

    if (name) {
        values.push(`%${name}%`);
        query += ` AND s.name ILIKE $${values.length}`;
    }

    if (email) {
        values.push(`%${email}%`);
        query += ` AND s.email ILIKE $${values.length}`;
    }

    if (address) {
        values.push(`%${address}%`);
        query += ` AND s.address ILIKE $${values.length}`;
    }

    query += ` GROUP BY s.id`;

    const sortBy = filters.sortBy || "id";
    const sortOrder = filters.sortOrder === "desc" ? "DESC" : "ASC";

    const allowedSortFields = [
        "id",
        "name",
        "email",
        "address",
        "rating"
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "id";

    query += ` ORDER BY ${safeSortBy} ${sortOrder}`;

    const result = await pool.query(query, values);

    return result.rows;
};

const createUserByAdmin = async (
    name,
    email,
    password,
    address,
    role
) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, address, role`,
        [name, email, password, address, role]
    );

    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0];
};

const createStore = async (
    name,
    email,
    address,
    ownerId
) => {
    const result = await pool.query(
        `INSERT INTO stores (name, email, address, owner_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, address, owner_id`,
        [name, email, address, ownerId]
    );

    return result.rows[0];
};

const findStoreOwnerById = async (ownerId) => {
    const result = await pool.query(
        `SELECT id, name, email, role
         FROM users
         WHERE id = $1 AND role = 'store_owner'`,
        [ownerId]
    );

    return result.rows[0];
};

const getUserById = async (userId) => {
    const result = await pool.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            u.address,
            u.role,
            u.created_at,
            u.updated_at,
            s.id AS store_id,
            s.name AS store_name,
            COALESCE(AVG(r.rating), 0) AS store_rating
         FROM users u
         LEFT JOIN stores s
            ON s.owner_id = u.id
         LEFT JOIN ratings r
            ON r.store_id = s.id
         WHERE u.id = $1
         GROUP BY
            u.id,
            s.id`,
        [userId]
    );

    return result.rows;
};

const updateUserPassword = async (userId, hashedPassword) => {
    const result = await pool.query(
        `UPDATE users
         SET password = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, name, email, role`,
        [hashedPassword, userId]
    );

    return result.rows[0];
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    createUserByAdmin,
    findUserByEmail,
    getAllStores,
    createStore,
    findStoreOwnerById,
    getUserById,
    updateUserPassword
};