

angular.module('soundboard').factory('photoService',['$q',function($q){
    return {
        takePicture: function() {
            var deferred = $q.defer()
            navigator.camera.getPicture(function(uri){
                console.log(uri)
                deferred.resolve(uri)
            },function(errors){
                console.log(errors)
                deferred.reject()
            },{
                sourceType : navigator.camera.PictureSourceType.CAMERA,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                quality: 50,
                targetWidth: 256,
                saveToPhotoAlbum: false,
                correctOrientation: true
            })
            return deferred.promise            
        }
    }
}])