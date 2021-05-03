const { Router } = require("express");
const router = Router();

router.get("/profile", (req, res) => {
  const { user } = req;
  res.status(200).render("users/profile", { user });
});


module.exports = router;
