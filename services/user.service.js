const md5 = require('md5');
const pool = require('../configs/db');
const Person = require("../dtos/person.dto");

class UserService {

    static async register(username, password) {
        try {
            const isExist = await this.isExist(username);
            if (isExist) {
                return null;
            }
            const res = await pool.query(`INSERT INTO users(username, password) VALUES ($1, $2) RETURNING person_id AS id`, [username, md5(password)]);
            return new Person(res.rows[0].id, username);
        } catch (error) {
            return null;
        }

    }

    static async login(username, password) {
        try {
            const isExist = await this.isExist(username);
            if (isExist) {
                const res = await pool.query(`SELECT person_id AS id, username FROM users WHERE username = $1 AND password = $2`, [username, md5(password)]);
                console.log(res.rows[0])
                return new Person(res.rows[0].id, res.rows[0].username);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    static async isExist(username) {
        try {
            const res = await pool.query(`SELECT EXISTS(SELECT 1 FROM users WHERE username = '${username}') AS contain`);
            return res.rows[0].contain;
        } catch (error) {
            return true;
        }
    }

}

module.exports = UserService;