const Product = require('../models/Product');
const imagekit = require('../config/imagekit');

// @desc    Fetch all products with pagination, sorting & searching
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const keyword = req.query.query ? {
      name: {
        $regex: req.query.query,
        $options: 'i',
      }
    } : {};

    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc': sort = { price: 1 }; break;
        case 'price_desc': sort = { price: -1 }; break;
        case 'rating': sort = { 'rating.rate': -1 }; break;
        case 'name_asc': sort = { name: 1 }; break;
        case 'name_desc': sort = { name: -1 }; break;
        default: sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).sort(sort).skip(skip).limit(limit);

    res.json({
      success: true,
      data: {
        products,
        page,
        pages: Math.ceil(count / limit),
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, discount, stock, image, imageFileId, rating, coupon } = req.body;
    
    // NOTE: In a real app with Multer, image uploading would happen before this, 
    // or we use ImageKit SDK to upload base64/buffer.
    // Assuming the frontend uploads directly to ImageKit and sends the URL and fileId,
    // OR we can implement server-side upload here if needed.

    const product = new Product({
      name,
      description,
      category,
      price,
      discount,
      stock,
      image,
      imageFileId,
      rating,
      coupon
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, discount, stock, image, imageFileId, rating, coupon } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // If a new image is provided, delete the old one from ImageKit
      if (imageFileId && product.imageFileId && imageFileId !== product.imageFileId) {
        try {
          await imagekit.files.delete(product.imageFileId);
        } catch (ikError) {
          console.error("ImageKit delete error:", ikError);
        }
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price || product.price;
      product.discount = discount !== undefined ? discount : product.discount;
      product.stock = stock !== undefined ? stock : product.stock;
      if (image) product.image = image;
      if (imageFileId) product.imageFileId = imageFileId;
      if (rating) product.rating = rating;
      if (coupon) product.coupon = coupon;

      const updatedProduct = await product.save();
      res.json({ success: true, data: updatedProduct });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.imageFileId) {
        try {
          await imagekit.files.delete(product.imageFileId);
        } catch (ikError) {
          console.error("ImageKit delete error:", ikError);
        }
      }
      await product.deleteOne();
      res.json({ success: true, message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon
// @route   POST /api/products/:id/apply-coupon
// @access  Public
const applyCoupon = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    const product = await Product.findById(req.params.id);

    if (product && product.coupon && product.coupon.code === couponCode) {
      let discountAmount = 0;
      if (product.coupon.discountType === 'percentage') {
        discountAmount = (product.price * product.coupon.discountValue) / 100;
      } else {
        discountAmount = product.coupon.discountValue;
      }
      
      const finalPrice = product.price - discountAmount;
      
      res.json({
        success: true,
        originalPrice: product.price,
        discountPercentage: product.coupon.discountType === 'percentage' ? product.coupon.discountValue : null,
        discountAmount: discountAmount,
        finalPrice: finalPrice
      });
    } else {
      res.json({ success: false, message: 'Invalid coupon code' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  applyCoupon
};
