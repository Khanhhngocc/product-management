const express = require("express");

const controller = require("../../controllers/client/cart.controller");

const router = express.Router();

router.get("/", controller.index);

router.post("/add/:productId", controller.addPost);

router.get("/delete/:productId", controller.delete);

router.get("/update/:productId/:quantity", controller.update);

module.exports = router;