const router = require("express").Router();
const {
    createOrder,
    updateOrder,
    getOrder,
    getAllOrders,
    deleteOrder,
} = require("../controllers/order");
const { verifyToken, verifyTokenAndAdmin } = require("../auth/verifyToken");

router.post("/create", verifyToken, createOrder);

router.put("/update/:id", verifyTokenAndAdmin, updateOrder);

router.get("/find/", verifyToken, getOrder);

router.get("/getAll", verifyTokenAndAdmin, getAllOrders);

router.delete("/delete/:id", verifyTokenAndAdmin, deleteOrder);

module.exports = router;
