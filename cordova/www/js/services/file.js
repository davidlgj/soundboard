

angular.module('soundboard').factory('fileService',['$q',function($q){
    var fileService = {}
    var fs = null

    var wrap = function(fn) {
        return function() {
            var deferred = $q.defer()
            if (!fs || !window.cordova) {
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
        //TODO: nedded for "from album"
    })

    fileService.rm = wrap(function(deferred,pth) {
        if (!angular.isString(pth)) {
            deferred.reject('Path should be a string')
            return;
        }  
        console.log('resolving '+pth)
        window.resolveLocalFileSystemURI(pth, function(fileEntry){
            fileEntry.remove(function(){
                console.log('deleted '+pth)
                deferred.resolve()
            },function(err){
                deferred.reject(err)
                console.log(angular.toJson(err))
            })
        }, function(){
            deferred.reject('Could not resolve uri '+pth)
        })
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