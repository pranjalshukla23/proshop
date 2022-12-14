import asyncHandler from 'express-async-handler';
import Product from '../models/productModal.js';

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {

  //set products per page
  const pageSize = 2;

  console.log("query:",req.query)

  //set the page number
  const page = Number(req.query.pageNumber);

  //fetch the keyword
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i',
    },
  } : {};

  //get total products in db
  const count = await Product.countDocuments({...keyword});

  //get the products for each page
  const products = await Product.find({...keyword}).
      limit(pageSize).
      skip(pageSize * (page - 1));

  console.log(products);

  //send products for each page, the current page number and the total number of pages
  res.json({products, page, pages: Math.ceil(count / pageSize)});

});

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }

});

// @desc   delete single product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({
      message: 'product removed',
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }

});

// @desc   create single product
// @route  POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {

  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc   update single product
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {

  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.brand = brand;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);

  } else {
    res.status(404);
    throw new Error('Product not found');
  }

});

// @desc   create new review
// @route  POST /api/products/:id/reviews
// @access Private/Admin
const createProductReview = asyncHandler(async (req, res) => {

  const {rating, comment} = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {

    const alreadyReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString());

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc,
        0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      message: 'Review Added',
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }

});

// @desc   get top rated products
// @route  GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {

  const products = await Product.find({}).sort({
    rating: -1,
  }).limit(3);

  res.json(products);

});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
