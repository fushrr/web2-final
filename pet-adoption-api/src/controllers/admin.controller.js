const User = require("../models/User");

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
    // Только superadmin может повышать
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can promote users" });
    }

    // нельзя повышать самого себя
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });

    // запрет: нельзя повысить superadmin (он уже главный)
    if (target.role === "superadmin") {
      return res.status(400).json({ message: "User is already superadmin" });
    }

    // если уже admin — можно просто вернуть ок (или ошибку)
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
    // нельзя удалить самого себя
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });

    // никто не может удалить superadmin (включая admin)
    if (target.role === "superadmin") {
      return res.status(403).json({ message: "You cannot delete superadmin" });
    }

    // admin не может удалять admin (и тем более супер-админа)
    if (req.user.role === "admin" && target.role === "admin") {
      return res.status(403).json({ message: "Admins cannot delete other admins" });
    }

    // admin может удалять только users, superadmin может удалять users и admins
    // (это уже покрыто проверками выше)

    await User.findByIdAndDelete(target._id);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};



module.exports = { getAllUsers, promoteToAdmin, deleteUser };
