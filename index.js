const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const login = require("./routes/login");
const user = require("./routes/users");
const product = require("./routes/product");
const wishlist = require("./routes/wishlist");
const cart = require("./routes/cart");
const order = require("./routes/order");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
dotenv.config();
app.use(cors());

app.use(login);
app.use(user);
app.use("/products", product);
app.use("/wishlist", wishlist);
app.use("/cart", cart);
app.use("/order", order);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Listening on Port ${PORT}`);
});
