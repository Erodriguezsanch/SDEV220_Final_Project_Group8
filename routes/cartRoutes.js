const { Router } = require("express");
const cartController = require("../controllers/cartController");

const router = Router();

router.get('/', cartController.cart_get);
router.get('/add/:id', cartController.cartAdd_get);
router.get('/remove/:id', cartController.cartRemove_get);
router.get('/enroll', cartController.enroll_get);

module.exports = router;