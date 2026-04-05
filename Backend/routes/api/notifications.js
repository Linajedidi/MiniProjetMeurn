const router = require("express").Router()
const Notification = require("../../models/Notification")
const auth = require("../../middleware/authMiddleware")

router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      entreprise: req.user.id
    }).sort({ createdAt: -1 })

    res.json(notifications)
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur" })
  }
})


router.put("/read/:id", auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true }
    )

    res.json({ msg: "ok" })
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur" })
  }
})

module.exports = router