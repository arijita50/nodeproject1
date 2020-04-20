var express = require("express");
const expressLayouts = require('express-ejs-layouts');
var engine = require('ejs-locals');
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var cors = require("cors");
var path = require("path");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const nodemailer = require('nodemailer');

const contact_route = require('./routes/contact_route');
const user_route = require('./routes/user_route');
const index_route = require('./routes/index');
const product_route = require('./routes/product_route');
const category_route = require('./routes/category_route');
const store_route = require('./routes/store_route');

var app = express();

// Passport Config
require('./config/passport')(passport);

//port no
var port = process.env.port || 3000;

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(cors());
app.use(bodyparser.json());
app.use('/', index_route);
app.use('/', contact_route);
app.use('/', user_route);
app.use('/', product_route);
app.use('/', category_route);
app.use('/', store_route);

app.use('/static', express.static('public'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("not_found");
});

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'aletha.ward23@ethereal.email',
        pass: 'hGsmyJrSYTgSAYmFVm'
    },
    tls: {
        rejectUnauthorized: false
    }
});

let mailOptions = {
    from: '" Arijita Rudra " <arijita500@gmail.com>',
    to: '" Arijita Paul " <sayani.kundu@webskitters.com>',
    subject: ' Test Mail ',
    text: ' Hello ',
    html: ' <b> Hello </b> '
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    } 
    //console.log('Message sent', info.messageId);
    //console.log(info);
});


//connect to mongodb
mongoose.connect('mongodb://localhost:27017/project1');

//on connection
mongoose.connection.on('connected', () => {
    console.log('connected to database mongodb @27017');
});

mongoose.connection.on('error', (err) => {
    if (err) {
        console.log('error in database connection' + err);
    }
});


//How we start to listen the server
app.listen(port, () => {
    console.log('Server started at port' + port);
});