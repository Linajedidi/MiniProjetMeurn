const User = require("../models/User");

// GET ALL + SEARCH + FILTER
exports.getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select("-password");
    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// GET mon profil (utilisateur connecté)
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const bcrypt = require("bcrypt");

// UPDATE PROFILE (user connecté)
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id, // récupéré du middleware auth
      { username, email },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    // Vérifier ancien mot de passe
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Hasher nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Mot de passe modifié avec succès" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};