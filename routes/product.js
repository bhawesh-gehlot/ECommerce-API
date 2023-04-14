const router = require("express").Router();
const {
    createProduct,
    updateProduct,
    getProduct,
    getAllProducts,
    getProductByName,
    deleteProduct,
} = require("../controllers/product");
const { verifyTokenAndAdmin } = require("../auth/verifyToken");

router.post("/create", verifyTokenAndAdmin, createProduct);

router.put("/update/:prodId", verifyTokenAndAdmin, updateProduct);

router.get("/find/:prodId", getProduct);

router.get("/findAllProducts", getAllProducts);

router.get("/search", getProductByName);

router.delete("/delete/:prodId", verifyTokenAndAdmin, deleteProduct);

module.exports = router;
