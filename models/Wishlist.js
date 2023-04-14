const mongoose = require("./dbConnect");

const WishlistSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
        },
        products: [
            {
                productID: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
