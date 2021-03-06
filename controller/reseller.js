var model = require("../models"),
    generatePassword = require('password-generator'),
    easyPbkdf2 = require("easy-pbkdf2")(),
    reseller = null;
var reseller = require('../models/reseller').Reseller;
var dollarMgr = require("./dollar");
var productPolicyMgr = require("./productPolicy");


module.exports = {

  getResellerByuser :function(username,cb){
    model.Reseller.findOne({email : username}, function(err, result){
      if(!err){
        cb(result);
      }else{
        cb(null);
      }
    });
  },
  getAllReseller :function(cb){
    model.Reseller.find({},function(err, result){
      if(!err){
        cb(result);
      }else{
        console.log(err);
        cb(null);
      }
    });
  },

  getAllResellerCount :function(cb){
    model.Reseller.count({},function(err, result){
      if(!err){
        cb({count:result});
      }else{
        console.log(err);
        cb(null);
      }
    });
  },
  getReseller :function(limit,page,cb){
    page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    model.Reseller.count({},function(err,count){
      model.Reseller.find({}).limit(limit).skip(page*limit).exec(function(err, result){
        if(!err){
          cb({result:result,count:count});
        }else{
          console.log(err);
          cb(null);
        }
      });
    });
  },

  //getResellerByName
  getResellerByName :function(searchString,limit,page,cb){
    page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    model.Reseller.count({'$or':[
            {'repName':{'$regex':searchString, '$options':'i'}},
            {'email':{'$regex':searchString, '$options':'i'}},
            {'companyName':{'$regex':searchString, '$options':'i'}},
            {'phone':{'$regex':searchString, '$options':'i'}}
            ]},function(err,count){
      model.Reseller.find({'$or':[
            {'repName':{'$regex':searchString, '$options':'i'}},
            {'email':{'$regex':searchString, '$options':'i'}},
            {'companyName':{'$regex':searchString, '$options':'i'}},
            {'phone':{'$regex':searchString, '$options':'i'}}
            ]}).limit(limit).skip(page*limit).exec(function(err, result){
        if(!err){
          cb({result:result,count:count});
        }else{
          console.log(err);
          cb(null);
        }
      });
    });
  },

  getResellerId :function(id,cb){
    model.Reseller.findOne({_id : id}, function(err, result){
      if(!err){
        cb(result);
      }else{
        cb(null);
      }
    });
  },
  /* here we add a new user to the system */
  addReseller: function (body, cb) {
    var obj = body;
    var salt = easyPbkdf2.generateSalt(); //we generate a new salt for every new user
    easyPbkdf2.secureHash( body.password, salt, function( err, passwordHash, originalSalt ) {
      obj.password = passwordHash;
      obj.salt = originalSalt;
      reseller = new reseller(obj);
      reseller.save(function(err,result){
        if (!err) {
          delete result.password;
          delete result.salt;
          cb(result);
        } else {
          console.log(err);
          //TODO: return page with errors
          cb(false);
        }
      });
    });
  },

  updateReseller: function(id,body,cb) {
    var salt = easyPbkdf2.generateSalt(); //we generate a new salt for every new user
    easyPbkdf2.secureHash( body.passwordd, salt, function( err, passwordHash, originalSalt ) {
    body.password=passwordHash;
    body.salt =originalSalt;
    delete body.passwordd;
    delete body.confirmPassword;
    model.Reseller.findOneAndUpdate({_id:id}, body, function(err,result) {
      if (!err) {
        cb(true)
      } else {
        console.log(err);
        cb(false);
      }
    });
    });
  },

  deleteReseller : function(id,cb){
    model.Customer.find({reseller:id}, function(err,resul) {
      if(resul.length > 0){
        cb(1)
      } else{
        model.Reseller.remove({_id:id}, function(err,result) {
          if (!err) {
            cb(2)
          } else {
            console.log(err);
            cb(3);
          }
        });
      }
    });
  },
  addInvoice : function(body,idu,policy,cb){
    model.Product.find({ $or: [ { _id:body.product}, {_id:body.productItem} ,{_id:body.productPackage} ]
      },function(err,product){
        body.reseller=idu;
        body.status=2;
        if(body.previousSubscription==1){

          customer = new model.Customer(body);
          customer.save(function(err,customerResult){
            if (!err) {
              invoice={
                customer:customerResult._id,
                type:body.type,
                notes:body.invoceNotes,
                month:body.month,
                day:body.day,
                piad:body.total-body.discount,
                reseller:body.reseller,
                discount:body.discount,
                typein:body.typein,
                startDate:body.startDate,
                endDate:body.endDate,
                status:2
              };
              if(body.typein!=2){
                invoice.instock=body.inStockdata._id;
              }
              invoice=new model.Invoice(invoice);
              invoice.save(function(err,invoiceResult){
                if (!err) {
                  if(body.paid!=0){
                    var Paid={
                      customer:customerResult._id,
                      invoice:invoiceResult._id,
                      type:1,
                      notes:body.paidNotes,
                      piad:body.paid,
                      reseller:body.reseller,
                      discount:0,
                      status:2,
                      typein:4
                    };
                    invoice=new model.Invoice(Paid);
                    invoice.save();}
                  var arrayOrd=[];
                  for( i in body.selectedProducts ){
                    model.Product.findOne({_id:body.selectedProducts[i].id},function(err,pro){
                      productPolicyMgr.getProductPPolicy(policy,function(result){
                        dollarMgr.getLastDollar(function(dollar){
                          Order={
                            invoice:invoiceResult._id,
                            product:pro._id,
                            price:pro.initialPrice,
                            startDate:body.startDate,
                            endDate:body.endDate
                          };
                          if(result[pro._id]){
                            Order.price=result[pro._id];
                          }
                          if(pro.type=='package'){
                            
                            if(result[pro._id]){
                              var priceP=result[pro._id];
                            }else{
                              var priceP=pro.initialPrice;
                            }
                            
                           
                            var months;
                            
                            var end = new Date(body.endDate);
                            var start = new Date(body.startDate);
                            months =(end.getFullYear() -start.getFullYear() )* 12;
                            months += end.getMonth()-start.getMonth() + 1;
                            var money=parseFloat(body.total)-parseFloat(priceP)*parseFloat(dollar[0].price);
                            money=money+parseFloat(priceP)*parseFloat(dollar[0].price)*parseFloat(body.month)+(priceP/31*body.day);
                            money-=parseFloat(body.discount);
                            Order.price=priceP*dollar[0].price;
                            model.Invoice.findOneAndUpdate({_id:invoiceResult._id}, {piad:money},function(err,re){
                            });
                          }
                          
                          order=new model.Order(Order);
                          order.save(function(err,orderResult){
                            arrayOrd.push(orderResult);
                            arrayOfResult=[customerResult,invoiceResult,arrayOrd];
                            if(!err){
                              
                              if(i==body.selectedProducts.length-1){
                                if(body.typein!=2){
                                  model.Instock.findOneAndUpdate({$and:[{status:1},{_id:body.inStockdata._id}]},{invoice:invoiceResult._id,status:2} , function(err,result) {
                                    if (!err) {

                                      cb(arrayOfResult,false);
                                    } else {
                                      console.log(err);
                                      cb(false);
                                    }
                                  });
                                }else{
                                  cb(arrayOfResult,false);
                                }
                                
                                
                              }
                            } else {
                              console.log(err);
                              cb(null,err)
                            }
                          });
                        });
                      });
                    });
                        
   
                  }
                } else {
                  console.log(err);
                  cb(null,err);
                }
              });
            } else {
              console.log(err);
              cb(null,err);
            }
          });
        }else{

          invoice={
            customer:body.customId,
            type:1,
            notes:body.invoceNotes,
            piad:body.total-body.discount,
            reseller:body.reseller,
            month:body.month,
            day:body.day,
            discount:body.discount,
            typein:body.typein,
            startDate:body.startDate,
            endDate:body.endDate,
            status:2
          };
          if(body.typein!=2){
            invoice.instock=body.inStockdata._id;
          }
          invoice=new model.Invoice(invoice);
          invoice.save(function(err,invoiceResult){
            if (!err) {
              if(body.paid!=0){
                var Paid={
                  customer:body.customId,
                  invoice:invoiceResult._id,
                  type:1,
                  notes:body.paidNotes,
                  piad:body.paid,
                  reseller:body.reseller,
                  discount:0,
                  status:2,
                  typein:4
                };
                invoice=new model.Invoice(Paid);
                invoice.save();
                }
              var arrayOrd=[];
              for( i in body.selectedProducts ){
                model.Product.findOne({_id:body.selectedProducts[i].id},function(err,pro){
                  productPolicyMgr.getProductPPolicy(policy,function(result){
                    dollarMgr.getLastDollar(function(dollar){
                      Order={
                        invoice:invoiceResult._id,
                        product:pro._id,
                        price:pro.initialPrice,
                        startDate:body.startDate,
                        endDate:body.endDate
                      };
                      if(result[pro._id]){
                        Order.price=result[pro._id];
                      }
                      if(pro.type=='package'){
                        if(result[pro._id]){
                          var priceP=result[pro._id];
                        }else{
                          var priceP=pro.initialPrice;
                        }
                        var months;
                        
                        var end = new Date(body.endDate);
                        var start = new Date(body.startDate);
                        months =(end.getFullYear() -start.getFullYear() )* 12;
                        months += end.getMonth()-start.getMonth() + 1;
                        var money=parseFloat(body.total)-parseFloat(priceP)*parseFloat(dollar[0].price);
                        money=money+parseFloat(priceP)*parseFloat(dollar[0].price)*parseFloat(body.month)+(priceP/31*body.day);
                        money-=parseFloat(body.discount);
                        Order.price=priceP*dollar[0].price;
                        model.Invoice.findOneAndUpdate({_id:invoiceResult._id}, {piad:money},function(err,re){
                        });
                      }
                      

                      order=new model.Order(Order);
                      order.save(function(err,orderResult){
                        arrayOrd.push(orderResult);
                        arrayOfResult=[null,invoiceResult,arrayOrd];
                        if(!err){
                          if(i==body.selectedProducts.length-1){
                            if(body.typein!=2){
                              model.Instock.findOneAndUpdate({$and:[{status:1},{_id:body.inStockdata._id}]},{invoice:invoiceResult._id,status:2} , function(err,result) {
                                if (!err) {
                                  cb(arrayOfResult,false);
                                } else {
                                  console.log(err);
                                  cb(false);
                                }
                              });
                            }else{
                              cb(arrayOfResult,false);
                            }
                            
                            
                          }
                        } else {
                          cb(null,err)
                        }
                      });
                    });
                  });
                });
                  

              }
            } else {
              console.log(err);
              cb(null,err);
            }
          });
        }



      });
  },

  renewInvice :function(body,idu,policy,cb){
  model.Invoice.findOne({_id:body.idCu},function(err, invoices){
    if (!err) {
      var invoice={
        customer:invoices.customer,
        type:1,
        invoice:body.idCu,
        notes:body.invoceNotes,
        piad:body.total,
        reseller:idu,
        month:body.month,
        day:body.day,
        discount:body.discount,
        status:2,
        startDate:body.startDate,
        endDate:body.endDate,
        typein:3
      };
      invoice=new model.Invoice(invoice);
      invoice.save(function(err,invoiceResult){
        if (!err) {
          model.Product.findOne({_id:body.package},function(err,pro){
            productPolicyMgr.getProductPPolicy(policy,function(result){
              dollarMgr.getLastDollar(function(dollar){
                Order={
                  invoice:invoiceResult._id,
                  product:pro._id,
                  startDate:body.startDate,
                  endDate:body.endDate
                };
                if(result[pro._id]){
                  var priceP=result[pro._id];
                }else{
                  var priceP=pro.initialPrice;
                }
                Order.price=priceP*dollar[0].price*parseFloat(body.month)+(priceP/30*parseFloat(body.day));
                order=new model.Order(Order);
                order.save(function(err,orderResult){
                  if (!err) {
                    cb(invoiceResult);
                  }else{
                    console.log(err);
                    cb(null);
                  }
                });
              });
            });
          });

        }else{
          console.log(err);
          cb(null);
        }
      });
    }else{
      console.log(err);
      cb(null);
    }
  });
},

addPaid :function(body,idu,cb){
  model.Invoice.findOne({_id:body.idCu},function(err, invoices){
    if (!err) {
      var invoice={
        customer:invoices.customer,
        invoice:body.idCu,
        type:1,
        notes:'null',
        piad:body.paid,
        reseller:idu,
        discount:0,
        status:2,
        typein:4,
        notes: body.notes
      };
      invoice=new model.Invoice(invoice);
      invoice.save(function(err,invoiceResult){
        if (!err) {
          cb(invoiceResult);
          
        }else{
          console.log(err);
          cb(null);
        }
      });
    }else{
      console.log(err);
      cb(null);
    }
  });
},
replacInvice:function(body,cb){
  model.Invoice.findOne({_id:body.idin},function(err, invoices){
    if (!err) {
      var invoice={
        customer:invoices.customer,
        invoice:body.idin,
        type:1,
        piad:body.price,
        reseller:null,
        discount:0,
        typein:6,
        status:2,
        notes: body.notes
      };
      invoice=new model.Invoice(invoice);
      invoice.save(function(err,invoiceResult){
        if (!err) {
          model.Product.findOne({_id:body.product},function(err,pro){
            Order={
              invoice:invoiceResult._id,
              product:pro._id,
              price:body.price,
              startDate:new Date(),
              endDate:new Date()
            };
            order=new model.Order(Order);
            order.save(function(err,orderResult){
              if(!err){
                model.Instock.findOne({invoice:body.idin,status:2},function(err,instockOld){
                  if(!err){
                    model.Instock.findOneAndUpdate({$and:[{status:1},{_id:body.mac}]},{invoice:body.idin,status:2,username:instockOld.username,password:instockOld.password} , function(err,result) {
                      if (!err) {
                        model.Instock.findOneAndUpdate({_id:instockOld._id},{status:5} , function(err,result) {
                          if(!err){
                            cb(invoiceResult);
                          }else{
                            console.log(err);
                            cb(false);
                          }
                        });
                      } else {
                        console.log(err);
                        cb(false);
                      }
                    }); 
                  } else {
                    console.log(err);
                    cb(false);
                  }
                  
                });
                
              } else {
                console.log(err);
                cb(null,err)
              }
            });
          });
        }else{
          console.log(err);
          cb(null);
        }
      });
    }else{
      console.log(err);
      cb(null);
    }
  });
},
addGiga:function(id,body,cb){
  model.Invoice.findOne({_id:body.idin},function(err, invoices){
    if (!err) {
      var invoice={
        customer:invoices.customer,
        invoice:body.idin,
        type:1,
        piad:body.price,
        reseller:id,
        discount:0,
        typein:5,
        status:2,
        notes: body.notes
      };
      invoice=new model.Invoice(invoice);
      invoice.save(function(err,invoiceResult){
        if (!err) {
          cb(invoiceResult);
          
        }else{
          console.log(err);
          cb(null);
        }
      });
    }else{
      console.log(err);
      cb(null);
    }
  });
},
};