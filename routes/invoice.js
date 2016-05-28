var express = require('express');
var router = express.Router();
var invoiceMgr = require("../controller/invoice");



/* GET all invoice */
router.get('/:limit/:page', function(req, res) {
  invoiceMgr.getInvoice(req.params.limit,req.params.page,function(invoices){
    res.send(invoices);
	});
 });

router.get('/:id', function(req, res) {

  invoiceMgr.getInvoicesById(req.params.id,function(invoices){

    res.send(invoices);
  });
});

router.get('/all', function(req, res) {
  invoiceMgr.getAllInvoices(function(result){
    res.send(result);
  });
});
/* Add new invoice   */
router.post('/add', function(req, res) {
  // console.log(req.body);
  invoiceMgr.addInvoice(req.body,function(result){
    res.send(result);
  });
});

/* Edit invoice  by id  */
router.put('/edit/:id', function(req, res) {
  invoiceMgr.updateInvoice(req.params.id,req.body,function(result){
    res.send(result);
  });
});

/* Delete invoice  by id  */
router.delete('/delete/:id', function(req, res) {
  invoiceMgr.deleteInvoice(req.params.id,function(result){
    res.send({result:result});  
  });
});

module.exports = router;

