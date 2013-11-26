

angular.module('soundboard').factory('audioService',['$q',function($q){
    
    //keep track of files while playing
    var playing = {}
    var recording = null
    var recorderPromise = null

    var service = {
        /**
        * Play a file
        */  
        play: function(file){
            var deferred = $q.defer()

            if (!playing[file]) {
                var media = new Media(file, function(){
                    console.log('success! releasing media ' + file)
                    delete playing[file]
                    if (media) {
                        media.release()
                    }
                    deferred.resolve()
                }, function(err){
                    console.log('error play '+err)
                    delete playing[file]
                    if (media) {
                        media.release()
                    }
                    deferred.reject()
                })
                media.play();
                playing[file] = media;
            } else {
                console.log('resetting sound')
                playing[file].seekTo(0)
            }

            return deferred.promise
        },

        record: function(file){
            var deferred = $q.defer()

            if (recording) {
                deferred.reject()
                return deferred.promise
            }

            recording = new Media(file,function(){ 
                console.log('recording success ')
                recording.release()
                recording = null
                deferred.resolve()
            },function(err){ 
                console.log('error '+angular.toJson(err))
                recording.release()
                recording = null 
                deferred.reject(err)
            })

            //start recording
            recording.startRecord()
            recorderPromise = deferred.promise
            return deferred.promise
        },
      
        stopRecording: function(){
            if (recording) {
                recording.stopRecord()
            }
            return recorderPromise 
        },

        isRecording: function() {
            return recording !== null
        }
    }


  return service   
}])