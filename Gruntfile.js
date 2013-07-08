var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var livereloadMiddleware = function (connect, options) {
  return [
    lrSnippet,
    // Serve static files.
    connect.static(options.base),
    // Make empty directories browsable.
    connect.directory(options.base)
  ];
};

module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    clientFolder: 'demo/app',
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      options: {
        logConcurrentOutput:true
      },
      debug: {
        tasks:['exec:mongod','exec:debugger','nodemon:debug','delayed:open:debug']
      },
      all: {
        tasks:['server','delayed:client']
      },
      alldebug: {
        tasks:['concurrent:debug','delayed:client']
      }
    },
    connect: {
      options: {
        base:'<%= clientFolder %>'
      },
      client: {
        options: {
          port: 9000,
          middleware: livereloadMiddleware
        }
      },
      addclient: {
        options: {
          port: 9000,
          middleware: livereloadMiddleware,
          keepalive:true
        }
      }
    },
    exec: {
      debugger: {
        cmd: 'node-inspector'
      },
      mongod: {
        cmd:'mongod &'
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
      options: {
        file: 'server/peer.js',
        watchedFolders: ['server']
      },
      dev: {
          // ignoredFiles: ['README.md', 'node_modules/**'],
          // watchedExtensions: ['js', 'coffee'],
          // watchedFolders: ['test', 'tasks'],
          // delayTime: 1,
          // cwd: __dirname
      },
      debug: {
        options: {
          debug:true
        }
      }
    },
    open: {
      client: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.client.options.port%>'
      },
      addclient: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.addclient.options.port%>'
      },
      debug: {
        path: 'http://localhost:8080/debug?port=5858'
      }
    },
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },
      src: ['server/**/*.js','test/server/index.js','test/server/**/*.js',]
    },
    watch: {
      client: {
        files: ['<%= clientFolder %>/**/**/*'],
        options: {
          livereload:LIVERELOAD_PORT,
          keepalive:true,
          nospawn:true
        }
      }
    },
    uglify: {
      build: {
        files: {
          'nodetron.min.js': ['client/**/*.js']
        }
      }
    }
  });

  grunt.registerTask('demo', 'Set the base client folder to "demo" and run subsequent task arguments', function() {
    grunt.config.set('clientFolder','demo/app');
    var args = [].join.call(arguments,':');
    grunt.task.run(args);
  });



  //takes any number of arguments: a task-argument chain to run
  //grunt automatically splits a string on the colon character, passes those in as separate arguments.
  grunt.registerTask('delayed', 'delayed', function () {
    var done = this.async();
    var args = [].join.call(arguments,':');
    setTimeout(function () {
      grunt.task.run(args);
      done();
    }, 400);
  });

  //should accept all, all:<num>, all:debug, or all:<num>:debug
  grunt.registerTask('all', 'Run server and one or more clients on different ports.', function(arg1,arg2) {
    var tasks = ['concurrent','all'];
    //all:debug
    if (arg1 === 'debug' || arg2 === 'debug') {
      tasks[1]+='debug';
    }

    //parse first argument (sets how many clients to run)
    var num = parseInt(arg1,10);
    if (grunt.util.kindOf(num)==='number' && !isNaN(num)) {
      var arr = [];
      //start at 1 because we already run delayed:client
      for (var i = 1 ; i<num; i++) {
        arr.push('delayed:addclient:'+i);
      }
      var prop = tasks.join('.') + '.tasks';
      //insert arr right before the last element of the tasks list in grunt's config object
      var list = grunt.config.get(prop);
      list.splice.apply(list,[list.length-1,0].concat(arr));
      grunt.config.set(prop, list);
    }
    var task = tasks.join(':');
    grunt.task.run(task);
  });

  //modify grunt's config to add connect and open tasks that have port numbers that increment up by 'count'
  var addEntryToConfig = function(baseTaskName, count) {
    var connect = grunt.config.get('connect');
    var open = grunt.config.get('open');

    var connectsub = connect[baseTaskName+count] = grunt.util._.clone(connect[baseTaskName],true);
    var opensub = open[baseTaskName+count] = grunt.util._.clone(open[baseTaskName],true);

    var port = parseInt(connect.addclient.options.port,10)+count;
    connectsub.options.port = port;
    opensub.path = opensub.path.replace(/:\d{1,5}/g, ':'+port);
    grunt.config.set('connect', connect);
    grunt.config.set('open', open);
  };

  /*
  Launch another client instance.
  Takes an argument, which specifies that this is the nth client instance; this determines port #
  */
  grunt.registerTask('addclient', 'Launch another client.', function(n) {
    addEntryToConfig(this.name,parseInt(n,10));
    grunt.task.run('open:addclient'+n);
    grunt.task.run('connect:addclient'+n);
  });

  grunt.registerTask('client', [
    'connect:client',
    'open:client',
    'watch:client'
  ]);
  grunt.registerTask('server', [
    'exec:mongod',
    'nodemon:dev'
  ]);
  grunt.registerTask('server:debug', [
    'concurrent:debug'
  ]);
  //simplemocha is for server tests
  grunt.registerTask('server:unit', [
    'simplemocha'
  ]);
  //karma is for client tests
  grunt.registerTask('client:unit', [
    'karma:unit'
  ]);
  grunt.registerTask('e2e', [
    'karma:e2e'
  ]);
  grunt.registerTask('cross', [
    'karma:cross'
  ]);
  grunt.registerTask('build', [

  ]);
};
