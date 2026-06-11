const express = require('express');
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/packingController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', getItems);
router.post('/', createItem);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
