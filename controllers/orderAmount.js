// const Order = require("../models/Order");
const Product = require("../models/Products");

const getTotalAmount = async (products) => {
    let finalAmount = 0;
    try {
        for (const element of products) {
            const prodId = element.productID;
            let qty = element.quantity;
            const reqProduct = await Product.findById(prodId);
            let reqPrice = reqProduct.price;
            finalAmount = finalAmount + reqPrice * qty;
        }
        return finalAmount;
    } catch (err) {
        console.log(err);
        return finalAmount;
    }
};

module.exports = { getTotalAmount };
