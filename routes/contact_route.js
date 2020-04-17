var express = require("express");
var router = express.Router();

var Contact = require('../models/contact');

//fetch all contacts
router.get('/contacts', (req, res, next) => {
    Contact.find(function (err, contacts) {
        res.json(contacts);
    });
});

//add contacts
router.post('/contacts', (req, res, next) => {
    let newContact = new Contact({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        comments: req.body.comments
    });
    newContact.save((err, contact) => {
        if (err) {
            res.json({ msg: 'Failed to save new contact' });
        } else {
            res.json({ msg: 'Contact save successfully' });
        }
    });

});

//delete contacts
router.delete('/contacts/:id', (req, res, next) => {
    Contact.remove({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});

//edit contacts
router.put('/contacts/:id', (req, res, next) => {
    Contact.updateOne(
        { _id: req.params.id },
        {
            $set: {
                'first_name': req.body.first_name,
                'last_name': req.body.last_name,
                'email': req.body.email,
                'comments': req.body.comments
            }
        },
        function (err, contact) {
            if (err) {
                res.json({ msg: 'Failed to update contact' });
            } else {
                res.json({ msg: 'Contact updated successfully' });
            }
        });
});

//fetch contact details
router.get('/contacts/:ids', (req, res, next) => {
    Contact.findOne({ _id: req.params.ids }, function (err, contacts) {
        res.json(contacts);
    });

});

module.exports = router;