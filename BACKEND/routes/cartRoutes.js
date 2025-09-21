const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/authMiddleware'); // assuming JWT auth middleware

router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addToCart);
router.get('/get-sells-count', cartController.getSellsCartCount);
router.get('/get-draft-count', cartController.getDraftCartCount);
router.delete('/remove/:cartId', auth, cartController.removeFromCart);
router.put('/update/:cartId', auth, cartController.updateCart);

module.exports = router;
