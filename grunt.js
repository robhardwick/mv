/* global module:false */
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-less');

    grunt.initConfig({

        // Tasks
        // -------------

        // Lint JS
        lint: {
            files: [
                'js/*(^min).js',
                'js/models/**/*.js',
                'js/views/**/*.js'
            ]
        },

        // RequireJS
        requirejs: {
            baseUrl: 'js',
            name: 'mv',
            mainConfigFile: 'js/mv.js',
            wrap: true,
            pragmas: {
                doExclude: true
            },
            skipModuleInsertion: false,
            optimizeAllPluginResources: true,
            findNestedDependencies: true,
            out: 'js/mv.min.js'
        },

        less: {
            less_compress: {
                src: 'css/mv/mv.less',
                dest: 'css/mv.min.css',
                options: {
                    yuicompress: true
                }
            },
        },

        // Configuration
        // -------------

        // Linting options
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                nomen: false
            },
            globals: {
                console: true,
                require: true,
                define: true
            }
        }

    });

    // build task
    grunt.registerTask('build', 'lint requirejs less');

    // default build task
    grunt.registerTask('default', 'build');

};
