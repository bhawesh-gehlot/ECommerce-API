const router = require("express").Router();
const register = require("../controllers/register");
const login = require("../controllers/login");

router.post("/register", register);

router.post("/login", login);

module.exports = router;
