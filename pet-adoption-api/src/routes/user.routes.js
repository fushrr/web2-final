const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { updateProfileSchema } = require("../validators/user.validators");
const { getProfile, updateProfile } = require("../controllers/user.controller");

router.get("/profile", auth, getProfile);
router.put("/profile", auth, validate(updateProfileSchema), updateProfile);


module.exports = router;
