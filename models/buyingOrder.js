var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var BuyingOrder = new Schema({
   createDate: { type: Date, default: Date.now },
   supplier: { type: Schema.Types.ObjectId , ref: 'Supplier'},
   notes: { type: String, required: true},
   paid: { type: Number, required: [true, 'Why no paid?']},
   left: { type: Number, required: [true, 'Why no left?']},
  
   status: { type: Number, default:1}
});

BuyingOrder.plugin(timestamps);
exports.BuyingOrder = mongoose.model('BuyingOrder', BuyingOrder);