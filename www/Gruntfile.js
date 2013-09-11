
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-jafar-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            remove: [
                'dist',
                'bower_components',
                'index.html',
                'js',
                'css'
            ]
        },

        fetchDeps: {
            bower: {}
        },

        jshint: {
            files: ['Gruntfile.js', 'grunt-tasks/*.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    console: true,
                    document: true
                }
            }
        },

        useHtml: {
            scan: ['index-unminified.html'],
            map: {
                'index-unminified.html': 'index.html'
            }
        }
    });

    grunt.registerTask('build', ['fetchDeps', 'useHtml:scan', 'concat', 'uglify', 'useHtml:map']);

};