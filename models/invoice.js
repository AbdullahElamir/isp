var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var textSearch = require('mongoose-text-search');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var Invoice = new Schema({
   customer: { type: mongoose.Schema.ObjectId, ref :'Customer'},
   /*createDate: { type: Date, default: Date.now },*/
   type: { type: Number, required: [true, 'Why no type?']},
   notes: { type: String},
   piad: { type: Number},
   reseller: { type: Schema.Types.ObjectId , ref: 'Reseller',default:null},
   user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',default:null},
   invoice: { type: Schema.Types.ObjectId , ref: 'Invoice',default:null},
   /*left: { type: Number},*/
   discount: { type: Number, required: [true, 'Why no piad?']},
   idinv:{ type: Number},
   typein: { type: Number, default:1},
   startDate: { type:Date,default:null},
   endDate:{ type: Date,default:null},
   instock: { type: mongoose.Schema.ObjectId, ref : 'Instock',default:null},
   status: { type: Number, default:1},
   month: { type: Number, default:0},
   day: { type: Number, default:0},
   giga: { type: Number, default:0},
   path : {type: String,default:null},
   reject_message : {type: String,default:null}
});
Invoice.plugin(autoIncrement.plugin, {
    model: 'Invoice',
    field: 'idinv'
});
Invoice.plugin(textSearch);
Invoice.plugin(timestamps);
Invoice.index({ customer: 'text'});
exports.Invoice = mongoose.model('Invoice', Invoice);