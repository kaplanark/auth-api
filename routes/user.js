const express = require("express");
const userController = require("../controller/user");
const router = express.Router();

router.post("/api/auth/signin", userController.signIn);
router.post("/api/auth/signup", userController.signUp);

module.exports = router;