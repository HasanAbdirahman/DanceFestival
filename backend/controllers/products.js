const Product = require("../models/product");

// create product => this can  be done by the admin only
const createProduct = async (req, res, next) => {
  try {
    const { name, age, category } = req.body;

    const product = await Product.create({ name, age, category });
    if (!product) {
      return next(new Error("Product not found"));
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    if (error) {
      return next(error.message);
    }
  }
};

// update product => this can  be done by the admin only
const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        age: req.body.age,
        category: req.body.category,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    if (error) {
      return error.message;
    }
  }
};

// get all  product =>
const index = async (req, res, next) => {
  try {
    const product = await Product.find();
    const productCounts = await Product.countDocuments();
    if (!product) {
      return next(new Error("Product not found"));
    }

    res.status(200).json({
      success: true,
      productCounts,
      product,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
};

// delete product => only done by the admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new Error("Product not found"));

    await product.remove();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    if (err) return next(err.message);
  }
};

// details each product

const show = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new Error("Product not found"));
    }

    res.status(200).json({
      product,
      success: true,
    });
  } catch (error) {
    if (error) {
      return next(error.message);
    }
  }
};

module.exports = { createProduct, updateProduct, index, deleteProduct, show };
