var express = require('express');
var router = express.Router();
var data = require('../data/customer');

/* GET all customer */
router.get('/', function(req, res) {
  Customer.getCustomer(function(customers){
    res.send(customers);
  });
});

/* Add new customer   */
router.post('/add', function(req, res) {
  Customer.addCustomer(req.body,function(customer){
    res.send(customer);
  });
});

/* Edit customer  by id  */
router.put('/edit/:id', function(req, res) {
  // console.log(req.body)
  // console.log(req.params.id);
  Customer.updateCustomer(req.params.id,req.body,function(customer){
    res.send(customer);
  });
});

/* Delete customer  by id  */
router.delete('/delete/:id', function(req, res) {
  console.log(req.params.id);
});

/* GET customer  by ID  */
router.get('/:id', function(req, res) {
  // res.send(data.customer);
  Customer.getCustomerId(req.params.id,function(customer){
    res.send(customer);
  });
});


module.exports = router;