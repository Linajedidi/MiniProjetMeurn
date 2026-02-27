const User = require("../models/User");
const bcrypt = require("bcryptjs"); 

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
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    //Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword, 
      role: role || "CANDIDAT",
    });

    await user.save();

    // Supprimer le password avant de renvoyer l'objet
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);

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

// GET MY PROFILE
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE MY PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// CHANGE PASSWORD


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe actuel incorrect" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Le nouveau mot de passe doit contenir au moins 6 caractères" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (err) {
    console.error("Erreur changePassword:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


//image
exports.uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Aucune image envoyée" });
    }

    user.profileImage = `uploads/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Image mise à jour avec succès",
      profileImage: user.profileImage
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};