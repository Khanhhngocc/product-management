const express = require("express");
const controller = require("../../controllers/client/product.controller");

const router = express.Router();

router.get("/", controller.index);

module.exports = router;
