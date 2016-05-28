(function(){
  'use strict';
  var app = angular.module('isp');
  //dddddddddddddddddddddd
  app.controller('InvoicesCtl',['$scope','$stateParams','MenuFac','InvoicesServ',function($scope,$stateParams,MenuFac,InvoicesServ){
    MenuFac.active = 10;
    $scope.activePanel = MenuFac;
    //alert($stateParams.id);
    InvoicesServ.getInvoiceByID($stateParams.id).then(function(response) {
      $scope.allInvoice=response.data;
    }, function(response) {
        console.log("Something went wrong");
    });

    $scope.showInvoice = function(id){
      window.location.href='/report/printInvoice/'+id;
    }
  }]);

  app.controller('NewInvoiceCtl',['$scope','$state','MenuFac','InvoicesServ','HelperServ','CustomersServ','toastr','$http','ReportServ',function($scope,$state,MenuFac,InvoicesServ,HelperServ,CustomersServ,toastr,$http,ReportServ){    
    $scope.go =function(id,name){
      $scope.customId=id;
    }
    $scope.myFunc = function() {
      $scope.search=angular.element('#Text1').val();
      var name=angular.element('#Text1').val();
      if(!name){ name=null;};
      $http({ method: 'POST', url: '/customer/in/'+name}).
        success(function(data, status, headers, config) {
          $scope.customers=data;
        }).error(function(data, status, headers, config) {
          console.log('Oops and error', data);
        });
    };
    MenuFac.active = 10;
    $scope.activePanel = MenuFac;
    $scope.objects = HelperServ;
    $scope.objects.getAllItems();
    $scope.objects.getAllServices();
    $scope.objects.getAllPackages();
    $scope.objects.getAllResellers();
    $scope.newInvoiceForm = {};
    $scope.previousSubscription = '1';
    $scope.init = function () {
      CustomersServ.getAllCustomers().then(function(response) {
        $scope.customers = response.data;
      }, function(response) {
        console.log("Something went wrong");
      });
    }
    $scope.init();
    $scope.newInvoice = function(){
      if($scope.previousSubscription==1){
        $scope.newInvoiceForm.previousSubscription=1;
        $scope.newInvoiceForm.itemInfo=$scope.itemInfo.inst;
        InvoicesServ.addInvoice($scope.newInvoiceForm).then(function(response,err){
          if(!err){
            window.location.href='/report/printInvoice/'+response.data[1]._id;
            // InvoicesServ.report(response.data).then(function(response,err){
            //   if(!err){

            //   }
            // },function(response){
            //   console.log("Something went wrong");
            // });
          }
        },function(response){
          console.log("Something went wrong");
        });
      } else if($scope.previousSubscription==2){
          $scope.newInvoiceForm.previousSubscription=2;
          $scope.newInvoiceForm.customId=$scope.customId;
          $scope.newInvoiceForm.itemInfo=$scope.itemInfo.inst;
          InvoicesServ.addInvoice($scope.newInvoiceForm).then(function(response){
            window.location.href='/report/printInvoice/'+response.data[1]._id;
          },function(response){
            console.log("Something went wrong");
          });
        }
    };
    $scope.getItemInfo = function(){
      InvoicesServ.getItemInfoByID($scope.newInvoiceForm.productItem).then(function(response){
        $scope.itemInfo={};
        $scope.itemInfo.username = response.data.username;
        $scope.itemInfo.password = response.data.password;
        $scope.itemInfo.inst=response.data._id;
      },function(response) {
        console.log("Something went wrong");
      });
    };
    $scope.getProductInfo = function(id){
      if(id == 'خدمة'){
        $scope.productsObj = $scope.objects.servicesObj;
      } else if(id == 'معدة'){
        $scope.productsObj = $scope.objects.itemsObj;
      } else if (id == 'حزمة'){
        $scope.productsObj = $scope.objects.packagesObj;
      }
    };
    $scope.test = function(){
      console.log($scope.productName.name);
    }
    $scope.selectedProducts = [];
    $scope.productTypeRequired = false;
    $scope.productNameRequired = false;
    $scope.selectProduct = function(){
      if(!$scope.productType){
        $scope.productTypeRequired = true;
      }
      if(!$scope.productName){
        $scope.productNameRequired = true;
      }
      if($scope.productType && $scope.productName){
        $scope.selectedProducts.push({'type':$scope.productType,'name':$scope.productName.name,'id':$scope.productName._id});
        $scope.productType = '';
        $scope.productName = '';
      }
    };
    $scope.removeSelect = function(index){
      $scope.selectedProducts.splice(index, 1);
    };
  }]);
  app.controller('EditInvoiceCtl',['$scope','MenuFac','InvoicesServ',function($scope,MenuFac,InvoicesServ){
    MenuFac.active = 10;
    $scope.activePanel = MenuFac;
    $scope.editInvoiceForm = {};
  }]);
}());