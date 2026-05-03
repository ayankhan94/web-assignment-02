const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users",

  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },

    name: {
      type: String,
      nullable: false
    },

    email: {
      type: String,
      unique: true,
      nullable: false
    },

    password: {
      type: String,
      nullable: false
    },

    role: {
      type: String,
      default: "customer"
    },

    createdAt: {
      type: "timestamp",
      createDate: true
    }
  }
});

module.exports = User;