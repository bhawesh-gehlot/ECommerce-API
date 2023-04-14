const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose
    .connect("mongodb+srv://bhaweshgehlot:bhaweshgehlot@cluster0.rrgelco.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to MongoDB Successfully");
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = mongoose

// mongodb+srv://bhaweshgehlot:bhaweshgehlot@cluster0.rrgelco.mongodb.net/?retryWrites=true&w=majority