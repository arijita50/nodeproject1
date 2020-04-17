const mongoose = require("mongoose");
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const ProductSchema = mongoose.Schema({
    product_title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        slug: "product_title",
        unique: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    product_image: {
        type: String,
        require: true
    },
    product_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        require: true
    },
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

const Product = module.exports = mongoose.model('Product', ProductSchema);