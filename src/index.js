const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const server = express();
const cartRouter = require("./services/carts");
const categoryRouter = require("./services/categories");
const productRouter = require("./services/products");
const reviewRouter = require("./services/reviews");
const userRouter = require("./services/users");

server.use(cors());
server.use(express.json());
server.use("/carts", cartRouter);
server.use("/categories", categoryRouter);
server.use("/products", productRouter);
server.use("/reviews", reviewRouter);
server.use("/users", userRouter);

db.sequelize.sync({ force: false }).then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`listening on port ${process.env.PORT || 5000}`);
  });
});
