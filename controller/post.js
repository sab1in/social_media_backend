const asyncFunction = require("../utils/asyncCatch");
const Post = require("../models/Post");
const User = require("../models/User");
const formidable = require("formidable");
const imageUpload = require("../utils/imageUpload");
const fs = require("fs");
const path = require("path");

// post create controller
// const createPost = asyncFunction(async (req, res, next) => {
//   req.body.userId = req.user.id;
//   const newPost = await Post.create(req.body);
//   res.status(200).json(newPost);
// });

const createPost = asyncFunction(async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    var oldPath = files.file.filepath;
    var newPath =
      path.join(__dirname.split("controller")[0], "uploads") +
      "\\" +
      files.file.originalFilename;
    var rawData = fs.readFileSync(oldPath);
    console.log(req.params.id);
    fs.writeFile(newPath, rawData, async (err) => {
      try {
        if (err) res.status(500).json({ error: err });
        const description = fields.description;
        console.log("yem");
        const newPost = await Post.create({
          userId: req.params.id,
          desc: description,
          img: "/uploads" + "/" + files.file.originalFilename,
        });

        return res.status(200).json(newPost);
      } catch (error) {
        res.status(200).jons(error);
      }
    });
  });
});

// put update post controller
const putUpdatePost = asyncFunction(async (req, res, next) => {
  req.body.userId = req.user.id;
  const PostData = await Post.findById(req.params.id);
  if (!PostData) {
    res.status(400).json({ msg: "Post not found" });
  } else {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body.desc,
      {
        new: true,
      }
    );
    res.status(200).json(updatedPost);
  }
});

//get post by id controller
const getPostById = asyncFunction(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).json({ msg: "Post not found" });
  } else res.status(200).json(post);
});

//delete post controller
const deletePost = asyncFunction(async (req, res, next) => {
  console.log(req.params.id);
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).json({ msg: "Not found post" });
  } else res.status(200).json(post);
});

//Like post controller
const likePost = asyncFunction(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).json({ msg: "Post not found" });
  } else {
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json({ message: "post liked!" });
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json({ message: "post unliked!" });
    }
  }
});

//Timeline controller
const Timeline = asyncFunction(async (req, res, next) => {
  const userPosts = await Post.find({ userId: req.params.userId });
  if (!userPosts) {
    res.status(404).json({ msg: "Post not found" });
  } else res.status(200).json(userPosts);
});

//Feed controller
const Feed = asyncFunction(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);
  const posts = await Promise.all(
    currentUser.followings.map((friendId) => {
      return Post.find({ userId: friendId });
    })
  );
  res.status(200).json(posts);
});

module.exports = {
  createPost,
  putUpdatePost,
  deletePost,
  getPostById,
  likePost,
  Timeline,
  Feed,
};
