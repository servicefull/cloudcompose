'use strict';

const request = require('request-promise');

module.exports = (options,callback) => {
	return new Promise((resolve,reject) => {
		request(options)
			.then((body) => {
				resolve(body);
			})
			.catch(err => {
				callback(err);
			});
	})
}
