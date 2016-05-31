var generatePassword = require('password-generator'),
  easyPbkdf2 = require("easy-pbkdf2")();
var model = require("../models");
var inStock = null;

module.exports = {
  getInStock :function(limit,page,cb){
    page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    model.Instock.count({},function(err,count){
      model.Instock.find({}).limit(limit).skip(page*limit)
      .populate('product')
      .populate('warehouse')
      .exec(function(err, result){
        if(!err){
          cb({result:result,count:count});
        }else{
          console.log(err);
          cb(null);
        }
      });
    });
  },
  getInStockId :function(id,cb){
    model.Instock.findOne({_id : id})
    .populate('product')
    .populate('warehouse')
    .exec(function(err, result){
      if(!err){
        cb(result);
      }else{
        cb(null);
      }
    });
  },

  getAllInStock :function(cb){
    model.Instock.find({},function(err, result){
      if(!err){
        cb(result);
      }else{
        console.log(err);
        cb(null);
      }
    });
  },
  
  updateInStockInvoice : function(id,itemInfo,cb){
    model.Instock.findOneAndUpdate({$and:[{status:1},{_id:itemInfo}]},{invoice:id,status:2} , function(err,result) {
      if (!err) {
        cb(true)
      } else {
        console.log(err);
        cb(false);
      }
    });
  },
  searchInStockInvoice :function(id,cb){
    model.Instock.findOne({$and: [ {status:1},{product:id}]}, function(err,result) {
      if (!err) {
        cb(result)
      } else {
        console.log(err);
        cb(false);
      }
    });
  },
  addInStock: function (body, cb) {
    var obj = body;
    // if(body.type==4){
    //   obj.macAddress=null;
    //   obj.username=null;
    //   obj.password=null;
    // }
    inStock = new model.Instock(obj);
    inStock.save(function(err,result){
      if (!err) {
        cb(true);

      } else {
        //TODO: return page with errors
        console.log(err);
        cb(false);
      }
    });
  },
  updateInStock: function(id,body,cb) {
    var obj = body;
    model.Instock.findOneAndUpdate({_id:id}, obj, function(err,result) {
      if (!err) {
        cb(true)
      } else {
        console.log(err);
        cb(false);
      }
    });
  },
  deleteInStock : function(id,cb){
    model.Instock.remove({_id:id}, function(err,result) {
      if (!err) {
        cb(2)
      } else {
        console.log(err);
        cb(3);
      }
    });
  },
getByWP :function(idW,idP,cb){
  model.Instock.findOne({$and: [ {status:1},{product:idP},{warehouse:idW}]}, function(err,result) {
    if (!err) {
      cb(result)
    } else {
      console.log(err);
      cb(false);
    }
  });
},
};