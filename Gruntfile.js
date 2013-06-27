module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      debug: {
        tasks: ['exec:server','exec:debugger'],
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
      },
      server: {
        cmd: 'node --debug-brk server/peer.js'
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
    nodev: {
      debugger: {
        options: {
          exec: 'node-inspector'
        }
      },
      dev: {
        options: {
          file: 'server/peer.js'
          // args: ['production'],
          // ignoredFiles: ['README.md', 'node_modules/**'],
          // watchedExtensions: ['js', 'coffee'],
          // watchedFolders: ['test', 'tasks'],
          // debug: true
          // delayTime: 1,
          // cwd: __dirname
        }
      },
      debug: {
        options: {
          file: 'server/peer.js',
          args: ['node-inspector'],
          // debug: false
          debug:true
        }
      }
    },
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.client.options.port%>'
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
    // 'exec:debugger',
    // 'nodev:debug'
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
