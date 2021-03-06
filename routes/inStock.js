var express = require('express');
var router = express.Router();
var instockMgr = require("../controller/inStock");
var userHelpers = require("../controller/userHelpers");
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();


/* GET all in stock */
router.get('/search/:id', userHelpers.isLogin ,function(req, res) {
  instockMgr.searchInStockInvoice(req.params.id,function(InStock){
    res.send(InStock);
  });
});

router.get('/hasMacAdress', userHelpers.isLogin, function (req, res, next){
  instockMgr.hasMacAdress(req.query.value,function (result){
    
    if(result!=0){
      console.log(true);
      //send true if we find a match
      res.send({isValid: false});
    } else {
      //send false if we didn't find a match
      console.log(false);
      res.send({isValid: true});
    }
  });
});



//getUserPassByWare
router.get('/getUserPassByWare/:id', userHelpers.isLogin ,function(req, res) {
  instockMgr.getUserPassByWare(req.params.id,function(InStock){
    console.log(InStock);
    res.send(InStock);
  });
});
//getByWP 
router.get('/getByWP/:idStock/:idItem', userHelpers.isLogin ,function(req, res) {
  instockMgr.getByWP(req.params.idStock,req.params.idItem,function(result){
    res.send(result);
  });
});
router.get('/getByWare/:idStock/:limit/:page', userHelpers.isLogin ,function(req, res) {
  // console.log(req.params.idStock+' '+req.params.limit+' '+req.params.page);
  instockMgr.getByWare(req.params.idStock,req.params.limit,req.params.page,function(result){
    res.send(result);
  });
});
router.post('/transfer', userHelpers.isLogin ,function(req, res) {
  instockMgr.transfer(req.body,function(result){
    res.send(result);
  });
});
router.get('/searchMac/:id', userHelpers.isLogin ,function(req, res) {
  instockMgr.getByMac(req.params.id,function(InStock){
    res.send(InStock);
  });
});

router.get('/take/:limit/:page',userHelpers.isLogin , function(req, res) {
  instockMgr.getInStockTake(req.params.limit,req.params.page,function(InStock){
    res.send(InStock);
    
  });
});
router.get('/:limit/:page', userHelpers.isLogin ,function(req, res) {
  instockMgr.getInStock(req.params.limit,req.params.page,function(InStock){
    res.send(InStock);
  });
});

router.get('/searchinstock/:warehouse/:product/:value/:limit/:page', userHelpers.isLogin ,function(req, res) {
  instockMgr.getInStockSearch(req.params.warehouse,req.params.product,req.params.value,req.params.limit,req.params.page,function(InStock){
    res.send(InStock);
  });
});
router.get('/Reseler/:limit/:page', userHelpers.isLogin ,function(req, res) {
  instockMgr.getInStockReseler(req.user.warehouse,req.params.limit,req.params.page,function(InStock){
    res.send(InStock);
  });
});



router.get('/all',userHelpers.isLogin , function(req, res) {
  instockMgr.getAllInStock(function(InStock){
    res.send(InStock);
  });
});


router.get('/allTake',userHelpers.isLogin , function(req, res) {
  instockMgr.getAllInStockTake(function(InStock){
    res.send(InStock);
  });
});
/* Add new in stock  */
router.post('/add', userHelpers.isLogin ,multipartyMiddleware,function(req, res) {
  if(req.body.csv==null){
    instockMgr.addInStock(req.body,function(InStock){
      res.send(InStock);
    });
  }else{
    req.body.csv.forEach(function(i,j) {
      var tbody = i[0].split(",");
      var idmac = tbody[0];
      var macAddress = tbody[1];
      var username = tbody[2];
      var password = tbody[2];
      var obj ={
        warehouse:req.body.warehouse,
        product:req.body.product,
        description: req.body.description,
        macAddress:macAddress,
        username:username,
        password:password,
        idmac:idmac
      }
      instockMgr.addInStock(obj,function(InStock){
        if(j==req.body.csv.length-2){
          res.send(InStock);  
        }
        
      });
    });
    
  }

});

/* Edit in stock by id  */
router.put('/edit/:id', userHelpers.isLogin ,function(req, res) {
  instockMgr.updateInStock(req.params.id,req.body,function(InStock){
    res.send(InStock);
  });
});

/* Delete in stock by id  */
router.delete('/delete/:id', function(req, res) {
  instockMgr.deleteInStock(req.params.id,function(InStock){
    res.send({result:InStock});
  });
});

/* GET in stock by ID  */
router.get('/:id', function(req, res) {
  instockMgr.getInStockId(req.params.id,function(InStock){
    res.send(InStock);
  });
});



module.exports = router;
