const express = require("express");

const controller = require("../../controllers/client/cart.controller");

const router = express.Router();

router.get("/", controller.index);

router.post("/add/:productId", controller.addPost);

module.exports = router;