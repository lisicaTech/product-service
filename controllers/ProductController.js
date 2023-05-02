const Product = require("../models/ProductModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Product Schema
function ProductData(data) {
	// this.id = data._id;
	this.code = data.code;
	this.description = data.description;
	this.type = data.type;
	this.price = data.price;
	this.createdAt = data.createdAt;
}

/**
 * Product List.
 * 
 * @returns {Object}
 */
exports.productList = [
	// auth,
	function (req, res) {
		try {
			Product.find({}, "_id code description type price createdAt").then((products) => {
				if (products.length > 0) {
					return apiResponse.successResponseWithData(res, "Operation success", products);
				} else {
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Product Detail.
 * 
 * @param {string}      code
 * 
 * @returns {Object}
 */
exports.productDetail = [
	// auth,
	function (req, res) {
		// if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		// 	return apiResponse.successResponseWithData(res, "Operation success", {});
		// }
		try {
			Product.findOne({ code: req.params.code }, "code description type price createdAt").then((product) => {
				if (product !== null) {
					let productData = new ProductData(product);
					return apiResponse.successResponseWithData(res, "Operation success", productData);
				} else {
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Product store.
 * 
 * @param {string}      code 
 * @param {string}      description
 * @param {string}      type
 * @param {Number}      price
 * 	
 * @returns {Object}
 */
exports.productStore = [
	// auth,
	body("code", "Code must not be empty.").isLength({ min: 1 }).trim().custom((value) => {
		return Product.findOne({ code: value }).then(product => {
			if (product) {
				return Promise.reject("product already exist with this Code");
			}
		});
	}),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("type", "Type must not be empty").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var product = new Product(
				{
					code: req.body.code,
					description: req.body.description,
					type: req.body.type,
					price: req.body.price
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save product.
				product.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let productData = new ProductData(product);
					return apiResponse.successResponseWithData(res, "Product added successfully.", productData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Product update.
 * 
 * @param {string}      description
 * @param {string}      price
 * 
 * @returns {Object}
 */
exports.productUpdate = [
	// auth,
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("price", "Price must not be empty").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				Product.findOne({ code: req.params.code }, function (err, foundProduct) {
					if (foundProduct === null) {
						return apiResponse.notFoundResponse(res, "Product does not exists with this code");
					} else {
						var product = new Product(
							{
								_id: foundProduct.id,
								code: req.params.code,
								description: req.body.description,
								type: foundProduct.type,
								price: req.body.price
							});
						//update Product.
						Product.findByIdAndUpdate(foundProduct.id, product, {}, function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							} else {
								let productData = new ProductData(product);
								return apiResponse.successResponseWithData(res, "Product updated successfully.", productData);
							}
						});
					}
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Product Delete.
 * 
 * @param {string}      code
 * 
 * @returns {Object}
 */
exports.productDelete = [
	// auth,
	function (req, res) {
		try {
			Product.findOne({ code: req.params.code }, function (err, foundProduct) {
				if (foundProduct === null) {
					return apiResponse.notFoundResponse(res, "Product does not exists with this code");
				} else {
					//delete Product.
					Product.findByIdAndRemove(foundProduct.id, function (err) {
						if (err) {
							return apiResponse.ErrorResponse(res, err);
						} else {
							return apiResponse.successResponse(res, "Product deleted successfully.");
						}
					});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];