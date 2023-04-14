const router = require("express").Router();
const {
    updateCart,
    addProductToCart,
    removeProductFromCart,
    getCart,
    getAllCarts,
    emptyCart,
} = require("../controllers/cart");
const { verifyToken, verifyTokenAndAdmin } = require("../auth/verifyToken");

router.put("/update/:id", verifyTokenAndAdmin, updateCart);

router.put("/addProduct/", verifyToken, addProductToCart);

router.put("/removeProduct/", verifyToken, removeProductFromCart);

router.get("/find/", verifyToken, getCart);

router.get("/getAll", verifyTokenAndAdmin, getAllCarts);

router.put("/empty/", verifyToken, emptyCart);

module.exports = router;
