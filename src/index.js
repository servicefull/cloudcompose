'use strict';

const up = require('./services/up');
const build = require('./services/build');

const _up = (options,callback) => {
	return up(options,callback);
}

const _build = (options,callback) => {
	return build(options,callback);
}

module.exports = {
	up:_up,
	build:_build
}
