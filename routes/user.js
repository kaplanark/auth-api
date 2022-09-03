const express = require("express");
const router = express.Router();
const { signIn, signUp } = require("../controller/user");

router.post("/api/auth/signin", signIn);
router.post("/api/auth/signup", signUp);

module.exports = router;