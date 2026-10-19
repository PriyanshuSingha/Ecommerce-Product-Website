const Order = require('../models/Order');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const validateAmount = (amount) => Number.isInteger(amount) && amount > 0;

const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const amountInPaise = Math.round(Number(amount) * 100);

    if (!validateAmount(amountInPaise)) {
      res.status(400);
      throw new Error('A valid payment amount is required');
    }

    const paymentOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${req.user._id}_${Date.now()}`,
      notes: { userId: String(req.user._id) },
    });

    res.status(201).json({
      success: true,
      data: {
        id: paymentOrder.id,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const digest = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const receivedSignature = Buffer.from(razorpay_signature || '');
    if (receivedSignature.length !== digest.length ||
      !crypto.timingSafeEqual(Buffer.from(digest), receivedSignature)) {
      res.status(400);
      throw new Error('Payment verification failed');
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
  try {
    const {
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (products && products.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = new Order({
        user: req.user._id,
        products,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      const createdOrder = await order.save();
      res.status(201).json({ success: true, data: createdOrder });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('products.product');
    
    if (order) {
      res.json({ success: true, data: order });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders/admin
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').populate('products.product').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus;
      const updatedOrder = await order.save();
      res.json({ success: true, data: updatedOrder });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrderItems,
  createPaymentOrder,
  verifyPayment,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus
};
