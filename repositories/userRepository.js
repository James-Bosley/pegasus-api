const Users = require("../models/userModel");

// Object holding all operations to be performed on the Users table. All data returned from the
// model will be in JSON format, such that the model cannot be changed by downstream operations.
const UserMethods = {
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

  async getDisplayAttrs(id) {
    const name = await new Users()
      .where({ id: id })
      .fetch({ require: false, columns: ["id", "display_name", "gender", "handedness"] });
    if (!name) {
      return null;
    } else {
      return name.toJSON();
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

module.exports = UserMethods;
