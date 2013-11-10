

module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'cordova/www/css/main.css': 'cordova/www/sass/main.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 version','android 4','ios 6']
            },
            main: {
                src: 'cordova/www/css/main.css'
            }
        },
        watch: {
            sass: {
                files: ['cordova/www/sass/*.scss'],
                tasks: ['sass','autoprefixer']
            }
        }
    });

    

    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-sass')
    grunt.loadNpmTasks('grunt-autoprefixer')
};