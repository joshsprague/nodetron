// Karma configuration
// Generated on Tue Jun 25 2013 11:24:53 GMT-0700 (PDT)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  'client/components/socket.io-client/dist/socket.io.min.js/',
  'client/components/node-uuid/uuid.js',
  'client/components/q/q.min.js',
  'http://axemclion.github.com/IndexedDBShim/dist/IndexedDBShim.min.js',

  MOCHA,
  MOCHA_ADAPTER,
  'node_modules/chai/chai.js',
  'test/setup.js',
  {pattern: 'client/index.html', included:false},
  'client/**/*.js',
  'test/client/e2e/{,*/}*.js'
];

// list of files to exclude
exclude = [
  'components'
];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
