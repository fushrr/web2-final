const User = require("../models/User");
const Pet = require("../models/Pet");

const getAllPets = async (req, res, next) => {
  try {
    const pets = await Pet.find()
      .populate("owner", "username email role")
      .sort({ createdAt: -1 });

    res.json(pets);
  } catch (err) {
    next(err);
  }
};


const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const promoteToAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can promote users" });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });

    if (target.role === "superadmin") {
      return res.status(400).json({ message: "User is already superadmin" });
    }

    if (target.role === "admin") {
      return res.status(400).json({ message: "User is already admin" });
    }

    target.role = "admin";
    await target.save();

    const safe = await User.findById(target._id).select("-password");
    res.json({ message: "Promoted to admin", user: safe });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });

    if (target.role === "superadmin") {
      return res.status(403).json({ message: "You cannot delete superadmin" });
    }

    if (req.user.role === "admin" && target.role === "admin") {
      return res.status(403).json({ message: "Admins cannot delete other admins" });
    }


    await User.findByIdAndDelete(target._id);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

const setUserRole = async (req, res, next) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can change roles" });
    }

    const { role } = req.body; 
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "role must be 'user' or 'admin'" });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });

    if (target.role === "superadmin") {
      return res.status(403).json({ message: "You cannot change superadmin role" });
    }

    if (target.role === role) {
      return res.status(400).json({ message: `User is already ${role}` });
    }

    target.role = role;
    await target.save();

    const safe = await User.findById(target._id).select("-password");
    res.json({ message: "Role updated", user: safe });
  } catch (err) {
    next(err);
  }
};


module.exports = { getAllUsers, promoteToAdmin, deleteUser, setUserRole, getAllPets };
