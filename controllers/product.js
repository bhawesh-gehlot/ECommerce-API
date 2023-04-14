const Products = require("../models/Products");
const {
    createProductValidation,
    updateProductValidation,
} = require("../validation/products");

const createProduct = async (req, res) => {
    try {
        const validation = createProductValidation(req.body);
        const valError = validation.error;
        if (valError) {
            return res
                .status(400)
                .json({ success: false, msg: valError.details[0].message });
        }

        const newProduct = new Products(req.body);

        const saveProduct = await newProduct.save();
        if (saveProduct) {
            return res.status(201).json({
                success: true,
                msg: "New product added successfully.",
            });
        } else {
            return res.status(500).json({
                success: false,
                msg: "Unable to add product to database.",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const updateProduct = async (req, res) => {
    try {
        const validation = updateProductValidation(req.body);
        const valError = validation.error;
        if (valError) {
            return res
                .status(400)
                .json({ success: false, msg: valError.details[0].message });
        }

        const updatedProduct = await Products.findByIdAndUpdate(
            req.params.prodId,
            { $set: req.body },
            { new: true }
        );
        if (updatedProduct) {
            const { _id, createdAt, updatedAt, __v, ...data } =
                updatedProduct._doc;
            return res.status(200).json({ success: true, data });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "Failed to update product." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Products.findById(req.params.prodId);
        if (product) {
            const { _id, createdAt, updatedAt, __v, ...data } = product._doc;
            return res.status(200).json({ success: true, data });
        } else {
            return res
                .status(404)
                .json({ success: false, msg: "Product not found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const qNew = req.query.new;
        const qTag = req.query.tag;

        let products;

        if (qTag && qNew) {
            products = await Products.find({
                tags: {
                    $in: [qTag],
                },
            })
                .sort({ createdAt: -1 })
                .limit(req.query.limit ? req.query.limit : 5);
        } else if (qTag) {
            products = await Products.find({
                tags: {
                    $in: [qTag],
                },
            }).limit(req.query.limit ? req.query.limit : 5);
        } else if (qNew) {
            products = await Products.find()
                .sort({ createdAt: -1 })
                .limit(req.query.limit ? req.query.limit : 5);
        } else {
            products = await Products.find();
        }

        if (products) {
            return res.status(200).json({ success: true, products });
        } else {
            return res.status(404).json({
                success: false,
                status: "No product present in database",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const getProductByName = async (req, res) => {
    try {
        const prodName = req.query.product;
        const product = await Products.find({
            title: { $regex: prodName, $options: "i" },
        });

        if (product) {
            return res.status(200).json({ success: true, product });
        } else {
            return res.status(404).json({
                success: false,
                msg: `No product having "${prodName}" present in database`,
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const delProduct = await Products.findByIdAndDelete(req.params.prodId);
        if (delProduct) {
            return res
                .status(200)
                .json({ success: true, msg: "Product have been deleted" });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "Unable to delete product" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    getAllProducts,
    getProductByName,
    deleteProduct,
};
