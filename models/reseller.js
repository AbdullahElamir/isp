var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var Reseller = new Schema({
   repName: { type: String},
   companyName: { type:String, index: true},
   city: String,
   address: String,
   langtitude: String,
   longtitude: String,
   email: { type: String,required : [true, 'الرجاء التأكد من ادخال الايميل']},
   password: { type: String, required: true},
   salt: String,
   status: { type: Number, min: 1, max: 10, default:1 },
   phone: String,
   // policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy'},
   warehouse: { type: Schema.Types.ObjectId , ref: 'Warehouse',default:null},
   policy: { type: Schema.Types.ObjectId , ref: 'Policy',default:null},
   level: { type: Number, default:2},
   status: { type: Number, default:1}
});


Reseller.plugin(timestamps); 
Reseller.index({ repName: 'text'});
exports.Reseller = mongoose.model('Reseller', Reseller);