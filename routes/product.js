var express = require("express");
const ProductController = require("../controllers/ProductController");

var router = express.Router();

router.get("/", ProductController.productList);
router.get("/:code", ProductController.productDetail);
router.post("/", ProductController.productStore);
router.put("/:code", ProductController.productUpdate);
router.delete("/:code", ProductController.productDelete);

module.exports = router;