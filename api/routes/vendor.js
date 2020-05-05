const Vendor = require('../models/Vendor')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

// Create a new Vendor
router.post('/signup', (req, res, next) => {
    Vendor.find({ phoneNumber: req.body.phoneNumber})
    .exec()
    .then(vendor => {
        if(vendor.length >= 1) {
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
                    const vendor = new Vendor({
                        firstName: req.body.firstName,
                        middleName: req.body.middleName,
                        lastName: req.body.lastName,
                        password: hash,
                        shopName: req.body.shopName,
                        shopContactNumber: req.body.shopContactNumber, 
                        address: req.body.address,
                        pincode: req.body.pincode,
                        age: req.body.age,
                        phoneNumber: req.body.phoneNumber,
                        emailId: req.body.emailId,
                    })
                    vendor
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

// Vendor login
router.post('/login', (req, res, next) => {
    Vendor.find({ phoneNumber: req.body.phoneNumber})
    .exec()
    .then(vendor => {
        if(vendor.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, vendor[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if(result) {
                const token = jwt.sign({
                    phoneNumber: vendor[0].phoneNumber,
                    userId: vendor[0]._id
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

// list of vendors in a region on basis of pincode for auth users
// to use 
router.get('/list', checkAuth, (req, res) => {
    let filter = req.query

    if (req.query.pincode != null){
        filter = {
            pincode: {$eq: req.query.pincode}
        } 
    }
    Vendor.find(filter)
    .then(vendors => {
        res.json({
            confirmation: 'success',
            data: vendors
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