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
      },
      all: {
        tasks:['server','delayed:client'],
        options: {
          logConcurrentOutput: true
        }
      },
      alldebug: {
        tasks:['concurrent:debug','delayed:client'],
        options: {
          logConcurrentOutput: true
        }
      },
      'two-clients': {
        tasks:['server','delayed:client', 'delayed:clientalt'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    connect: {
      client: {
        options: {
          port: 8000,
          base: 'client'
        }
      },
      clientalt: {
        options: {
          port: 9000,
          base: 'client',
          keepalive:true
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
          debug:true
        }
      }
    },
    open: {
      client: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.client.options.port%>'
      },
      clientalt: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.clientalt.options.port%>'
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
          livereload:true,
          keepalive:true
        }
      },
    }
  });

  //takes an argument: a task to run
  grunt.registerTask('delayed', 'delayed', function (task) {
    console.log('Delayed: ' + task);

    var done = this.async();
    setTimeout(function () {
      grunt.task.run(task);
      done();
    }, 800);
  });

  grunt.registerTask('all', [
    'concurrent:all'
  ]);
  grunt.registerTask('two-clients', [
    'concurrent:two-clients'
  ]);
  grunt.registerTask('all:debug', [
    'concurrent:alldebug'
  ]);
  grunt.registerTask('client', [
    'connect:client',
    'open:client',
    'watch:client'
  ]);
  grunt.registerTask('clientalt', [
    'connect:clientalt',
    'open:clientalt',
  ]);
  grunt.registerTask('server', [
    'nodemon:dev'
  ]);
  grunt.registerTask('server:debug', [
    'concurrent:debug'
  ]);
  //simplemocha is for serverside
  grunt.registerTask('server:unit', [
    'simplemocha'
  ]);
  //karma is for client-side
  grunt.registerTask('client:unit', [
    'karma:unit'
  ]);
  grunt.registerTask('e2e', [
    'karma:e2e'
  ]);
  grunt.registerTask('cross', [
    'karma:cross'
  ]);
};
