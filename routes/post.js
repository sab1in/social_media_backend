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
} = require("../controller/post");

//create post
router.post("/", verifyTokenAndAuthorize, createPost);

router.put("/:id", verifyTokenAndAuthorize, putUpdatePost);

router.delete("/:id", verifyTokenAndAuthorize, deletePost);

router.get("/:id", verifyTokenAndAuthorize, getPostById);

router.put("/:id/like", verifyToken, likePost);

router.get("/timeline/:userId", verifyTokenAndAuthorize, Timeline);

router.get("/feed", verifyToken, Feed);

module.exports = router;
