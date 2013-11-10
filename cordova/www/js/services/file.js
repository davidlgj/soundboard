

angular.module('soundboard').factory('fileService',['$q',function($q){
    var fileService = {}
    var fs = null

    var wrap = function(fn) {
        return function() {
            var deferred = $q.defer()
            if (!fs) {
                deferred.reject('no filesystem')
            } else {
                var args = Array.prototype.slice(arguments)
                args.unshift(deferred)
                fn.apply(this,args)
            }
            return deferred.promise 
        }
    }


    fileService.cp = wrap(function(deferred,src,dest) {
        window.resolveLocalFileSystemURI(src, function(){}, function(){
            deferred
        });

    })

    fileService.rm = wrap(function(deferred,pth) {
        
    })


    document.addEventListener('deviceready',function(){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            fs = fileSystem
        }, function(){
            console.log('fs error')
            fs = null
        });
    },false)

    return fileService
}])