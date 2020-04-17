var User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
var fs = require('fs');

// Login Page
exports.login = (req, res) => res.render('login');

// Register Page
exports.register = (req, res) => res.render('register');

//Registration Submit
exports.registrationSubmit = (req, res, next) => {

    originalfilename = '';
    if (req.file) {
        var originalfilename = unique_time + req.file.originalname;
    }
    User.findOne({ email: req.body.email }, function (err, user) {
        if (user) {
            return res.status(409).json({
                message: 'Mail exists'
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    let newUser = new User({
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        password: hash,
                        userimage: originalfilename
                    });
                    newUser.save((err, reguserresult) => {
                        if (err) {
                            req.flash('error', 'Error!!');
                            res.redirect('/register');
                            return res.status(500).json({ message: 'Failed to save new user' });
                        } else {
                            req.flash('success_msg', 'Successfully Added');
                            res.redirect('/login');
                            //return res.status(200).json({ message: 'Successfully registered' });
                        }
                    });
                }

            });
        }
    });

};

//Fetch all registered Users
exports.registerUserListing = (req, res, next) => {
    User.find(function (err, results) {
        res.json(results);
    });
};

//delete users
exports.deleteRegisterUser = (req, res, next) => {
    User.remove({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
};

//Login Submit
exports.loginSubmit = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

// Logout
exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
};

//Edit Profile Page
exports.editProfile = (req, res) => res.render('edit_profile', {
    user: req.user
});

//Edit Profile Submit
exports.editProfileSubmit = (req, res, next) => {
    //console.log(req);
    var session_userimage = req.user.userimage;
    var originalfilename = '';
    if (session_userimage) {
        originalfilename = session_userimage;
    }
    if (req.file) {
        originalfilename = unique_time + req.file.originalname;
    }
    User.updateOne(
        { _id: req.user.id },
        {
            $set: {
                'first_name': req.body.first_name,
                'last_name': req.body.last_name,
                'email': req.body.email,
                'userimage': originalfilename
            }
        },
        function (err, user) {
            if (err) {
                req.flash('error', 'Failed to edit');
                res.redirect('/edit_profile');
            }
            if (req.body.email.lenght <= 0 || req.body.email.lenght <= 0 || req.body.first_name.lenght <= 0 || req.body.last_name.lenght <= 0) {
                req.flash('error', 'One or more fields are empty');
                res.redirect('/edit_profile');
            }
            else {
                req.flash('success_msg', 'Successfully Edited');
                res.redirect('/edit_profile');
            }
        });
};

// Change Password Page
exports.changePassword = (req, res) => res.render('change_password', {
    user: req.user
});

//Change Password Submit
exports.changePasswordSubmit = (req, res, next) => {
    console.log(req);
    bcrypt.hash(req.body.new_password, 10, function (err, hash) {
        User.updateOne(
            { _id: req.user.id },
            {
                $set: {
                    'password': hash
                }
            },
            function (err, user) {
                if (err) {
                    req.flash('error', 'Failed to edit password field');
                    res.redirect('/change_password');
                }
                else {
                    req.flash('success_msg', 'Password Successfully Updated');
                    res.redirect('/change_password');
                }
            });
    });

};

//Download Profile (TEXT File)
exports.downloadfile = (req, res) => {
    console.log(req.user);
    const file = `E:/Node API/project1/public/downloads/abcd.txt`;
    var content = `First Name:  ${req.user.first_name} \r\n`;
    content += `Last Name:  ${req.user.last_name} \r\n`;
    content += `Email Id:  ${req.user.email} \r\n`;
    fs.writeFile(file, content, function (err, file_result) {
        if (err) {
            console.log(err);
        }
        else {
            res.download(file); // Set disposition and send it.
        }
    });

};

//delete user
exports.deleteUser = (req, res, next) => {
    User.remove({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
};