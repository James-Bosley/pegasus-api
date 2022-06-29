const bookshelf = require("../db/configs");

// Establishes a Users model connected to the underlying table and sets relations to other tables.
const Users = bookshelf.model("Users", {
  tableName: "users",
  visits() {
    return this.hasMany("Visits");
  },
  games() {
    return this.hasMany("Games");
  },
});

// Establishes a Visits model connected to the underlying table and sets relations to other tables.
const Visits = bookshelf.model("Visits", {
  tableName: "visits",
  user() {
    return this.hasOne("Users");
  },
});

// Object holding all operations to be performed on the Users table. All data returned from the
// model will be in JSON format, such that the model cannot be changed by downstream operations.
const UserModel = {
  async getByEmail(email) {
    const user = await new Users().where({ email: email }).fetch({ require: false });
    if (!user) {
      return null;
    } else {
      return user.toJSON();
    }
  },

  async getById(id) {
    const user = await new Users().where({ id: id }).fetch({ require: false });
    if (!user) {
      return null;
    } else {
      return user.toJSON();
    }
  },

  async add(newUser) {
    const user = await new Users(newUser).save({}, { method: "insert" });
    return user.toJSON();
  },

  async update(id, update) {
    const user = await new Users().where({ id: id }).save(update, { method: "update" });
    return user.toJSON();
  },
};

module.exports = UserModel;
