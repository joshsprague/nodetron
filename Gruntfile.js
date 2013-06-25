module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'server/app.js'
      }
    },
    regarde: {
      js: {
        files: [
          'server/{,*/}*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
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
    }
  });
  grunt.registerTask('delayed-livereload', 'delayed livereload', function () {
    var done = this.async();
    setTimeout(function () {
      grunt.task.run('livereload');
      done();
    }, 500);
  });

  grunt.registerTask('server', [
    'livereload-start',
    'develop',
    'regarde'
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
