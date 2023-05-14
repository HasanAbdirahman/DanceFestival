const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/products");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middlewares/isAuthenticated");

router.post(
  "/createProduct",
  isAuthenticated,
  isAuthorized,
  productCtrl.createProduct
);

router.put("/updateProduct/:id", productCtrl.updateProduct);
router.get("/index", productCtrl.index);
router.delete(
  "/deleteProduct/:id",
  isAuthenticated,
  isAuthorized,
  productCtrl.deleteProduct
);
router.get("/show/:id", isAuthorized, productCtrl.show);
module.exports = router;
