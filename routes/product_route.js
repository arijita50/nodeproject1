var express = require("express");
var router = express.Router();
const multer = require('multer');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const ProductController = require('../controllers/products');
 
var unique_time = Date.now();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/products/');
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

//Product Listing Page
router.get('/products', ProductController.getListProducts);

//Product Listing Page With Pagination
router.get('/products/:page', ProductController.getListPaginationProducts);
 
//Product Add Page
router.get('/add_product', ProductController.addProduct);

//Product Add
router.post('/add_product', upload.single('product_image'), ProductController.addProductSubmit);

//delete products
router.get('/product_delete/:id', ProductController.deleteProduct);

//Product Edit Page
router.get('/product_edit/:slug', ProductController.editProduct);

//Product Edit
router.post('/product_edit/:slug', upload.single('product_image'), ProductController.editProductSubmit);

module.exports = router;