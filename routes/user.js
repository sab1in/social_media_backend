const router = require("express").Router();
const { verifyTokenAndAuthorize } = require("../middleware/verifyToken");
const {
  updateUser,
  deleteUser,
  getAllUser,
  getUserById,
  followUser,
} = require("../controller/user");

// Update user
router.put("/:id", verifyTokenAndAuthorize, updateUser);

// Delete user
router.delete("/:id", verifyTokenAndAuthorize, deleteUser);

//get all users
router.get("/", getAllUser);

//get one user
router.get("/:id", getUserById);

//follow another user
router.put("/follow/:id", verifyTokenAndAuthorize, followUser);

module.exports = router;
