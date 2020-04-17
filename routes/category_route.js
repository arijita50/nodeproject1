var express = require("express");
var router = express.Router();
var User = require('../models/user');
const multer = require('multer');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const CategoryController = require('../controllers/category');

var unique_time = Date.now();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/products/category/');
    },
    filename: function (req, file, cb) {
        cb(null, unique_time + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
     
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //5mb
    fileFilter: fileFilter
});

//Category Listing Page
router.get('/product_category', CategoryController.getCategoryListing);

//Category Listing Page With Pagination
router.get('/product_category/:page', CategoryController.getCategoryPaginationwiseListing);

//Category Add Page
router.get('/add_category', CategoryController.addCategory);

//Category Add Submit
router.post('/add_category', upload.single('category_image'), CategoryController.addCategorySubmit);

//delete category
router.get('/category_delete/:id', CategoryController.deleteCategory);

//Category Edit Page
router.get('/category_edit/:slug', CategoryController.editCategory);

//Category Edit Submit
router.post('/category_edit/:slug', upload.single('category_image'), CategoryController.editCategorySubmit);

module.exports = router;