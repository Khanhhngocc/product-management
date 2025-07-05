const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/users.controller");

router.get("/not-friend", controller.notFriends);

module.exports = router