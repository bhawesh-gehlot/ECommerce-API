const mongoose = require("./dbConnect");

const productSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, unique: true, min: 3, max: 1024},
        description: { type: String, required: true, min: 5, max: 5000 },
        price: { type: Number, required: true },
        tags: { type: Array, required: true },
        imgURL: { type: String, default: null },
        providedBy: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
