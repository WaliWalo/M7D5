const express = require("express");
const router = express.Router();
const Cart = require("../../db").Cart;
const Product = require("../../db").Product;
const User = require("../../db").User;
const { Sequelize } = require("sequelize");

router.route("/getCart/:userId").get(async (req, res, next) => {
  try {
    const data = await Cart.findAll({
      include: [
        {
          model: Product,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "brand",
              "description",
              "categoryId",
            ],
          },
        },
        { model: User, attributes: ["name"] },
      ],
      attributes: [
        [Sequelize.fn("count", Sequelize.col("product.id")), "quantity"],
        [Sequelize.fn("sum", Sequelize.col("product.price")), "totalPrice"],
      ],
      group: ["product.id", "user.id"],
      where: { userId: req.params.userId },
    });
    let temp = 0;
    await data.forEach((cart) => {
      temp = temp + cart.dataValues.totalPrice;
      return temp;
    });
    data.push({ totalPrice: temp });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.route("/:productId/:userId").post(async (req, res, next) => {
  try {
    const newElement = await Cart.create({
      productId: req.params.productId,
      userId: req.params.userId,
    });
    res.send(newElement);
  } catch (error) {
    next(error);
  }
});

router.route("/update/:productId/:userId").delete(async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      where: { productId: req.params.productId, userId: req.params.userId },
    });

    await Cart.destroy({ where: { id: cart.id } }).then((rowsDeleted) => {
      if (rowsDeleted > 0) {
        res.send("Deleted");
      } else {
        res.send("No match");
      }
    });
  } catch (error) {
    next(error);
  }
});

router.route("/update/:cartId").delete(async (req, res, next) => {
  try {
    await Cart.destroy({ where: { id: req.params.cartId } }).then(
      (rowsDeleted) => {
        if (rowsDeleted > 0) {
          res.send("Deleted");
        } else {
          res.send("No match");
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
