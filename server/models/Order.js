const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    products: [{
        type: Schema.type.ObjId,
        ref: 'Product'
    }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order