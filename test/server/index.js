global._ = require('lodash');
global.spath = '../../server/';
//see http://chaijs.com/api/bdd/
global.expect = require('chai').expect;
global.io = require("socket.io-client");
global.mongoose = require("mongoose");
