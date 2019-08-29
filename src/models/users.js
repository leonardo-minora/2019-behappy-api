import bcrypt from "bcrypt";

import knex from "../config/knex";

const table_name = "users";

class User {
    static login(username, password) {
        return knex(table_name).select().where('login', username).then(users => {
            if (users.length == undefined || users.length == 0) return false;
            return bcrypt.compareSync(password, users[0].password);
        });
    }
}

export default User;