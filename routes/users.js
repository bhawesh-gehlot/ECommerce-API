const router = require("express").Router();
const {
    updateUserDetails,
    getUser,
    getAllUsers,
    deleteUser,
} = require("../controllers/user");
const assignAdmin = require("../controllers/assignAdmin");
const { verifyToken, verifyTokenAndAdmin } = require("../auth/verifyToken");

router.put("/update/", verifyToken, updateUserDetails);

router.get("/getUserDetails/", verifyToken, getUser);

router.get("/GetAllUsers", verifyTokenAndAdmin, getAllUsers);

router.delete("/delete/", verifyToken, deleteUser);

router.put("/setAdmin", verifyTokenAndAdmin, assignAdmin);

module.exports = router;
