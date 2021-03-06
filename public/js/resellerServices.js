(function(){
  'use strict';
  var app = angular.module('reseller');
    app.factory('MenuFac',function(){
    return {
      'active': -1
    }
  });
  app.factory('ReportServ',function(){
    return {
      'invoiceObj': []
    }
  });
  

  app.service('HelperServ',['$http',function($http){
    var self = {
      'stockObj': [],
      'citiesObj': [],
      'suppliersObj': [],
      'serviceProvidersObj': [],
      'itemsObj': [],
      'servicesObj': [],
      'packagesObj': [],
      'itemsRObj': [],
      'servicesRObj': [],
      'packagesRObj': [],
      'policiesObj': [],
      'etcObj': [],
      'etcRObj': [],
      'resellersObj': [],
      'getAllStock': function(){
        $http.get('/warehouse/all').then(function(response) {
          self.stockObj = response.data.result;
        }, function(response) {
          console.log("Something went wrong in getAllCities");
        });
      },
      'getAllCities': function(){
        $http.get('/cities').then(function(response) {
          self.citiesObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllCities");
        });
      },
      'getAllSuppliers': function(){
        return $http.get('/supplier/all').then(function(response) {
          self.suppliersObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllSuppliers");
        });
      },
      'getServiceProvidersServicesByID': function(id){
        return $http.get('/sProvider/'+id+'/services');
      },
      'getAllServiceProviders': function(){
        return $http.get('/sProvider/').then(function(response) {
          self.serviceProvidersObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllServiceProviders");
        });
      },
      'getAllItems': function(){
        return $http.get('/product/allItem').then(function(response) {
          self.itemsObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllItems");
        });
      },
      'getAllServices': function(){
        return $http.get('/product/allService').then(function(response) {
          self.servicesObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllServices");
        });
      },
      'getAllPackages': function(){
        return $http.get('/product/allPackage').then(function(response) {
          self.packagesObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPackages");
        });
      },
      'getAllEtcs': function(){
        return $http.get('/product/allEtc').then(function(response) {
          self.etcObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPackages");
        });
      },
      'getAllItemsR': function(){
        return $http.get('/product/allItemR').then(function(response) {
          self.itemsRObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllItems");
        });
      },
      'getAllServicesR': function(){
        return $http.get('/product/allServiceR').then(function(response) {
          self.servicesRObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllServices");
        });
      },
      'getAllPackagesR': function(){
        return $http.get('/product/allPackageR').then(function(response) {
          self.packagesRObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPackages");
        });
      },
      'getAllEtcsR': function(){
        return $http.get('/product/allEtcR').then(function(response) {
          self.etcRObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPackages");
        });
      },
      'getAllPolicies': function(){
        return $http.get('/policy/all').then(function(response) {
          self.policiesObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPolicies");
        });
      },
      'getAllResellers': function(){
        return $http.get('/reseller/all').then(function(response) {
          self.resellersObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllResellers");
        });
      }
    };
    self.getAllStock();
    self.getAllCities();
    self.getAllSuppliers();
    self.getAllServiceProviders();
    return self;
  }]);
  app.service('CustomersServ',['$http',function($http){
    var self = {
      'getResellersCount': function(pageSize,currentPage){
        return $http.get('/reseller/getAllResellersCount');
      },
       'getCustomersCount': function(){
        return $http.get('/customer/customerCount');
      },
      'getCustomersCountReseller': function(){
        return $http.get('/customer/customerCountReseller');
      },
      'getAllMoney': function(){
        return $http.get('/report/company');
      },
      'getAllMoneyReseller': function(){
        return $http.get('/report/companyReseller');
      },

      'getCustomers': function(status,pageSize,currentPage){
        return $http.get('/customer/'+pageSize+'/'+currentPage+'/'+status);
      },
       'getCustomersForResseler': function(idP,name,pageSize,currentPage){
        return $http.get('/customer/customerReseller/'+idP+'/'+name+'/'+pageSize+'/'+currentPage);
      },
      'getAllCustomers': function(){
        return $http.get('/customer/all');
      },
      'getResCustomers': function(){
        return $http.get('/customer/res');
      },
      // getCustomersReject
      'getCustomersReject': function(status,pageSize,currentPage){
        return $http.get('/customer/reject/'+pageSize+'/'+currentPage+'/'+status);
      },
      'getCustomerByID': function(id){
        return $http.get('/customer/'+id);
      },
      'addCustomer': function(customerObj){
        return $http.post('/customer/add',customerObj);
      },
      'editCustomer': function(id,customerObj){
        return $http.put('/customer/edit/'+id,customerObj);
      },
      'deleteCustomer': function(id){
        return $http.delete('/customer/delete/'+id);
      }
    };
    return self;
  }]);

 app.service('NoticeServ',['$http',function($http){
    var self = {
      'addNotice': function(notice){
        return $http.post('/notice/add',notice);
      },
      'getAllNotice': function(pageSize,currentPage){
        return $http.get('/notice/'+pageSize+'/'+currentPage)
      },
      'deleteNotice': function(id){
        return $http.delete('/notice/delete/'+id);
      },
      'getNoticeLimit': function(){
        return $http.get('/notice/getNoticeLimit');
      }
    };
    return self;
   }]);


    app.service('ProductsServ',['$http',function($http){
    var self = {
      'getProductServices': function(pageSize,currentPage){
        return $http.get('/product/service/'+pageSize+'/'+currentPage);
      },
      'getProductAll': function(pageSize,currentPage){
        return $http.get('/product/all');
      },
      'getAllService': function(){
        return $http.get('/product/allService');
      },
      'getAllEtc': function(){
        return $http.get('/product/allEtc');
      },
      'getAllItem': function(type){
        return $http.get('/product/allItem');
      },
      'getAllPackage': function(type){
        return $http.get('/product/allPackage');
      },
      'getProductItems': function(pageSize,currentPage){
        return $http.get('/product/item/'+pageSize+'/'+currentPage);
      },
      'getProductPackages': function(pageSize,currentPage){
        return $http.get('/product/package/'+pageSize+'/'+currentPage);
      },
      'getProductByID': function(id){
        return $http.get('/product/'+id);
      },
      'addProduct': function(productObj){
        return $http.post('/product/add',productObj);
      },
      'editProduct': function(id,productObj){
        return $http.put('/product/edit/'+id,productObj);
      },
      'getProductServiceByID':function(id,serviceObj){
        return $http.put('/product/productService/'+id,serviceObj);
      },
      'editProductService':function(id,productObj){
        return $http.put('/product/productService/edit/'+id,productObj);
      },
      'editProductItem':function(id,productObj){
        return $http.put('/product/productItems/edit/'+id,productObj);
      },
      'editProductPackage':function(id,productObj){
        return $http.put('/product/productPackages/edit/'+id,productObj);
      },
      'deleteProductService': function(id){
        return $http.delete('/product/productService/delete/'+id);
      },
      'deleteProduct': function(id){
        return $http.delete('/product/delete/'+id);
      },
      'getProductOtherEquipments': function(pageSize,currentPage){
        return $http.get('/product/otherEquipment/'+pageSize+'/'+currentPage);
      },
      'getProductOtherEquipmentByID': function(id){
        return $http.get('/product/'+id);
      },
      'editProductOtherEquipment':function(id,otherEquipmentObj){
        return $http.put('/product/productEtc/edit/'+id,otherEquipmentObj);
      },
      'deleteProductOtherEquipment': function(id){
        return $http.delete('/product/productOtherEquipment/delete/'+id);
      },
    };
    return self;
  }]);

  
  app.service('PoliciesServ',['$http',function($http){
    var self = {
      'getPolicies': function(pageSize,currentPage){
        return $http.get('/policy/'+pageSize+'/'+currentPage);
      },
      'getPolicyByID': function(id){
        return $http.get('/policy/'+id);
      },
      'addPolicy': function(policyObj){
        return $http.post('/policy/add',policyObj);
      },
      'editPolicy': function(id,policyObj){
        return $http.put('/policy/edit/'+id,policyObj);
      },
      'deletePolicy': function(id){
        return $http.delete('/policy/delete/'+id);
      }
    };
    return self;
  }]);
  app.service('ProductPoliciesServ',['$http',function($http){
    var self = {
      'getProductPolicies': function(pageSize,currentPage,type){
        return $http.post('/policy/productPolicy/'+pageSize+'/'+currentPage,type);
      },
      'getAllProductPolicies': function(){
        return $http.get('/product/allItemPolisy/');
      },
      'getAllProductPoliciesS': function(pageSize,currentPage){
        return $http.get('/product/allItemPolisySer/'+pageSize+'/'+currentPage);
      },
      'getAllProductPoliciesP': function(pageSize,currentPage,service){
        return $http.get('/product/allItemPolisyPac/'+pageSize+'/'+currentPage+'/'+service);
      },
      'getAllProductPoliciesI': function(pageSize,currentPage){
        return $http.get('/product/allItemPolisyIte/'+pageSize+'/'+currentPage);
      },
      'getProductPolicyByID': function(id){
        return $http.post('/policy/productPolicyService/'+id);
      },
      'addProductPolicy': function(productPolicyObj){
        return $http.post('/policy/productPolicy/add',productPolicyObj);
      },
      'editProductPolicy': function(id,productPolicyObj){
        return $http.put('/policy/productPolicy/edit/'+id,productPolicyObj);
      },
      'deleteProductPolicy': function(id){
        return $http.delete('/policy/productPolicy/delete/'+id);
      }
    };
    return self;
  }]);
  app.service('InvoicesServ',['$http','Upload',function($http,Upload){
    var self = {
      'getInvoces': function(pageSize,currentPage){
        return $http.get('/invoice/'+pageSize+'/'+currentPage);
      },
      'getInvoicedata': function(id){
        return $http.get('/invoice/invoicesdata/'+id);
      },
      'getInvoicePending': function(status,pageSize,currentPage){
        return $http.get('/invoice/InvoicePending/'+pageSize+'/'+currentPage+'/'+status);
      },
      'replacInvice': function(replacInviceObj){
        return $http.post('/reseller/replacInviceResseler',replacInviceObj);
      },
      'getInvoicePendingRes': function(status,pageSize,currentPage){
        return $http.get('/invoice/InvoicePendingRes/'+pageSize+'/'+currentPage+'/'+status);
      },
      'getTotal': function(id){
        return $http.get('/report/money/'+id);
      },
      'getInvoiceByID': function(status,id){
        return $http.get('/invoice/invoices/'+id+'/'+status);
      },
      'getInvoiceByIDD': function(id){
        return $http.get('/invoice/invoicesByID/'+id);
      },
      'addInvoice': function(invoiceObj){
        return $http.post('/reseller/addInvoice',invoiceObj);
      },
      'report': function(invoiceObj){
        return $http.post('/report/printInvoice',invoiceObj);
      },
      'active': function(){
        return $http.get('/report/active');
      },
      'editInvoice': function(id,invoiceObj){
        return $http.put('/invoice/edit/'+id,invoiceObj);
      },
      'deleteInvoice': function(id){
        return $http.delete('/invoice/delete/'+id);
      },
      'getItemInfoByID': function(id){
        return $http.get('/inStock/search/'+id);
      },
      'renewInvice': function(renewInviceObj){
        return $http.post('/invoice/renewInvice',renewInviceObj);
      },
      'renewInvicePending': function(renewInviceObj){
        return $http.post('/reseller/renewInvice',renewInviceObj);
      },
      'upgreadInvice': function(renewInviceObj){
        return $http.post('/reseller/upInvice',renewInviceObj);
      },
      'paidInvoice': function(paidInviceObj){
        return Upload.upload({
          url: '/reseller/paidInvoice',
          method: 'POST',
          data: paidInviceObj,
          file: paidInviceObj.image
        });
      }
    };
    return self;
  }]);
  app.service('gigaServ',['$http',function($http){
     var self = {
      'addgiga': function(form){
        return $http.post('/reseller/addgiga',form);
      }
    };
    return self;
  }]);

 app.service('HelperServ',['$http',function($http){
    var self = {
      'stockObj': [],
      'stockObjs': [],
      'citiesObj': [],
      'suppliersObj': [],
      'serviceProvidersObj': [],
      'itemsObj': [],
      'servicesObj': [],
      'packagesObj': [],
      'itemsRObj': [],
      'servicesRObj': [],
      'packagesRObj': [],
      'policiesObj': [],
      'etcObj': [],
      'etcRObj': [],
      'resellersObj': [],
      'getAllStock': function(){
        $http.get('/warehouse/all').then(function(response) {
          self.stockObj = response.data.result;
        }, function(response) {
          console.log("Something went wrong in getAllCities");
        });
      },
      'getAllStockby': function(){
        $http.get('/warehouse/byid').then(function(response) {
          self.stockObjs = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllCities");
        });
      },
      'getAllCities': function(){
        $http.get('/cities').then(function(response) {
          self.citiesObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllCities");
        });
      },
      'getAllSuppliers': function(){
        return $http.get('/supplier/all').then(function(response) {
          self.suppliersObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllSuppliers");
        });
      },
      'getServiceProvidersServicesByID': function(id){
        return $http.get('/sProvider/'+id+'/services');
      },
      'getAllServiceProviders': function(){
        return $http.get('/sProvider/').then(function(response) {
          self.serviceProvidersObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllServiceProviders");
        });
      },
      'getAllItems': function(){
        return $http.get('/product/allItem').then(function(response) {
          self.itemsObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllItems");
        });
      },
      'getAllServices': function(){
        return $http.get('/product/allService').then(function(response) {
          self.servicesObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllServices");
        });
      },
      'getAllPackages': function(){
        return $http.get('/product/allPackage').then(function(response) {
          self.packagesObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPackages");
        });
      },
      'getAllEtcs': function(){
        return $http.get('/product/allEtc').then(function(response) {
          self.etcObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPackages");
        });
      },
      'getAllItemsR': function(){
        return $http.get('/product/allItemR').then(function(response) {
          self.itemsRObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllItems");
        });
      },
      'getAllServicesR': function(){
        return $http.get('/product/allServiceR').then(function(response) {
          self.servicesRObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllServices");
        });
      },
      'getAllPackagesR': function(){
        return $http.get('/product/allPackageR').then(function(response) {
          self.packagesRObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPackages");
        });
      },
      'getAllEtcsR': function(){
        return $http.get('/product/allEtcR').then(function(response) {
          self.etcRObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPackages");
        });
      },
      'getAllPolicies': function(){
        return $http.get('/policy/all').then(function(response) {
          self.policiesObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllPolicies");
        });
      },
      'getAllResellers': function(){
        return $http.get('/reseller/all').then(function(response) {
          self.resellersObj = response.data;
        }, function(response) {
          console.log("Something went wrong in getAllResellers");
        });
      }
    };
    self.getAllStock();
    self.getAllCities();
    self.getAllSuppliers();
    self.getAllServiceProviders();
    return self;
  }]);

  app.service('DollarServ',['$http',function($http){
    var self = {
      'addDollar': function(dollar){
        return $http.post('/dollar/add',dollar);
      },
      'getDollar': function(pageSize,currentPage){
        return $http.get('/dollar/'+pageSize+'/'+currentPage)
      },
      'getLastDollar': function(){
        return $http.get('/dollar/lastDollar')
      },
      'deleteDollar': function(id){
        return $http.delete('/dollar/delete/'+id);
      }
    };
    return self;
   }]);

  app.service('UserServ',['$http',function($http){
    var self = {
      'getUserById': function(id){
        return $http.get('/user/'+id);
      },
      'getUser': function(pageSize,currentPage){
        return $http.get('/user/'+pageSize+'/'+currentPage);
      },
      'addUser': function(UserObj){
        return $http.post('/user/add',UserObj);
      },
      'editUser': function(id,UserObj){
        return $http.put('/user/edit/'+id,UserObj);
      },
      'deleteUser': function(id){
        return $http.delete('/user/delete/'+id);
      }
    };
    return self;
  }]);

  app.service('ResllersServ',['$http',function($http){
    var self = {
      'getResellers': function(pageSize,currentPage){
        return $http.get('/reseller/'+pageSize+'/'+currentPage);
      },

      'getResellersByID': function(id){
        return $http.get('/reseller/'+id);
      },
      'addResller': function(resllerObj){
        return $http.post('/reseller/add',resllerObj);
      },
      'getResellerByName': function(name,pageSize,currentPage){
        return $http.post('/reseller/search/'+pageSize+'/'+currentPage,{name:name});
      },
      'editResller': function(id,resllerObj){
        return $http.put('/reseller/edit/'+id,resllerObj);
      },
      'deleteResller': function(id){
        return $http.delete('/reseller/delete/'+id);
      }
    };
    return self;
  }]);
  app.service('ServiceProvidersServ',['$http',function($http){
    var self = {
      'serviceProvidersObj': [],
      'getServiceProviders': function(){
        $http.get('/sProvider').then(function(response) {
          self.serviceProvidersObj = response.data;
        }, function(response) {
          console.log("Something went wrong");
        });
      },
      'getServiceProviderByID': function(id){
        return $http.get('/sProvider/'+id);
      },
      'getServiceProvidersServicesByID': function(id){
        return $http.get('/sProvider/'+id+'/services');
      },
      'addServiceProvider': function(serviceProviderObj){
        return $http.post('/sProvider/add',serviceProviderObj);
      },
      'editServiceProvider': function(id,serviceProviderObj){
        return $http.put('/sProvider/edit/'+id,serviceProviderObj);
      },
      'deleteServiceProvider': function(id){
        return $http.delete('/sProvider/delete/'+id);
      }
    };
    self.getServiceProviders();
    return self;
  }]);
//0000 
  app.service('ServicesServ',['$http',function($http){
    var self = {
      'getServices': function(pageSize,currentPage){
        return $http.get('/service/'+pageSize+'/'+currentPage);
      },
      'getServicesByName': function(name,pageSize,currentPage){
        return $http.post('/service/search/'+pageSize+'/'+currentPage,{name:name});
      },
      'getAllServices': function(pageSize,currentPage){
        return $http.get('/service/all');
      },
      'getServiceByID': function(id){
        return $http.get('/service/'+id);
      },
      'addService': function(serviceObj){
        return $http.post('/service/add',serviceObj);
      },
      'editService': function(id,serviceObj){
        return $http.put('/service/edit/'+id,serviceObj);
      },
      'deleteService': function(id){
        return $http.delete('/service/delete/'+id);
      }
    };
    return self;
  }]);
  app.service('SuppliersServ',['$http',function($http){
    var self = {
       'getSuppliersCount': function(pageSize,currentPage){
        return $http.get('/supplier/getSuppliersCount');
      },
      'getSuppliers': function(pageSize,currentPage){
        return $http.get('/supplier/'+pageSize+'/'+currentPage);
      },
      'getSupplierByID': function(id){
        return $http.get('/supplier/'+id);
      },
      'addSupplier': function(supplierObj){
        return $http.post('/supplier/add',supplierObj);
      },
      'editSupplier': function(id,supplierObj){
        return $http.put('/supplier/edit/'+id,supplierObj);
      },
      'deleteSupplier': function(id){
        return $http.delete('/supplier/delete/'+id);
      }
    };
    return self;
  }]);
  app.service('InStockServ',['$http',function($http){
    var self = {
      'addInStock': function(obj){
        return $http.post('/inStock/add',obj);
      },
      'getByWP': function(idStock,idItem){
        return $http.get('/inStock/getByWP/'+idStock+'/'+idItem);
      },
      'getInStocks': function(pageSize,currentPage){
        return $http.get('/inStock/'+pageSize+'/'+currentPage);
      },
      'getInStocksReseler': function(pageSize,currentPage){
        return $http.get('/inStock/Reseler/'+pageSize+'/'+currentPage);
      },
      'deleteStocks': function(id){
        return $http.delete('/inStock/delete/'+id);
      },
      'getInStockById': function(id){
        return $http.get('/inStock/'+id);
      },
      'editInStock': function(id,obj){
        return $http.put('/inStock/edit/'+id,obj);
      }
    };

    return self;

  }]);
  app.service('WarehousesServ',['$http',function($http){
    var self = {
      'getWarehouses': function(pageSize,currentPage){
        return $http.get('/warehouse/'+pageSize+'/'+currentPage);
      },
      'getWarehouseByID': function(id){
        return $http.get('/warehouse/'+id);
      },
      'addWarehouse': function(warehouseObj){
        return $http.post('/warehouse/add',warehouseObj);
      },
      'editWarehouse': function(id,warehouseObj){
        return $http.put('/warehouse/edit/'+id,warehouseObj);
      },
      'deleteWarehouse': function(id){
        return $http.delete('/warehouse/delete/'+id);
      }
    };
    return self;
  }]);



}());