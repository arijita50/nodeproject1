const mongoose = require("mongoose");
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const ProductCategorySchema = mongoose.Schema({
    category_title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        slug: "category_title",
        unique: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    category_image: {
        type: String,
        require: true
    },
    //category_parent_id: {
    //    type: String,
    //    ref: 'ProductCategory',
    //    require: true
    //},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    created_at: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
});

const ProductCategory = module.exports = mongoose.model('ProductCategory', ProductCategorySchema);