require('shelljs/global');

var sprintf = require('sprintf').sprintf;

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-jafar-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            remove: [
                'www/vendor',
                'www/index.html',
                'www/js',
                'www/css',
                'www/fonts'
            ]
        },

        fetchDeps: {
            bower: {
                targetDir: 'www/vendor'
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'www/src/**/*.js', 'www/test/**/*.js'],
            options: {
                globals: {
                    console: true,
                    document: true
                }
            }
        },

        useHtml: {
            scan: ['www/index-unminified.html'],
            map: {
                'www/index-unminified.html': 'www/index.html'
            }
        }
    });

    grunt.registerTask('build', ['fetchDeps', 'useHtml:scan', 'concat', 'uglify', 'useHtml:map', 'copyFiles']);

    grunt.registerTask('cleanCache', function() {
        rm('-rf', 'bower_components');
    });

    grunt.registerTask('buildLocal', ['fetchDeps', 'useHtml:scan', 'concat', 'uglify', 'useHtml:map', 'copyFiles', 'linkInternalProjects']);

    grunt.registerTask('linkInternalProjects', function() {
        var cmd;

        cmd = sprintf('rm -fr %s', 'www/vendor/xin');
        exec(cmd);

        cmd = sprintf('rm -fr %s', 'www/vendor/xin-data');
        exec(cmd);

        cmd = sprintf('ln -s `pwd`/../../js/xin `pwd`/www/vendor/xin');
        exec(cmd);

        cmd = sprintf('ln -s `pwd`/../../js/xin-data `pwd`/www/vendor/xin-data');
        exec(cmd);
        console.log('www/vendor:');
        exec('ls -l www/vendor | awk \'{ print $9" "$10" "$11 }\'');
    });

    grunt.registerTask('copyFiles', function() {
        // rm('-rf', 'www/fonts/');
        // cp('-R', 'www/vendor/sass-bootstrap-glyphicons/fonts/', 'www/fonts/');
    });

    grunt.registerTask('default', function() {
        console.log('Available targets:');
        console.log('clean');
        console.log('build');
        console.log('buildLocal');
        console.log('deploy');
        console.log('cleanCache');
    });


    grunt.registerTask('deploy', function() {
        var config = require('./private-bin/config');
        var cmd = sprintf('rsync -e "ssh -p %d" -avz --delete', config.port);
        config.excludes.forEach(function(glob) {
            cmd += sprintf(' --exclude "%s"', glob);
        });
        cmd += sprintf(' ./ %s@%s:%s/', config.user, config.host, config.dest);
        var result = exec(cmd, {silent: true});
        if (result.code !== 0) {
            console.error(result.output);
            return;
        }
        console.log(result.output);

        cmd = sprintf('ssh -p %s %s@%s -- "cd /var/www/think && composer install"',
            config.port,
            config.user,
            config.host,
            config.dest);

        result = exec(cmd, {silent: true});
        if (result.code !== 0) {
            console.error(result.output);
            return;
        }
        console.log(result.output);

        cmd = sprintf('ssh -p %s %s@%s -- "chown -R www-data:www-data %s"',
            config.port,
            config.user,
            config.host,
            config.dest);

        result = exec(cmd, {silent: true});
        if (result.code !== 0) {
            console.error(result.output);
            return;
        }
        console.log(result.output);
    });

};