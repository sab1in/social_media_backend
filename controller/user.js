const asyncFunction = require("../utils/asyncCatch");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// update user controller
const updateUser = asyncFunction(async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const { password, ...others } = req.body;
  const hashedPassword = await bcrypt.hash(password, salt);

  const updateData = {
    ...others,
    password: hashedPassword,
  };

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  res.status(200).json({ msg: "updated" });
});

//patch update user controller
const patchUpdateUser = asyncFunction(async (req, res, next) => {
  const getData = {
    ...req.body,
  };
  const dbData = await User.findById(req.params.id);
  const updateData = Object.assign(dbData, getData);

  if (dbData) {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json({ msg: "updated" });
  } else {
    res.status(404).json({ msg: "user not found" });
  }
});

// delete user controller
const deleteUser = asyncFunction(async (req, res, next) => {
  const { id } = req.params;
  const userData = await User.findById(id);
  if (!userData) {
    res.status(400).json({ msg: "User not found" });
  } else {
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(deletedUser);
  }
});

//get all user controller
const getAllUser = asyncFunction(async (req, res, next) => {
  //get user data expect password
  const userData = await User.find({}, { password: 0 });
  res.status(200).json(userData);
});

//get user by id controller
const getUserById = asyncFunction(async (req, res, next) => {
  const userData = await User.findById(req.params.id, { password: 0 });
  if (!userData) res.status(400).json({ msg: "User not found" });
  else res.status(200).json(userData);
});

//follow another user
const followUser = asyncFunction(async (req, res, next) => {
  const { id } = req.params;
  const { followingId } = req.body;
  const userData = await User.findById(id);
  if (!userData) {
    res.status(400).json({ msg: "User not found" });
  } else if (userData.followers.includes(followingId)) {
    await User.findByIdAndUpdate(id, { $pull: { followers: followingId } });
    await User.findByIdAndUpdate(followingId, { $pull: { followings: id } });
    res.status(200).json({ msg: "unfollowed" });
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { followers: followingId } },
      { new: true }
    );
    const updatedFollowingUser = await User.findByIdAndUpdate(
      followingId,
      { $push: { followings: id } },
      { new: true }
    );
    res.status(200).json(updatedFollowingUser);
  }
});

module.exports = {
  updateUser,
  deleteUser,
  getAllUser,
  getUserById,
  followUser,
  patchUpdateUser,
};
