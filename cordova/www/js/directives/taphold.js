
/**
 * Taphold hack
 * only works with modified ngTouch ng-click directive
 */ 
angular.module('soundboard').directive('taphold',['$parse',function($parse){
    return {
        restrict: 'A',
        link: function(scope,element,attrs) {
            element.on('taphold',function(){
                console.log('taphold directive')
                $parse(attrs.taphold)(scope)
                scope.$apply()
            })
        }
    }
}])