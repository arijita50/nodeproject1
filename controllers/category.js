var Category = require('../models/category');
const fs = require('fs');

//Category Listing Page
exports.getCategoryListing = (req, res) => {
    regex = '';
    var perPage = 5
    var page = req.params.page || 1

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Category.find({ "category_title": regex })
            .populate("author")
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ "created_at": -1 })
            .exec(function (err, search_category) {
                Category.count({ "category_title": regex }).exec(function (err, count) {
                    if (err) return next(err)
                    res.render('category_list', {
                        user: req.user,
                        all_categories: search_category,
                        search_text: req.query.search,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        count: count
                    })
                })
            })
    }
    else {
        Category.find({})
            .populate("author")
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ "created_at": -1 })
            .exec(function (err, all_categories) {
                Category.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('category_list', {
                        user: req.user,
                        all_categories: all_categories,
                        search_text: regex,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        count: count
                    })
                })
            })
    }

};

//Category Listing Page With Pagination
exports.getCategoryPaginationwiseListing = (req, res) => {
    regex = '';
    var perPage = 5
    var page = req.params.page || 1

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Category.find({ "category_title": regex })
            .populate("author")
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ "created_at": -1 })
            .exec(function (err, search_cat) {
                Category.count({ "category_title": regex }).exec(function (err, count) {
                    if (err) return next(err)
                    res.render('category_list', {
                        user: req.user,
                        all_categories: search_cat,
                        search_text: req.query.search,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
    }
    else {
        Category.find({})
            .populate("author")
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ "created_at": -1 })
            .exec(function (err, all_categories) {
                Category.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('category_list', {
                        user: req.user,
                        all_categories: all_categories,
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

//Category Add Page
exports.addCategory = (req, res) => {
    Category.find({})
        .sort({ "created_at": -1 })
        .exec(function (err, all_categories) {
            Category.count().exec(function (err, count) {
                if (err) return next(err)
                res.render('add_category', {
                    user: req.user,
                    all_categories: all_categories,
                    category_count: count
                });
            });

        });
};

//Category Add Submit
exports.addCategorySubmit = (req, res, next) => {
    originalfilename = '';
    if (req.file) {
        var originalfilename = unique_time + req.file.originalname;
    }

    let newCategory = new Category({
        category_title: req.body.category_title,
        description: req.body.category_description,
        category_image: originalfilename,
        //category_parent_id: parent_category_id,
        created_at: unique_time,
        status: req.body.status
    });

    newCategory.save((err, catresult) => {
        console.log(catresult);
        if (err) {
            console.log(err);
            req.flash('error', err);
            res.redirect('/add_category');
        } else {
            Category.updateOne(
                { _id: catresult._id },
                {
                    $set: {
                        'author': req.user._id
                    }
                },
                function (err, cat_updt) {
                    if (!err) {
                        req.flash('success_msg', 'Successfully Added');
                        res.redirect('/product_category');
                    }
                });

        }
    });
};

//delete category
exports.deleteCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.id }, function (err, cat) {
        //console.log(prod);
        fs.unlink(`./public/uploads/products/category/${cat.category_image}`, function (err) {
            if (err) return console.log(err);
            Category.remove({ _id: req.params.id }, function (err, result) {
                if (err) {
                    req.flash('error', 'Error!!');
                    res.redirect('/product_category');
                }
                else {
                    //res.json(result);
                    req.flash('success_msg', 'Category Successfully Deleted');
                    res.redirect('/product_category');
                }
            });
        });

    });
};

//Category Edit Page
exports.editCategory = (req, res) => {
    Category.findOne({ slug: req.params.slug })
        .populate("author")
        .exec(function (err, cat_details) {
            console.log(cat_details);
            res.render('edit_category', { cat_details: cat_details })
        });
};

//Category Edit Submit
exports.editCategorySubmit = (req, res) => {
    Category.findOne({ slug: req.params.slug })
        .populate("author")
        .exec(function (err, cat_details) {
            console.log(cat_details);

            var session_prodimage = cat_details.category_image;
            var originalfilename = '';
            if (session_prodimage) {
                originalfilename = session_prodimage;
            }
            if (req.file) {
                originalfilename = unique_time + req.file.originalname;
                fs.unlinkSync(`./public/uploads/products/category/${cat_details.category_image}`);
            }

            var status = false;
            if (req.body.status == 1) {
                status = true;
            }

            Category.updateOne(
                { _id: cat_details._id },
                {
                    $set: {
                        'category_title': req.body.category_title,
                        'description': req.body.category_description,
                        'category_image': originalfilename,
                        'status': status
                    }
                },
                function (err, prod) {
                    if (err) {
                        req.flash('error', 'Failed to update');
                        res.redirect('/category_edit/' + req.params.slug);
                    }
                    else {
                        req.flash('success_msg', 'Successfully Edited');
                        res.redirect('/category_edit/' + req.params.slug);
                    }
                });

        });
};