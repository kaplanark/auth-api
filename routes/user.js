const express = require("express");
const router = express.Router();
const { getUser, updateUser, deleteUser } = require("../controller/user");
const verifyToken = require("../middleware/auth");

router.get("/api/user", verifyToken, getUser);
router.put("/api/user", verifyToken, updateUser);
router.delete("/api/user", verifyToken, deleteUser);

module.exports = router;