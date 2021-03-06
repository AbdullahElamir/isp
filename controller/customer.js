var generatePassword = require('password-generator'),
  easyPbkdf2 = require("easy-pbkdf2")();
var model = require("../models");
var customer = null;

module.exports = {

  getCustomerSearch :function(searchString,limit,page,cb){
    if(searchString==-9){
       page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    model.Customer.count({status:1},function(err,count){
      model.Customer.find({status:1}).limit(limit).skip(page*limit)
      .populate('user')
      .populate('reseller')
      .exec(function(err, customers){
        if(!err){
          cb({result:customers,count:count});
        }else{
          console.log(err);
          cb(null);
        }
      });
    });

    } else {
    page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    model.Customer.count({'$or':[
            {'name':{'$regex':searchString, '$options':'i'}},
            {'email':{'$regex':searchString, '$options':'i'}},
            {'phone':{'$regex':searchString, '$options':'i'}}
            ],status:1},function(err,count){
      model.Customer.find({'$or':[
            {'name':{'$regex':searchString, '$options':'i'}},
            {'email':{'$regex':searchString, '$options':'i'}},
            {'phone':{'$regex':searchString, '$options':'i'}}
            ] ,status:1}).limit(limit).skip(page*limit)
      .populate('user')
      .populate('reseller')
      .exec(function(err, customers){
        if(!err){
          cb({result:customers,count:count});
        }else{
          console.log(err);
          cb(null);
        }
      });
    });
  }

  },

  getCustomerSearchAll:function(all,limit,page,cb){
      console.log("ss");
      page = parseInt(page);
      page-=1;
      limit = parseInt(limit);
      model.Customer.count({'$or':[
          {"name" : { '$regex' : all, $options: '-i' }},
          {"repName" : { '$regex' : all, $options: '-i' }},
          {"phone" : { '$regex' : all, $options: '-i' }},
          {"city" : { '$regex' : all, $options: '-i' }},
          ]},function(err,count){
        model.Customer.find({'$or':[
          {"name" : { '$regex' : all, $options: '-i' }},
          {"repName" : { '$regex' : all, $options: '-i' }},
          {"phone" : { '$regex' : all, $options: '-i' }},
          {"city" : { '$regex' : all, $options: '-i' }},
          {"name" : { '$regex' : all, $options: '-i' }}]
          }).limit(limit).skip(page*limit)
        .populate('user')
        .exec(function(err, customers){
          console.log(customers);
          if(!err){
            console.log(customers);
            cb({result:customers,count:count});
          }else{
            console.log(err);
            cb(null);
          }
        });
      });
    },


/*  getCustomerSearchAll:function(all,cb){

      model.Customer.find({"name" : { '$regex' : name, $options: '-i' }})
      .exec(function(err, services){
        if(!err){
          cb({result:services,count:count});
        }else{
          console.log(err);
          cb(null);
        }
      });
    },
    */
  getCustomer :function(status,limit,page,cb){
    if(status==-1){
    page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    model.Customer.count({},function(err,count){
      model.Customer.find({}).limit(limit).skip(page*limit)
      .populate('user')
      .populate('reseller')
      .exec(function(err, customers){
        if(!err){
          //console.log(customers);
          cb({result:customers,count:count});
        }else{
          console.log(err);
          cb(null);
        }
      });
    });

    } else {
      page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    model.Customer.count({status:status},function(err,count){
      model.Customer.find({status:status}).limit(limit).skip(page*limit)
      .populate('user')
      .populate('reseller')
      .exec(function(err, customers){
        if(!err){
          //console.log(customers);
          cb({result:customers,count:count});
        }else{
          console.log(err);
          cb(null);
        }
      });
    });

    }
    
  },

  getCustomerReseller :function(id,idP,name,limit,page,cb){
    page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    var con={};
    if (idP!=-1){
      con={
        product:idP
      }
    }
    model.Order.find(con).distinct('invoice',function(err, idin){
      model.Invoice.find({_id:{$in:idin}}).distinct('customer',function(err, idC){
        var options={
          _id:{$in:idC},
          status:{$ne:3}
        }
        options={
            _id:{$in:idC},
            status:{$ne:3}
          }
        if(id!=-1){
          options.reseller=id;
        }
        if(parseInt(name)!=-1){
          options.name= { $regex: name, $options: '-i' };
        }
        model.Customer.count(options,function(err,count){
          model.Customer.find(options).skip(page*limit)
          .populate('user')
          .populate('reseller')
          .exec(function(err, customers){
            if(!err){
              //console.log(customers);
              cb({result:customers,count:count});
            }else{
              console.log(err);
              cb(null);
            }
          });
        });
      });
    });

    
  },
  getCustomerResMAc :function(id,idP,name,mac,idS,limit,page,cb){
    page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    var con={};
    if (idP!=-1){
      con={
        product:idP
      }
    }
    if (idS!=-1){
      con['packages.service']=idS;
    }
    if(parseInt(mac)==-1){
      var macOp={_id:null}
    }else{
      var macOp={macAddress:{$regex:mac, $options:'i'},status:2}
    }
    model.Instock.find(macOp).distinct('invoice', function(err,macs) {
      if(macs.length>0){
        con.invoice={
          $in:macs
        }
      }  
      model.Order.find(con).distinct('invoice',function(err, idin){
        model.Invoice.find({_id:{$in:idin}}).distinct('customer',function(err, idC){
          var options={
            _id:{$in:idC},
            status:{$ne:3}
          }
          options={
              _id:{$in:idC},
              status:{$ne:3}
            }
          if(id!=-1){
            options.reseller=id;
          }
          if(parseInt(name)!=-1){
            options.name= { $regex: name, $options: '-i' };
          }
          model.Customer.count(options,function(err,count){
            model.Customer.find(options).skip(page*limit)
            .populate('user')
            .populate('reseller')
            .exec(function(err, customers){
              if(!err){
                //console.log(customers);
                cb({result:customers,count:count});
              }else{
                console.log(err);
                cb(null);
              }
            });
          });
        });
      });
    });

    
  },
  getCustomerReject :function(user,status,limit,page,cb){
    page = parseInt(page);
    page-=1;
    limit = parseInt(limit);
    model.Customer.count({status:status,reseller:user},function(err,count){
      model.Customer.find({status:status,reseller:user}).limit(limit).skip(page*limit)
      .populate('user')
      .populate('reseller')
      .exec(function(err, customers){
        if(!err){
          //console.log(customers);
          cb({result:customers,count:count});
        }else{
          console.log(err);
          cb(null);
        }
      });
    });
  },

  getAllCustomer :function(cb){
    model.Customer.find({}).populate('user').populate('reseller')
      .exec(function(err, customers){
      if(!err){
        cb(customers);
      }else{
        console.log(err);
        cb(null);
      }
    });
  },

  //getAllCustomerCount
    getAllCustomerCount :function(cb){
    model.Customer.count({},function(err, customers){
      if(!err){
        cb({count:customers});
      }else{
        console.log(err);
        cb(null);
      }
    });
  },

    //getAllCustomerCount
  getAllCustomerCountReseller :function(id,cb){
    model.Customer.count({reseller:id},function(err, customers){
      if(!err){
        cb({count:customers});
      }else{
        console.log(err);
        cb(null);
      }
    });
  },

  getAllCustomerRes :function(id,cb){
    model.Customer.find({status:{$ne:3},reseller:id},function(err, customers){
      if(!err){
        cb(customers);
      }else{
        console.log(err);
        cb(null);
      }
    });
  },


  getAllCustomerStatus:function(status,cb){
    model.Customer.find({status:status},function(err, customers){
      if(!err){
        cb(customers);
      }else{
        console.log(err);
        cb(null);
      }
    });
  },

  getAllCustomerReseller :function(id,cb){
    model.Customer.find({reseller:id},function(err, customers){
      if(!err){
        cb(customers);
      }else{
        console.log(err);
        cb(null);
      }
    });
  },

  getCustomerId :function(id,cb){
    model.Customer.findOne({_id : id}, function(err, custom){
      if(!err){
        cb(custom);
      }else{
        cb(null);
      }
    });
  },
  
  getCustomerName :function(name,cb){
    model.Customer.find({name :{ $regex:name, $options: 'i' }}).limit(30).exec(function(err, custom){
      if(!err){
        cb(custom);
      }else{
        cb(null);
      }
    });
  },
  addCustomer : function(body,cb){
    var obj ={
      name : body.name,
      repName : body.repName,
      city : body.city,
      address : body.address,
      email : body.email,
      phone : body.phone,
      type : body.type,
      notes : body.notes,
      status : body.status,
      user: body.user,
      reseller : body.reseller
  }

    customer = new model.Customer(obj);
    customer.save(function(err,result){
      if (!err) {
        cb(true);
      } else {
        console.log(err);
        //TODO: return page with errors
        cb(false);
      }
    });
  },

  updateCustomerById : function(customerId,adminId,cb){
    obj={
      status:1,
      user : adminId
    }
     model.Customer.findOneAndUpdate({_id:customerId},obj, function(err,result) {
      if (!err) {
        cb(true);
      } else {
        cb(false);
      }
    });

  },

  updateRejectCustomer : function(customerId,adminId,obj,cb){
    obj={
      status:3,
      user : adminId,
      reject_message : obj.reject_message
    }
     model.Customer.findOneAndUpdate({_id:customerId},obj, function(err,result) {
      if (!err) {
        cb(true);
      } else {
        cb(false);
      }
    });

  },


  updateCustomer : function(id,body,cb){
    var obj ={
      name : body.name,
      repName : body.repName,
      city : body.city,
      address : body.address,
      email : body.email,
      phone : body.phone,
      type : body.type,
      notes : body.notes
  }
    model.Customer.findOneAndUpdate({_id:id}, obj, function(err,result) {
      if (!err) {
        cb(true)
      } else {
        console.log(err);
        cb(false);
      }
    });
  },
  
  deleteCustomer : function(id,cb){
    model.Invoice.find({customer:id}, function(err,resul) {
      if(resul.length > 0){
        cb(1)
      } else{
        model.Customer.remove({_id:id}, function(err,result) {
          console.log(result);
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
  getAllCustomerByReseler :function(id,cb){
    var q={};
    if(parseInt(id)!=-1){
      q.reseller=id;
    }
    model.Customer.find(q).populate('user').populate('reseller').sort({reseller:1})
      .exec(function(err, customers){
      if(!err){
        cb(customers);
      }else{
        console.log(err);
        cb(null);
      }
    });
  },

};