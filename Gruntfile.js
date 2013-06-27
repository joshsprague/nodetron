module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      debug: {
        tasks: ['exec:debugger','nodemon:debug','open:debug'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    connect: {
      client: {
        options: {
          port: 8000,
          base: 'client',
          // Livereload needs connect to insert a cJavascript snippet
          // in the pages it serves. This requires using a custom connect middleware
          middleware: function(connect, options) {
            return [
              // Load the middleware provided by the livereload plugin
              // that will take care of inserting the snippet
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
              // Serve the project folder
              connect.static(options.base)
            ];
          }
        }
      }
    },
    exec: {
      debugger: {
        cmd: 'node-inspector'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
      },
      e2e: {
        configFile: 'karma-e2e.conf.js',
        singleRun: true
      },
      cross: {
        configFile: 'karma-e2e.conf.js',
        browsers: ['Chrome', 'Firefox'] //default is just Chrome
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'server/peer.js',
          // ignoredFiles: ['README.md', 'node_modules/**'],
          // watchedExtensions: ['js', 'coffee'],
          // watchedFolders: ['test', 'tasks'],
          // delayTime: 1,
          // cwd: __dirname
        }
      },
      debug: {
        options: {
          file: 'server/peer.js',
          debugBreak:true
        }
      }
    },
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.client.options.port%>'
      },
      debug: {
        path: 'http://0.0.0.0:8080/debug?port=5858'
      }
    },
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        grep: '*-test',
        ui: 'bdd',
        reporter: 'tap'
      },
      all: { src: ['test/server/index.js','test/server/**/*.js'] }
    },
    watch: {
      client: {
        files: ['client/**/*'],
        options: {
          livereload:true
        }
      },
    }
  });

  grunt.registerTask('all', [
    'connect:client',
    'open',
    'watch:client'
  ]);
  grunt.registerTask('client', [
    'connect:client',
    'open',
    'watch:client'
  ]);
  grunt.registerTask('server', [
    'nodemon:dev'
  ]);
  grunt.registerTask('server-debug', [
    'concurrent:debug'
  ]);
  //simplemocha is for serverside
  grunt.registerTask('server-unit', [
    'simplemocha'
  ]);
  //karma is for client-side
  grunt.registerTask('client-unit', [
    'karma:unit'
  ]);
  grunt.registerTask('e2e', [
    'karma:e2e'
  ]);
  grunt.registerTask('cross', [
    'karma:cross'
  ]);
};
