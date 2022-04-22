const router = require("express").Router();
const { verifyTokenAndAuthorize } = require("../middleware/verifyToken");
const {
  updateUser,
  deleteUser,
  getAllUser,
  getUserById,
  followUser,
  patchUpdateUser,
} = require("../controller/user");

// put Update user
router.put("/:id", verifyTokenAndAuthorize, updateUser);

// patch Update user
router.patch("/:id", verifyTokenAndAuthorize, patchUpdateUser);

// Delete user
router.delete("/:id", verifyTokenAndAuthorize, deleteUser);

//get all users
router.get("/", getAllUser);

//get one user
router.get("/:id", getUserById);

//follow another user
router.put("/follow/:id", verifyTokenAndAuthorize, followUser);

module.exports = router;
