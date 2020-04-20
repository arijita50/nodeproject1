var mongoose = require("mongoose");

const URI = "mongodb+srv://admin:4XJ6YyghFqud5fGc@cluster0-dstnh.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = () => {
    mongoose.connect(URI);
    console.log('connected to mongodb');
}