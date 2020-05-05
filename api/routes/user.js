const User = require('../models/User')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

// Create a new user
router.post('/signup', (req, res, next) => {
    User.find({ phoneNumber: req.body.phoneNumber})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'Number Already Exists'
            })
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    })
                }
                else {
                    const user = new User({
                        firstName: req.body.firstName,
                        middleName: req.body.middleName,
                        lastName: req.body.lastName,
                        password: hash,
                        address: req.body.address,
                        pincode: req.body.pincode,
                        age: req.body.age,
                        phoneNumber: req.body.phoneNumber,
                        emailId: req.body.emailId,
                    })
                    user
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: 'New Account Created'
                        })
                    })
                    .catch(err => {
                        res.json({
                            error: err
                        })
                    })
                }
            })
        }
        
    })
})

// User login
router.post('/login', (req, res, next) => {
    User.find({ phoneNumber: req.body.phoneNumber})
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if(result) {
                const token = jwt.sign({
                    phoneNumber: user[0].phoneNumber,
                    userId: user[0]._id
                },
                process.env.SECRECT_KEY,{
                    expiresIn: '1h'
                })
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                })
            }
            res.status(401).json({
                message: 'Auth failed'
            })
        })   
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

// Get users details
router.get('/users', (req, res) => {
    User.find()
    .then(users => {
        res.json({
            confirmation: 'success',
            data: users
        })
    })
    .catch(err => {
        res.json({
            confirmation: 'fail',
            message: err.message
        })
    })
})

// filtering
router.get('/users', (req, res) => {
    let filter = req.query

    if (req.query.phoneNumber != null){
        filter = {
            phoneNumber: {$eq: req.query.phoneNumber}
        } 
    }
    User.find(filter)
    .then(users => {
        res.json({
            confirmation: 'success',
            data: users
        })
    })
    .catch(err => {
        res.json({
            confirmation: 'fail',
            message: err.message
        })
    })
})
 
// export the router
module.exports = router