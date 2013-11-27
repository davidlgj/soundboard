

angular.module('soundboard').controller('BoardCtrl',
       ['$scope','$q','$timeout','fileService','audioService','photoService',
function($scope,  $q,  $timeout,  fileService,  audioService,  photoService){

    $scope.sounds = angular.fromJson(localStorage.getItem('sounds')) || []
    $scope.recorder = false
    $scope.recording = false
    $scope.onstart = true

    var playing = {}

    document.addEventListener("deviceready", function(){
    
        $scope.play = function(sound,index) {
            var node = angular.element(document.querySelector('#sound'+index))
                              .addClass('playing')
            audioService.play(sound.file).finally(function(){
                node.removeClass('playing')
            })
                
        }
        
        $scope.add = function() {
            fadeInBackdrop().then(photoService.takePicture).then(function(uri){
                $scope.currentSound = { image: uri }
                $scope.sounds.push($scope.currentSound)
            },function(){
                fadeOutBackdrop()
            })

        }

        $scope.record = function(sound) {
            if (!audioService.isRecording() && (sound.image || sound.file)) {
                //create sound file name from image name if needed
                if (!sound.file) {
                    sound.file = sound.image.substring(0,sound.image.length-4)+'.m4a'
                }
                $scope.recording = true

                audioService.record(sound.file).then(function(){
                    localStorage.setItem('sounds',angular.toJson($scope.sounds))
                }).finally(function(){
                    $scope.recording = false
                    delay(300).then(fadeOutBackdrop)
                })
            } else if (audioService.isRecording()) {
                audioService.stopRecording()
            }
        }

        //handle backbutton, close recorder or exit
        document.addEventListener('backbutton',function(){
            //stop recording if we're doing that
            if (audioService.isRecording()) {
                audioService.stopRecording()
                            .finally(function(){
                                deleteSound($scope.sounds.pop())
                            })

                $scope.currentSound = null
                $scope.$apply()
            } else if ($scope.recorder) {
                fadeOutBackdrop()
                deleteSound($scope.sounds.pop())
                $scope.currentSound = null
                $scope.$apply()
            } else {
                navigator.app.exitApp()
            }
        },false)

        setTimeout(navigator.splashscreen.hide,500)

    }, false);

    $scope.delete = function(sound) {
        if (playing[sound.file]) {
            return
        }
        
        //TODO: translate
        navigator.notification.confirm('Delete sound?', function(button){
            if (button === 1) {
                deleteSound(sound)
            }
        })
    }

    var deleteSound = function(sound){ 
        for (var i=0; i<$scope.sounds.length;i++) {
            if (sound === $scope.sounds[i]) {
                $scope.sounds.splice(i,1)
                break;
            }
        }
        //FIXME: error handling. 
        console.log(angular.toJson(sound))
        fileService.rm(sound.image).then(angular.noop,function(err){ console.log(err) })
        fileService.rm(sound.file).then(angular.noop,function(err){ console.log(err) })
        $scope.editview = false
        localStorage.setItem('sounds',angular.toJson($scope.sounds))
        $scope.$apply()
    }

    var delay = function(time) {
        return $timeout(angular.noop,time)
    }


    //WARNING: night time hack below
    //webkit has problems fading in content at the same time it goes from display: none to something else
    //so we do a hack here 
    //TODO: fix it in a more angular way
    var fadeInBackdrop = function() {
        $scope.recorder = true
        var start = Date.now()
        var n = document.getElementById('record')
        //first show it
        n.style.display = 'block'
        var style = window.getComputedStyle(n)
        console.log(style.display)
        console.log(style.opacity)

        n.style.opacity = '1' //start transition
        return delay(200).then(function(){
            console.log(Date.now()-start)
            document.querySelector('#record section').style.display = 'block'
            return true    
        })
    }
    $scope.fadeIn = fadeInBackdrop
    var fadeOutBackdrop = function() {
        $scope.recorder = false
        var n = document.getElementById('record')
        n.style.opacity = '0'
        return delay(300).then(function(){
            n.style.display = 'none'
            document.querySelector('#record section').style.display = 'none'
            return true
        })
    }
    
}])