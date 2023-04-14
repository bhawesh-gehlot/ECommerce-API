const mongoose = require("./dbConnect");

const orderSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
        },
        products: [
            {
                productID: { type: String, required: true },
                quantity: { type: Number, default: 1 },
            },
        ],
        totalAmount: { type: Number, required: true, default: 0 },
        discount: { type: Number, default: 0 },
        finalAmount: { type: Number, required: true, default: 0 },
        address: { type: String, required: true },
        status: { type: String, default: "Pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
