'use strict';

const up = require('./services/up');

const _up = (options,callback) => {
	return up(options,callback);
}

module.exports = {
	up:_up
}
