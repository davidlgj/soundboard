

angular.module('soundboard').controller('BoardCtrl',['$scope','$q',function($scope,$q){

    $scope.sounds = angular.fromJson(localStorage.getItem('sounds')) || []

    var playing = {}

    document.addEventListener("deviceready", function(){
    
        $scope.play = function(file) {
            console.log('play')
            if (!playing[file]) {
                var media = new Media(file, function(){
                    console.log('success! releasing media')
                    delete playing[file]
                    if (media) {
                        media.release()
                    }
                }, function(err){
                    console.log('error play '+err)
                    delete playing[file]
                    if (media) {
                        media.release()
                    }
                })
                media.play();
                playing[file] = media;
            } else {
                console.log('resetting sound')
                playing[file].seekTo(0)
            }
        }

        var takePicture = function() {
            var deferred = $q.defer()
            navigator.camera.getPicture(function(uri){
                console.log(uri)
                deferred.resolve(uri)
                $scope.$apply()

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

        var fromAlbum = function() {
            var deferred = $q.defer()
            navigator.camera.getPicture(function(uri){
                console.log(uri)
                deferred.resolve(uri)
                $scope.$apply()

            },function(errors){
                console.log(errors)
                deferred.reject()
                $scope.$apply()
            },{
                sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: navigator.camera.DestinationType.FILE_URI
            })
            return deferred.promise            
        }


        $scope.add = function() {
            takePicture().then(function(uri){
                $scope.currentSound = { image: uri }
                $scope.sounds.push($scope.currentSound)
                $scope.recorder = true
            })
        }

        $scope.openRecorder = function(sound) {            
            $scope.currentSound = sound
            $scope.recorder = true
            $scope.editview = false
        }

        $scope.picture = function(sound) {
            takePicture().then(function(uri){
                //FIXME: delete old picture
                sound.image = uri    
                $scope.editview = false
            })   
        }

        $scope.album = function(sound) {
            fromAlbum().then(function(uri){
                //FIXME: delete old picture
                //FIXME: copy image from album sd 
                sound.image = uri    
                $scope.editview = false
            },function(){
                //TODO: error message
                $scope.editview = false
            })   
        }


        $scope.recording = false
        var recordingMedia = null
       
        $scope.record = function(sound) {
            if (!$scope.recording && (sound.image || sound.file)) {
                //create sound file name from image name if needed
                if (!sound.file) {
                    sound.file = sound.image.substring(0,sound.image.length-4)+'.m4a'
                }

                console.log('starting recording '+sound.file);
                recordingMedia = new Media(sound.file,function(){ 
                    console.log('recording success')
                },function(err){ 
                    console.log('error '+angular.toJson(err))
                    $scope.recording = false
                    $scope.recorder = false;
                    recordingMedia.release() 
                    recordingMedia = null
                })
                recordingMedia.startRecord()
                $scope.recording = true
            } else {
                if (recordingMedia) {
                    console.log('stopping recording')
                    recordingMedia.stopRecord()
                    recordingMedia.release();
                    recordingMedia = null
                    localStorage.setItem('sounds',angular.toJson($scope.sounds))
                }
                $scope.recorder = false;
                $scope.recording = false
            }
        }


    }, false);


    $scope.edit = function(sound){
        console.log('edit!'+angular.toJson(sound))
        $scope.editview = true
        $scope.currentSound = sound
    }


    $scope.delete = function(sound) {
        //FIXME: actually delete files as well
        //TODO: translate
        navigator.notification.confirm('Are you sure?', function(){
            for (var i=0; i<$scope.sounds.length;i++) {
                if (sound === $scope.sounds[i]) {
                    $scope.sounds.splice(i,1)
                    break;
                }
            }
            $scope.editview = false
            $scope.$apply()
        },'Delete',['Delete','Cancel'])
    }



}])