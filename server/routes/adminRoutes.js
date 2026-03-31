const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getOrganizationUsers, updateUserRole } = require('../controllers/adminController');

router.use(protect, authorizeRoles('admin'));

router.get('/users', getOrganizationUsers);
router.patch('/users/:id', updateUserRole);

module.exports = router;
