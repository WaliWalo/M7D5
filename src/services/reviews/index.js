const express = require("express");
const router = express.Router();
const Review = require("../../db").Review;
const Product = require("../../db").Product;
const User = require("../../db").User;
const { Op, Sequelize } = require("sequelize");

router.route("/:productId").get(async (req, res, next) => {
  try {
    const data = await Review.findAll({
      include: [{ model: User, attributes: ["name"] }],
      attributes: { exclude: ["userId", "productId"] },
      where: { productId: req.params.productId },
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.route("/:productId/stat").get(async (req, res, next) => {
  try {
    const data = await Review.findAll({
      include: { model: Product, attributes: ["id", "name"] },
      attributes: [
        // { exclude: ["userId", "productId"] },
        [Sequelize.fn("count", Sequelize.col("review.id")), "numberOfReviews"],
        [Sequelize.fn("sum", Sequelize.col("rate")), "totalRate"],
      ],
      group: ["product.id"],
      where: { productId: req.params.productId },
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.route("/:productId/:userId").post(async (req, res, next) => {
  try {
    const newElement = await Review.create({
      ...req.body,
      productId: req.params.productId,
      userId: req.params.userId,
    });
    res.send(newElement);
  } catch (error) {
    next(error);
  }
});

router
  .route("/update/:reviewId")
  .put(async (req, res, next) => {
    try {
      const updatedData = await Review.update(req.body, {
        returning: true,
        plain: true,
        where: {
          id: req.params.reviewId,
        },
      });
      res.send(updatedData[1]);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Review.destroy({ where: { id: req.params.reviewId } }).then(
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
