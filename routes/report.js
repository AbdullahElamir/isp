var express = require('express');
var router = express.Router();
var userHelpers = require('../controller/userHelpers');
var invoiceMgr = require("../controller/invoice");
var reportMgr = require("../controller/report");



router.get('/active',function(req , res){
  console.log("fff");
  reportMgr.getActive(function(results){
    //console.log(results);
    reportMgr.getInvoices(results,function(result){
      console.log(result);
      pars(result,function(obj){
        console.log(obj);
        res.send(obj);
      });
    });
  });
});


router.get('/printInvoice/:id', function(req, res) {
  invoiceMgr.getInvoicedata(req.params.id,function(result){
    var months;
    var now = new Date();
    var nowdate =now.getDate()+' / '+parseInt(now.getMonth()+1)+' / '+now.getFullYear();
    if(result.invoices.typein!=4){
      months = (result.order[0].endDate.getFullYear() - result.order[0].startDate.getFullYear()) * 12;
      months += result.order[0].endDate.getMonth()-result.order[0].startDate.getMonth() + 1;
      result['months']=months;
      var startDate =result.order[0].startDate.getDate()+' / '+parseInt(result.order[0].startDate.getMonth()+1)+' / '+result.order[0].startDate.getFullYear();
      var endDate =result.order[0].endDate.getDate()+' / '+parseInt(result.order[0].endDate.getMonth()+1)+' / '+result.order[0].endDate.getFullYear();
      var startDate ='';
      var endDate='';
      if(parseInt(result.order[0].startDate.getDate())<9){
        startDate+='0'+result.order[0].startDate.getDate();
      }else{
        startDate+=result.order[0].startDate.getDate();
      }

      if(parseInt(result.order[0].startDate.getMonth()+1)<9){
        startDate+=' / 0'+parseInt(result.order[0].startDate.getMonth()+1);
      }else{
        startDate+=' / '+parseInt(result.order[0].startDate.getMonth()+1);
      }
      if(parseInt(result.order[0].endDate.getDate())<9){
        endDate+='0'+result.order[0].endDate.getDate();
      }else{
        endDate+=result.order[0].endDate.getDate();
      }

      if(parseInt(result.order[0].endDate.getMonth()+1)<9){
        endDate+=' / 0'+parseInt(result.order[0].endDate.getMonth()+1);
      }else{
        endDate+=' / '+parseInt(result.order[0].endDate.getMonth()+1);
      }
      startDate +=' / '+result.order[0].startDate.getFullYear();
      endDate +=' / '+result.order[0].endDate.getFullYear();
      result['nowdate']=nowdate;
      result['startDate']=startDate;
      result['endDate']=endDate; 
    }
    userHelpers.printReport("invoice.html",result,res);

  });
  
});


router.get('/printActive',function(req , res){
  
  reportMgr.getActive(function(results){

    reportMgr.getInvoices(results,function(result){
      pars(result,function(obj){
        obj.active = "المفعلة";
        userHelpers.printReport("active.html",obj,res);
      });
    });
  });
});


router.get('/printunActive',function(req , res){
  reportMgr.getunActive(function(results){
    reportMgr.getInvoices(results,function(result){
      /*
        result المستخدمين الجدد فاتورة جديدة
        invoise  تجديد الاشتراك
        order اسم الخدمة
      */
      pars(result,function(obj){
        obj.active = "الغير المفعلة";
        userHelpers.printReport("active.html",obj,res);
      });
      
    });
  });
});
router.get('/unactive',function(req , res){
  reportMgr.getunActive(function(results){
    reportMgr.getInvoices(results,function(result){
      pars(result,function(obj){
        res.send(obj);
      });
    });
  });
});

router.get('/money/:id',function(req , res){
  reportMgr.getTotalMoney(req.params.id,function(result){
    parsPiad(result,function(money){
      console.log(money);
    });
  });
});
router.post('/Between',function(req , res){
  reportMgr.getBetween(req.body.start,req.body.end,function(results){
    reportMgr.getInvoices(results,function(result){
      pars(result,function(obj){
        res.send(obj);
      });
    });
  });
});
router.post('/printBetween',function(req , res){
  console.log(req.body);
  reportMgr.getBetween(req.body.start,req.body.end,function(results){
    reportMgr.getInvoices(results,function(result){
      pars(result,function(obj){
        userHelpers.printReport("active.html",obj,res);
      });
    });
  });
});

router.post('/Reseller',function(req , res){
  reportMgr.getReseller(req.body.reseller,function(results){
    reportMgr.getInvoices(results,function(result){
      pars(result,function(obj){
        res.send(obj);
      });
    });
  });
});

router.post('/printReseller',function(req , res){
  reportMgr.getReseller(req.body.reseller,function(results){
    reportMgr.getInvoices(results,function(result){
      pars(result,function(obj){
        userHelpers.printReport("active.html",obj,res);
      });
    });
  });
});

function pars(result,cb){
  var flag1=0;
  var flag2=0;
  var orderArray=[];
  var obj=[];
  if(result.invoice.length==0){
    flag2=1;
  }
  if(result.result.length==0){
    flag1=1;
  }
  for(i in result.order){
    orderArray[result.order[i].invoice] = {name:result.order[i].product.name,end:result.order[i].endDate};
  }

  for (i in result.result){
    var name = '';
    var macAddress = '';
    var product = '';
    var phone = '';
    var end = '';
    if(result.result[i].customer){
      name=result.result[i].customer.name;
    }

    if(result.result[i].instock!=undefined){
      macAddress=result.result[i].instock.macAddress;
    }
    if(orderArray[result.result[i]._id]){
      product=orderArray[result.result[i]._id].name;
    }
    if(result.result[i].customer){
      phone=result.result[i].customer.phone;
    }
    if(orderArray[result.result[i]._id]){
      end=orderArray[result.result[i]._id].end;
    }
    obj.push({name:name,macAddress:macAddress,product:product,phone:phone,end:end})
    if(i == result.result.length-1){
      flag1=1;
    } 
  }
  for (i in result.invoice) {
    var name = '';
    var macAddress = '';
    var product = '';
    var phone = '';
    var end = '';
    if(result.invoice[i].customer){
      name=result.invoice[i].customer.name;
    }
    if(result.invoice[i].instock){
      macAddress=result.result[i].instock.macAddress;
    }
    if(orderArray[result.invoice[i]._id]){
      product=orderArray[result.invoice[i]._id].name;
    }
    if(result.invoice[i].customer){
      phone=result.invoice[i].customer.phone;
    }
    if(orderArray[result.invoice[i]._id]){
      end=orderArray[result.invoice[i]._id].end;
    }
    obj.push({name:name,macAddress:macAddress,product:product,phone:phone,end:end})
    if(i == result.invoice.length-1){
      flag2=1;
    } 
  }

  if(flag1&&flag2){
    cb(obj);
  }
}

function parsPiad(result,cb){
  var flag=0;
  var sum=0;
  var piad=0;
  if(result.length==0){
    flag=1;
  }


  for (i in result){
    if(result[i].typein==4){
      piad+=result[i].piad;
    }else{
      sum+=result[i].piad; 
    }
    if(i==result.length-1){
      flag=1;
    }
  }
  
  if(flag){
    cb({sum:sum,piad:piad});
  }
}
module.exports = router;