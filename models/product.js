var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var Product = new Schema({
   name: { type: String, required: true},
   type: { type: String, enum: ['service', 'item', 'package'], required: true},
   discriptoin: { type: String, required: true},
   initialPrice: { type: Number, required: true},
   item: {
      supplier: {type: Schema.Types.ObjectId , ref: 'Supplier'},
      made:{type: Number},
      brand:{type: String}
   },
   packages: {
      type: { type: Number},
      service: {type: Schema.Types.ObjectId , ref: 'Services'},
      dSpeed: { type: Number},
      uSpeed: { type: Number},
      monthlyQuota: { type: Number},
      renewPrice: { type: Number},
      GBPrice: { type: Number},
      cost: Number,
      costCurrency: { type: Number},
      exchangeRate: { type: Number}
   },
   status: {type: Number, default:1}
});

Product.plugin(timestamps);
Product.index({ name: 'text'});
exports.Product = mongoose.model('Product', Product);