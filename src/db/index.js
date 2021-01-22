const { Sequelize, DataTypes } = require("sequelize");
const Cart = require("./cart");
const Category = require("./category");
const Product = require("./product");
const Review = require("./review");
const User = require("./user");

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
  }
);

const models = {
  Cart: Cart(sequelize, DataTypes),
  Category: Category(sequelize, DataTypes),
  Product: Product(sequelize, DataTypes),
  Review: Review(sequelize, DataTypes),
  User: User(sequelize, DataTypes),
};

Object.keys(models).forEach((model_name) => {
  if ("associate" in models[model_name]) {
    models[model_name].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(() => console.log("Connection established"))
  .catch((e) => console.log("Connection Failed", e));

module.exports = models;
