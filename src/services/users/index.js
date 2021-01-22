const express = require("express");
const router = express.Router();
const User = require("../../db").User;

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await User.findAll();
      res.send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newElement = await User.create(req.body);
      res.send(newElement);
    } catch (error) {
      next(error);
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);
    res.send(user);
    try {
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const updatedData = await User.update(req.body, {
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
      await User.destroy({ where: { id: req.params.id } }).then(
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
