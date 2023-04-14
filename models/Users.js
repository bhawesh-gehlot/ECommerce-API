const mongoose = require("./dbConnect");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 50,
        },
        email: { type: String, required: true, unique: true, min: 5, max: 256 },
        password: { type: String, required: true, min: 8, max: 1024 },
        name: { type: String, required: true, min: 2, max: 256 },
        contact: { type: String, max: 10 },
        isAdmin: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
