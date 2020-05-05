const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    storeId: {type:String},
    productName: {type:String},
    brandName: {type:String},
    type: {type:String, trim:true},
    imageUrl: {type:String},
    stock: {type:Boolean},
    quantityPrize: [{
        quantity: {type:Number},
        prize: {type:Number}
    }],
})

module.exports = mongoose.model('Product', ProductSchema)
