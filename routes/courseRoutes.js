// NPM Imports
const { Router } = require("express");

// Project Imports
const courseController = require("../controllers/courseController");

// Create Express Router
const router = Router();

router.get('/add', courseController.add_get);
router.post('/add', courseController.add_post);
router.get('/update/:id', courseController.update_get);
router.post('/update', courseController.update_post);
router.get('/delete/:id', courseController.delete_get);
router.post('/delete', courseController.delete_post);

module.exports = router;