var express = require("express");
var router = express.Router();
const multer = require('multer');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const UserController = require('../controllers/user');

// Login Page
router.get('/login', forwardAuthenticated, UserController.login);

// Register Page
router.get('/register', forwardAuthenticated, UserController.register);

var unique_time = Date.now();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
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


//Registration Submit
router.post('/signup', upload.single('userimage'), UserController.registrationSubmit);


//Fetch all registered Users
router.get('/signup', UserController.registerUserListing);

//delete users
router.delete('/signup/:id', UserController.deleteRegisterUser);

//Login
router.post('/login', UserController.loginSubmit);

// Logout
router.get('/logout', UserController.logoutUser);

//Edit Profile Page
router.get('/edit_profile', ensureAuthenticated, UserController.editProfile);

//edit user
router.post('/edit_profile', upload.single('userimage'), UserController.editProfileSubmit);

// Change Password Page
router.get('/change_password', ensureAuthenticated, UserController.changePassword);

//Change Password
router.post('/change_password', ensureAuthenticated, UserController.changePasswordSubmit);

//Download Profile (TEXT File)
router.get('/downloadFile', ensureAuthenticated, UserController.downloadfile);

//delete user
router.delete('/user_delete/:id', UserController.deleteUser);


module.exports = router;