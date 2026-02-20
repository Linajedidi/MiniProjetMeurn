const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require ("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// @route POST api/users
// @desc Register new user
//@access Public
router.post("/register", (req, res) => {
// Destructure required fields from req.body
const {username, email, password, role } = req.body;
// Check if any required fields are missing
if (!username || !email || !password) {
return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
}

// Check if email already exists
User.findOne({ email: email }).then((user) => {
if (user) {
return res.status(400).send({ status: "notokmail", msg: "Email already exists" });
}
// Create a new user instance
const newUser = new User({
username,
email,
password,
role
});

// Generate salt and hash password
bcrypt.genSalt(10, (err, salt) => {
if (err) {
return res.status(500).send({ status: "error", msg: "Internal server error" });
}
bcrypt.hash(newUser.password, salt, (err, hash) => {
if (err) {
return res.status(500).send({ status: "error", msg: "Internal server error" });
}
// Replace plain password with hashed password
newUser.password = hash;
// Save the user to the database
newUser.save()
.then((user) => {
// Generate JWT token
jwt.sign({ id: user.id },config.get("jwtSecret"),{ expiresIn: config.get("tokenExpire") },
(err, token) => {
if (err) {
return res.status(500).send({ status: "error", msg: "Internal server error" });
}
// Send response with token and user details
res.status(200).send({ status: "ok", msg: "Successfully registered",token, user });
}
);
})
.catch(err => {
return res.status(500).send({ status: "error", msg: "Internal server error" });
});
});
});
})
.catch(err => {
return res.status(500).send({ status: "error", msg: "Internal server error"
});
});
});

router.post("/login", async (req, res) => {
// Destructure required fields from req.body
const {email, password} = req.body;
// Check if any required fields are missing
try {
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message : 'Utilisateur non troouve'});
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({message : 'mot de pass incoreect'});
    const JWT_SECRET = config.get("jwtSecret");
    const tokenExpire=config.get("tokenExpire")
    //generer le token 
    const token = jwt.sign ({id : user._id, name: user.username}, JWT_SECRET,{expiresIn: tokenExpire});
    

    res.json({token,username:user.username});

} catch (err) {
    res.status(500).json({message: 'Erreur serveur'});

}
});
// Route protegée /home



module.exports = router;

