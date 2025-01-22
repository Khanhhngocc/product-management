const express = require("express");

const controller = require("../../controllers/client/cart.controller");

const router = express.Router();

router.get("/", controller.index);

router.post("/add/:productId", controller.addPost);

router.get("/delete/:productId", controller.delete);

module.exports = router;