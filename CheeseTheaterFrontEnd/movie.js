var app=angular.module('myapp',['ngResource','ngRoute','ngCookies']);
  app.config(['$locationProvider','$routeProvider','$resourceProvider',function($locationProvider,$routeProvider,$resourceProvider){
           $resourceProvider.defaults.stripTrailingSlashes = false;
           $locationProvider.html5Mode(true).hashPrefix('!');
           $routeProvider
           .when('/',{templateUrl:'front.html',controller:'movies'})
           .when('/logup',{templateUrl:'signup.html',controller:'logup'})
           .when('/login',{templateUrl:'signin.html',controller:'login'})
           .when('/moviesearch',{templateUrl:'movies.html',controller:'moviesearch'})
           .when('/movie/:id',{templateUrl:'moviedetail.html',controller:'moviedetail'})
           .when('/shoppingcar',{templateUrl:'shoppingcar.html',controller:'shoppingcar'})
           .when('/about',{templateUrl:'about.html'})
           .when('/payment',{templateUrl:'payment.html'})
           .when('/orders',{templateUrl:'order.html',controller:'order'})
           .otherwise({redirectTo:'/'});



}]);
    

app.controller('logup',['$scope','$resource','$cookies','$rootScope','$location',function($scope,$resource,$cookies,$rootScope,$location){
        
        $scope.match=function(form){
           if($scope.password!=$scope.repassword){
                  form.repassword.$error=true;
          
            }else{
                  form.repassword.$error=false;
           }
 


}    
          $scope.check=function(myform){
             var res=$resource('/cheesetheater/check');
               if(myform.username.$valid){
                  res.get({username:$scope.username},function(v,heads){
                      if(v.taken){

                         $scope.taken=true;
                         $scope.free=false;
}

                      else{

                          $scope.taken=false;
                          $scope.free=true;
}

},function(res){})

}


  };  
                                     
            
             
          
       
 
           $scope.signup=function(myform){
              var res=$resource('/cheesetheater/logup/')
            res.save(null,{username:$scope.username,email:$scope.email,password:$scope.password},function(){$location.path('/login');     },function(){});   
             

             }






}]);



app.controller('login',['$scope','$resource','$location','$rootScope',function($scope,$resource,$location,$rootScope){
  var res=$resource('/cheesetheater/api-token-auth/',{},{
   postform:{method:"POST",isArray:false,headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}},

});
  $scope.submit=function(){     
res.postform(null,$.param({username:$scope.username,password:$scope.password}),function(value,responseHeaders){
       $location.path("/");
       $rootScope.logineduser="   Hi "+$scope.username;
       localStorage.setItem("logineduser",$rootScope.logineduser);
       localStorage.setItem("token",value.token);
},function(data){
    $scope.result="please check your username and password";

});

};

}]);





app.controller('navbar',['$scope','$location','$rootScope',function($scope,$location,$rootScope){
              if(localStorage.items!=null){
              $rootScope.products=parseInt(localStorage.items);
              }
               if(localStorage.logineduser!=null){
                        $rootScope.logineduser=localStorage.logineduser; 

}
            $scope.login=function(){
            $location.path('/login')
}  

            $scope.logup=function(){
                $location.path('/logup');
}; 
               $scope.search=function(){
              
               $location.path('/moviesearch').search({search:$scope.searchvalue});   
                 
};

            $scope.logout=function(){
              $rootScope.logineduser=null;
              localStorage.removeItem("logineduser");
              localStorage.removeItem("token");
              $location.path("/");
}




}]);

app.controller('moviesearch',['$scope','$resource','$location',function($scope,$resource,$location){
         var res=$resource('/cheesetheater/moviesearch');
         var searchname=$location.search().search;
         var movieback=res.query({search:searchname},function(){
             $scope.movies=movieback;

});              
       


}]);

 
app.controller('movies',['$scope','$resource',function($scope,$resource){
        var res=$resource('/cheesetheater/movies');
         var moviesback=res.query(function(){
              $scope.movies=moviesback;
        
});
         


}]);



app.controller('moviedetail',['$scope','$resource','$routeParams','$rootScope',function($scope,$resource,$routeParams,$rootScope){
             var res=$resource('/cheesetheater/movie/:id');
             var movieback=res.get({id:$routeParams.id},function(){
                $scope.movie=movieback;
});
            
             $scope.$watch('theateritem.tickets',function(){
                $scope.numbers=[];   
            for(var a=0;a<$scope.theateritem['tickets'];a++){
                $scope.numbers[a]=a+1;      

}

});

           $scope.add=function(){
                if($rootScope.products!==undefined){
                $rootScope.products=$rootScope.products+$scope.numitem;
         
              }else{
              $rootScope.products=$scope.numitem;

}
              localStorage.setItem("items",$rootScope.products);
            var r=$resource('/cheesetheater/shop');
               r.get({id:encodeURIComponent($scope.movie.id),movie:encodeURIComponent($scope.movie.name),theater:encodeURIComponent($scope.theateritem.name),tickets:encodeURIComponent($scope.numitem),money:encodeURIComponent($scope.movie.money)},function(){});

}  



   
     
   
}]);





app.controller('shoppingcar',['$scope','$resource','$rootScope','$location',function($scope,$resource,$rootScope,$location){
              $scope.total=0;
          var r=$resource('/cheesetheater/shoppingcar');
          var shoppings= r.query(function(){
                $scope.shoppingmovies=shoppings;});


          
  jQuery(function(){
          jQuery("#totalcheck").click(function(){
                if(jQuery(this).prop("checked")===true){
                     jQuery("input.c2").each(function(){
                           var value=parseInt( jQuery(this).val());
                           if(jQuery(this).prop("checked")===false){
                                    jQuery(this).prop("checked",true);
                                    $scope.$apply(function(){
                                         $scope.total+=value;
                                         
                                   });
                              }
                                
                        });                      





                 }else{
                       jQuery("input.c2").prop("checked",false);
                       $scope.$apply(function(){

                             $scope.total=0;
                      });

                  }
          });
            





           jQuery("table").on("click","input.c2",function(e){
                   var value=parseInt(jQuery(e.target).val());
                  if(jQuery(e.target).prop("checked")===true){
                        $scope.$apply(function(){
                             $scope.total+=value;
                           });      
                  }else{
                       $scope.$apply(function(){
                             $scope.total-=value;
                           });
                    } 




           });

            












});



$scope.checkout=function(){
     var res=$resource('/cheesetheater/checkout/',{},{post:{method:'POST',isArray:true,headers:{'Authorization': 'Token '+localStorage.token}}});
     var orders=[];      
     var numbers=0;

     if(localStorage.token!=null){
       jQuery("input.c2").each(function(){
             if(jQuery(this).prop("checked")===true){
                      var a=parseInt(jQuery(this).data("tickets"));
                       numbers+=a;
                 var order={orderid:jQuery(this).data("orderid"), moviename:jQuery(this).data("moviename"),theatername:jQuery(this).data("theatername"),tickets:jQuery(this).data("tickets"),moneys:jQuery(this).data("moneys")};
                  orders.push(order);
}

         });
          if($rootScope.products!=null){
          $rootScope.products-=numbers;
         localStorage.items=$rootScope.products; 
 
        }
  if(orders.length>0){
  res.post({},orders,function(){},function(){});}
  $location.path("/payment");
}

    else{
       $location.path("/login");

}
  

};



}]);

app.filter('decodeURIComponent',function(){
     return decodeURIComponent;


});


app.controller('order',['$scope','$resource','$location',function($scope,$resource,$location){
                if(localStorage.token!=null){
               var res=$resource('/cheesetheater/orders',{},{queryorder:{method:'GET',isArray:true,headers:{'Authorization': 'Token '+localStorage.token}}});
               var orders= res.queryorder(function(){
              $scope.shoppingmovies=orders;           
});
                   



              }else{
                $location.path("/login");
}

}]);






