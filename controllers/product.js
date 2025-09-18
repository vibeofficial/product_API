const productModel = require('../model/product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const userModel = require('../model/user');

exports.createProduct = async (req, res) => {
  try {
    const { productName, price, description } = req.body;
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json('Cannot create product for unexisting user')
    };

    const existProduct = await productModel.findOne({ productName: productName });
    const file = req.file;
    let response;

    if (existProduct) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        message: 'Product already exist'
      })
    };

    if (file && file.path) {
      response = await cloudinary.uploader.upload(file.path);
      console.log(response);

      fs.unlinkSync(file.path);
    };

    const product = new productModel({
      productName,
      price,
      description,
      productImage: { imageUrl: response.secure_url, publicId: response.public_id }
    });

    await product.save();
    res.status(201).json({
      message: 'Product created successfully',
      data: product
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: `Error creating product: ${error.message}`
    })
  }
};


exports.getAll = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      message: 'All products',
      data: products
    })
  } catch (error) {
    res.status(500).json({
      message: `Error getting all products: ${error.message}`
    })
  }
};


exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    };

    res.status(200).json({
      message: "Product",
      data: product
    })
  } catch (error) {
    res.status(500).json({
      message: `Error getting product: ${error.message}`
    })
  }
};


exports.update = async (req, res) => {
  try {
    const { productName, price, description } = req.body;
    const { id } = req.params;
    const product = await productModel.findById(id);
    const file = req.file;
    let response;

    if (!productName || !price || !description) {
      return res.status(400).json({
        message: 'An input field is required'
      })
    };

    if (!product) {
      fs.unlinkSync(file.path);
      return res.status(404).json({
        message: 'Product not found'
      })
    };

    if (file && file.path) {
      await cloudinary.uploader.destroy(product.productImage.publicId);
      response = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);
    };

    const data = {
      productName: productName ?? product.productName,
      price: price ?? product.price,
      description: description ?? product.description,
      productImage: { imageUrl: response?.secure_url, publicId: response?.public_id }
    };

    const updated = await productModel.findByIdAndUpdate(product._id, data, { new: true });
    res.status(200).json({
      message: "Product updated successfully",
      data: product
    })
  } catch (error) {
    res.status(500).json({
      message: `Error getting product: ${error.message}`
    })
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    };

    const deleteProduct = await productModel.findByIdAndDelete(product._id);

    if (deleteProduct) {
      await cloudinary.uploader.destroy(product.productImage.publicId)
    };

    res.status(200).json({
      message: 'Product deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: `Error deleting product: ${error.message}`
    })
  }
}