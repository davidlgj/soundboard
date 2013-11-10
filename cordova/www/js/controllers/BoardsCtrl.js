
angular.module('soundboard').controller('BoardsCtrl',['$scope','$location',function($scope,$location){
    var boards = localStorage.getItem('boards')
    if (boards) {
        $scope.boards = angular.fromJson(boards)
    } else {
        $scope.boards = []
    }

    $scope.add = function(){
        var id = Date.now()
        $scope.boards.push({
            id: id
        })
        localStorage.setItem('boards',angular.toJson($scope.boards))
        $location.path('/'+id)
    }

    $scope.open = function(id){
        $location.path('/'+id)      
    }

}])