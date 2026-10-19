const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const requireUser = (req, res) => {
  if (!req.user?._id) {
    res.status(401).json({
      success: false,
      message: 'Please login to add products to your cart.',
    });
    return false;
  }
  return true;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    if (!requireUser(req, res)) return;
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    const validItems = cart.items.filter((item) => item.product);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    if (!requireUser(req, res)) return;
    const { productId, quantity, couponCode } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    } else {
      const productIds = cart.items.map((item) => item.product).filter(Boolean);
      const existingProducts = await Product.find({ _id: { $in: productIds } }).select('_id');
      const existingProductIds = new Set(existingProducts.map((item) => String(item._id)));
      cart.items = cart.items.filter((item) => item.product && existingProductIds.has(String(item.product)));
    }

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
      if (couponCode) cart.items[itemIndex].couponCode = couponCode;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1, couponCode });
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    cart.items = cart.items.filter((item) => item.product);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    if (!requireUser(req, res)) return;
    if (!mongoose.isValidObjectId(req.params.productId)) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    const { quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.product && item.product.toString() === req.params.productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        cart.items = cart.items.filter((item) => item.product);
        res.json({ success: true, data: cart });
      } else {
        res.status(404);
        throw new Error('Item not found in cart');
      }
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    if (!requireUser(req, res)) return;
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = cart.items.filter((item) => item.product && item.product.toString() !== req.params.productId);
      await cart.save();
      cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      cart.items = cart.items.filter((item) => item.product);
      res.json({ success: true, data: cart });
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    if (!requireUser(req, res)) return;
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
