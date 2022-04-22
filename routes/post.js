const router = require("express").Router();
const {
  verifyTokenAndAuthorize,
  verifyToken,
} = require("../middleware/verifyToken");
const Post = require("../models/Post");
const User = require("../models/User");
const {
  createPost,
  putUpdatePost,
  deletePost,
  getPostById,
  likePost,
  Timeline,
  Feed,
  uploadProfile,
} = require("../controller/post");

//create post
router.post("/:id", verifyTokenAndAuthorize, createPost);

router.put("/:id", verifyTokenAndAuthorize, putUpdatePost);

router.delete("/:id", verifyTokenAndAuthorize, deletePost);

router.get("/:id", verifyToken, getPostById);

router.put("/:id/like", verifyToken, likePost);

router.get("/timeline/:userId", verifyToken, Timeline);

router.get("/feed", verifyToken, Feed);

module.exports = router;
