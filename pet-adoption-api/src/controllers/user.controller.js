const User = require("../models/User");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.username !== undefined) updates.username = req.body.username;
    if (req.body.email !== undefined) updates.email = req.body.email;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    next(err);
  }
};

module.exports = { getProfile, updateProfile };
