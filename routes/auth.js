const express = require("express");
const router = express.Router();
const { signIn, signUp, resetPassword, forgotPassword } = require("../controller/auth");

router.post("/api/auth/signin", signIn);
router.post("/api/auth/signup", signUp);
router.post("/api/auth/reset", resetPassword);
router.post("/api/auth/forgot", forgotPassword);
module.exports = router;