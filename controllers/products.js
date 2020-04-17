var Product = require('../models/product');
var Category = require('../models/category');
const fs = require('fs');

//Product Listing Page
exports.getListProducts = (req, res) => {
    regex = '';
    var perPage = 5
    var page = req.params.page || 1

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({ "product_title": regex })
            .populate("author")
            .populate("product_category")
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ "created_at": -1 })
            .exec(function (err, search_products) {
                Product.count({ "product_title": regex }).exec(function (err, count) {
                    if (err) return next(err)
                    res.render('product_list', {
                        user: req.user,
                        products: search_products,
                        search_text: req.query.search,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
    }
    else {
        Product.find({})
            .populate("author")
            .populate("product_category")
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ "created_at": -1 })
            .exec(function (err, all_products) {
                Product.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('product_list', {
                        user: req.user,
                        products: all_products,
                        search_text: regex,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
    }

};

//Product Listing Page With Pagination
exports.getListPaginationProducts = (req, res) => {
    regex = '';
    var perPage = 5
    var page = req.params.page || 1

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({ "product_title": regex })
            .populate("author")
            .populate("product_category")
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ "created_at": -1 })
            .exec(function (err, search_products) {
                Product.count({ "product_title": regex }).exec(function (err, count) {
                    if (err) return next(err)
                    res.render('product_list', {
                        user: req.user,
                        products: search_products,
                        search_text: req.query.search,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
    }
    else {
        Product.find({})
            .populate("author")
            .populate("product_category")
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ "created_at": -1 })
            .exec(function (err, all_products) {
                Product.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('product_list', {
                        user: req.user,
                        products: all_products,
                        search_text: regex,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
    }

};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//Product Delete
exports.deleteProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.id }, function (err, prod) {
        //console.log(prod);
        fs.unlink(`./public/uploads/products/${prod.product_image}`, function (err) {
            if (err) return console.log(err);
            Product.remove({ _id: req.params.id }, function (err, result) {
                if (err) {
                    req.flash('error', 'Error!!');
                    res.redirect('/products');
                }
                else {
                    //res.json(result);
                    req.flash('success_msg', 'Product Successfully Deleted');
                    res.redirect('/products');
                }
            });
        });

    });
};

//Product Add Page
exports.addProduct = (req, res) => {
    Category.find({})
        .sort({ "created_at": -1 })
        .exec(function (err, all_categories) {
            Category.count().exec(function (err, count) {
                if (err) return next(err)
                res.render('add_product', {
                    user: req.user,
                    all_categories: all_categories,
                    category_count: count
                });
            });

        });

};

//Product Add Submit
exports.addProductSubmit = (req, res, next) => {
    originalfilename = '';
    if (req.file) {
        var originalfilename = unique_time + req.file.originalname;
    }

    category_id = 0;
    if (req.body.category_id != "No Category Exists") {
        category_id = req.body.category_id;
    }

    let newProduct = new Product({
        product_title: req.body.product_title,
        description: req.body.product_description,
        price: req.body.product_price,
        product_category: category_id,
        product_image: originalfilename,
        created_at: unique_time,
        status: req.body.status
    });

    newProduct.save((err, prodresult) => {
        if (err) {
            req.flash('error', 'Error!!');
            res.redirect('/add_product');
        } else {
            Product.updateOne(
                { _id: prodresult._id },
                {
                    $set: {
                        'author': req.user.id
                    }
                },
                function (err, prod_updt) {
                    if (!err) {
                        req.flash('success_msg', 'Successfully Added');
                        res.redirect('/products');
                    }
                });
        }
    });
};

//Product Edit Page
exports.editProduct = (req, res) => {
    Product.findOne({ slug: req.params.slug })
        .populate("author")
        .populate("product_category")
        .exec(function (err, product_details) {
            Category.find({})
                .sort({ "created_at": -1 })
                .exec(function (err, all_categories) {
                    Category.count().exec(function (err, count) {
                        if (err) return next(err)
                        console.log(product_details);
                        res.render('edit_product', {
                            product_details: product_details,
                            all_categories: all_categories,
                            user: req.user,
                            category_count: count
                        })
                    });
                });
        });
};

//Product Edit Submit
exports.editProductSubmit = (req, res) => {
    Product.findOne({ slug: req.params.slug })
        .populate("author")
        .exec(function (err, product_details) {
            console.log(product_details);

            var session_prodimage = product_details.product_image;
            var originalfilename = '';
            if (session_prodimage) {
                originalfilename = session_prodimage;
            }
            if (req.file) {
                originalfilename = unique_time + req.file.originalname;
                fs.unlinkSync(`./public/uploads/products/${product_details.product_image}`);
            }

            var status = false;
            if (req.body.status == 1) {
                status = true;
            }

            category_id = 0;
            if (req.body.category_id != "No Category Exists") {
                category_id = req.body.category_id;
            }

            Product.updateOne(
                { _id: product_details._id },
                {
                    $set: {
                        'product_title': req.body.product_title,
                        'description': req.body.product_description,
                        'price': req.body.product_price,
                        'product_category': category_id,
                        'product_image': originalfilename,
                        'status': status
                    }
                },
                function (err, prod) {
                    if (err) {
                        req.flash('error', 'Failed to update');
                        res.redirect('/product_edit/' + req.params.slug);
                    }
                    else {
                        req.flash('success_msg', 'Successfully Edited');
                        res.redirect('/product_edit/' + req.params.slug);
                    }
                });

        });
};