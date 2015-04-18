describe('moviescontroller',function(){
beforeEach(module('myapp'));
var $controller,$httpBackend;

beforeEach(inject(function(_$controller_,_$httpBackend_){
   $controller=_$controller_;
   $httpBackend=_$httpBackend_;
}));

describe('movies',function(){
    var $scope,controller;
    beforeEach(function(){
       $scope={};      
       controller=$controller('movies',{$scope:$scope});
    });

     it('movieback',function(){
        $scope.movies=$httpBackend.expectGet().respond([{name:'tommy'}]);
           $httpBackend.flush();
           expect($scope.movies[0].name).toEqual('tommy');
     });




});

});




describe('moviedetail',function(){
beforeEach(module('myapp'));
var $controller,$rootScope;
beforeEach(inject(function(_$controller_,_$rootScope_){
     $controller=_$controller_;
     $rootScope=_$rootScope_;

}));

describe('moviedetailcontroller',function(){
     var controller,$scope;
    
      beforeEach(function() {
      $scope = {};
      controller = $controller('moviedetail', { $scope: $scope });
    });
    
      it('', function() {
      $scope.numitem =9;
      $rootScope.products=10;
      $scope.add();
      expect($rootScope.products).toEqual(19);
    });


});



});

