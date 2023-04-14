const router = require("express").Router();
const {
    updateWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    getWishlist,
    getAllWishlists,
    emptyWishlist,
} = require("../controllers/wishlist");
const { verifyToken, verifyTokenAndAdmin } = require("../auth/verifyToken");

router.put("/update/:id", verifyTokenAndAdmin, updateWishlist);

router.put("/addProduct/", verifyToken, addProductToWishlist);

router.put("/removeProduct/", verifyToken, removeProductFromWishlist);

router.get("/find/", verifyToken, getWishlist);

router.get("/getAll", verifyTokenAndAdmin, getAllWishlists);

router.put("/empty/", verifyToken, emptyWishlist);

module.exports = router;
