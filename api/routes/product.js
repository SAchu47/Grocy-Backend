const Product = require('../models/Product')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

// Add a product
router.post('/addproduct', checkAuth, (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.decode(token, {complete: true})
    const payloadData = decoded.payload

    Product.find({ storeId: payloadData.userId})
    .exec()
    .then(product => {
        let picked = [product.find(items => items.productName === req.body.productName)];
        if((product.length >= 1 && picked.length > 1) || (picked[0] !== undefined)) {
            //delete picked;
            return res.status(409).json({
                message: 'Product already exists. It\'s possible update it',
            })
        }
        else {
            const product = new Product({
                storeId: payloadData.userId,
                productName: req.body.productName,
                brandName: req.body.brandName,
                type: req.body.type,
                imageUrl: req.body.imageUrl,
                stock: req.body.stock,
                quantityPrize: [{
                    quantity: req.body.quantityPrize.quantity,
                    prize: req.body.quantityPrize.prize
                }],
            })
            product
            .save()
            .then(result => {
                res.status(201).json({
                    message: 'Product added'
                })
            })
            .catch(err => {
                res.json({
                    error: err
                })
            })
        }   
    })
    .catch(err => {
        res.json({
            error: err
        })
    })
})

// get the list of products for specific vendor
// send storeId in body
router.get('/listproduct', checkAuth, (req, res, next) => {

    Product.find({ storeId: req.body.storeId })
    .exec()
    .then(product => {
        res.json({
            confirmation: 'success',
            data: product
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