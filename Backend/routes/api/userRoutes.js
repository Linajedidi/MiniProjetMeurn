const router = require("express").Router();
const userController = require("../../controllers/userController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.put("/profile/update", authMiddleware, userController.updateProfile);
router.put("/profile/change-password", authMiddleware, userController.changePassword);
router.get("/profile", authMiddleware, userController.getMyProfile);
module.exports = router;