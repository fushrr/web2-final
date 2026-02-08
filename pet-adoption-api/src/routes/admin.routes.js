const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");

const {
  getAllUsers,
  promoteToAdmin,
  deleteUser,
} = require("../controllers/admin.controller");

router.get("/users", auth, adminOnly, getAllUsers);
router.patch("/users/:id/promote", auth, adminOnly, promoteToAdmin);
router.delete("/users/:id", auth, adminOnly, deleteUser);

module.exports = router;
