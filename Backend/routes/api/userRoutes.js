const router = require("express").Router();
const userController = require("../../controllers/userController");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.get("/profile", authMiddleware, userController.getMyProfile);
router.put("/profile/update", authMiddleware, userController.updateProfile);   
router.put("/profile/change-password", authMiddleware, userController.changePassword);


router.put(
  "/profile/upload-image",
  authMiddleware,
  upload.single("image"),
  userController.uploadProfileImage
);
module.exports = router;