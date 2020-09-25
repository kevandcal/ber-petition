const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbuser, dbpass } = require("../secrets");
    db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/petition`);
}

exports.testFunction = function () {
    console.log("This is working!");
};

exports.addUser = function (first, last, email, password) {
    console.log("first: ", first);
    console.log("last: ", last);
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [first, last, email, password]
    );
};

exports.addSignature = function (signature, userId) {
    return db.query(
        `INSERT INTO signatures (signature, user_id) VALUES ($1, $2)
        RETURNING id`,
        [signature, userId]
    );
};

exports.deleteSignature = function (userId) {
    return db.query(
        `DELETE FROM signatures
        WHERE user_id=$1`,
        [userId]
    );
};

exports.getSignature = function (userId) {
    return db
        .query(
            `SELECT signature, first
            FROM users
            LEFT JOIN signatures
            ON signatures.user_id = users.id
            WHERE user_id=$1`,
            [userId]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getSigners = function () {
    return db
        .query(
            `SELECT first, last, age, city, url
            FROM users
            JOIN user_profiles
            ON users.id = user_profiles.user_id
            JOIN signatures
            ON users.id = signatures.user_id`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getUserInfo = function (email) {
    return db.query(
        `SELECT users.id, first, last, password, signature
        FROM users
        LEFT JOIN signatures
        ON users.id = signatures.user_id
        WHERE email=$1`,
        [email]
    );
};

exports.getSignersByCity = function (city) {
    return db
        .query(
            `SELECT first, last, age, url
            FROM users
            JOIN user_profiles
            ON users.id = user_profiles.user_id
            JOIN signatures
            ON users.id = signatures.user_id
            WHERE LOWER(user_profiles.city)=LOWER($1)`,
            [city]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addProfile = function (age, city, url, userId) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [age || null, city || null, url, userId]
    );
};

exports.getUserProfile = function (userId) {
    return db.query(
        `SELECT first, last, email, password, age, city, url
        FROM users
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE user_id =$1`,
        [userId]
    );
};

exports.updateUserTable = function (id, first, last, email) {
    return db.query(
        `UPDATE users
        SET first=$2, last=$3, email=$4
        WHERE id=$1`,
        [id, first, last, email]
    );
};

exports.updateUserTablePassword = function (id, first, last, email, password) {
    return db.query(
        `UPDATE users
        SET first=$2, last=$3, email=$4, password=$5
        WHERE id=$1`,
        [id, first, last, email, password]
    );
};

exports.updateUserProfilesTable = function (userId, age, city, url) {
    return db.query(
        `INSERT INTO user_profiles (user_id, age, city, url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age = $2, city = $3, url = $4`,
        [userId, age || null, city || null, url || null]
    );
};
