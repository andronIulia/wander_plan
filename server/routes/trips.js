const express = require('express');
const { body } = require('express-validator');
const {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getTrips);
router.get('/:id', getTrip);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('destination').trim().notEmpty().withMessage('Destination is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
  ],
  createTrip
);

router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);

module.exports = router;
