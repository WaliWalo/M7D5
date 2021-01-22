const express = require("express");
const router = express.Router();
const Product = require("../../db").Product;
const Category = require("../../db").Category;
const { Op } = require("sequelize");

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["name"],
            where: req.query.category
              ? {
                  name: { [Op.iLike]: `%${req.query.category}%` },
                }
              : {},
          },
        ],
        attributes: { exclude: ["categoryId"] },
        where: req.query.productName
          ? { name: { [Op.iLike]: `%${req.query.productName}%` } }
          : {},
        offset: parseInt(req.query.offset) | 0,
        limit: parseInt(req.query.limit) | 10,
      });
      res.send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newElement = await Product.create(req.body);
      res.send(newElement);
    } catch (error) {
      next(error);
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    const product = await Product.findByPk(req.params.id);
    res.send(product);
    try {
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const updatedData = await Product.update(req.body, {
        returning: true,
        plain: true,
        where: {
          id: req.params.id,
        },
      });
      res.send(updatedData[1]);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Product.destroy({ where: { id: req.params.id } }).then(
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
