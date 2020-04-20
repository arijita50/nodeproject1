var mongoose = require("mongoose");

const URI = "mongodb+srv://admin:4XJ6YyghFqud5fGc@cluster0-dstnh.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(URI, { 
    useUnifiedTopology: true,  
    useNewUrlParser: true 
});
mongoose.connection.on('connected', () => {
    console.log('connected to mongodb');
});


//connect to mongodb
// mongoose.connect('mongodb://localhost:27017/project1');

// //on connection
// mongoose.connection.on('connected', () => {
//     console.log('connected to database mongodb @27017');
// });

// mongoose.connection.on('error', (err) => {
//     if (err) {
//         console.log('error in database connection' + err);
//     }
// });