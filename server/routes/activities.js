const express = require('express');
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getActivities);
router.post('/', createActivity);
router.patch('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
