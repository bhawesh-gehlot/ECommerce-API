const Order = require("../models/Order");
const {
    createOrderValidation,
    updateOrderValidation,
} = require("../validation/order");
const { getTotalAmount } = require("./orderAmount");

const createOrder = async (req, res) => {
    try {
        const validation = createOrderValidation(req.body);
        const valError = validation.error;
        if (valError) {
            return res
                .status(400)
                .json({ success: false, msg: valError.details[0].message });
        }

        if (req.body.totalAmount) {
            return res.status(400).json({
                success: false,
                msg: "Total Amount will be calculated automatically",
            });
        }
        if (req.body.finalAmount) {
            return res.status(400).json({
                success: false,
                msg: "Final Amount will be calculated automatically",
            });
        }

        if (req.body.userID) {
            return res.status(400).json({
                success: false,
                msg: "User ID will be assigned automatically",
            });
        }

        req.body.userID = req.user.id;

        const newOrder = new Order(req.body);

        const saveOrder = await newOrder.save();

        const totalAmt = await getTotalAmount(saveOrder.products);
        await Order.findByIdAndUpdate(saveOrder._id, {
            $set: { totalAmount: totalAmt },
        });

        if (saveOrder.discount) {
            await Order.findByIdAndUpdate(saveOrder._id, {
                $set: { finalAmount: totalAmt - saveOrder.discount },
            });
        } else {
            await Order.findByIdAndUpdate(saveOrder._id, {
                $set: { finalAmount: totalAmt },
            });
        }

        const finalOrder = await Order.findById(saveOrder._id);
        const { _id, userID, createdAt, updatedAt, __v, ...data } =
            finalOrder._doc;
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const updateOrder = async (req, res) => {
    try {
        const validation = updateOrderValidation(req.body);
        const valError = validation.error;
        if (valError) {
            return res
                .status(400)
                .json({ success: false, msg: valError.details[0].message });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        const { _id, userID, createdAt, updatedAt, __v, ...data } =
            updatedOrder._doc;
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const getOrder = async (req, res) => {
    try {
        const orders = await Order.find({ userID: req.user.id });
        if (orders.length !== 0) {
            return res.status(200).json({ success: true, orders: orders });
        } else {
            return res
                .status(404)
                .json({ success: false, msg: "No Order found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

// Get orders of all users
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        if (orders) {
            return res.status(200).json({ success: true, orders: orders });
        } else {
            return res.status(404).json({
                success: false,
                status: "No Order present in database",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const delOrder = await Order.findByIdAndDelete(req.params.id);
        if (delOrder) {
            return res
                .status(200)
                .json({ success: true, status: "Order have been deleted" });
        } else {
            return res
                .status(400)
                .json({ success: false, status: "Unable to delete Order" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

module.exports = {
    createOrder,
    updateOrder,
    getOrder,
    getAllOrders,
    deleteOrder,
};
