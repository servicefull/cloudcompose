'use strict';

const exec = require('child-process-promise').exec;

module.exports = (options) => {
	let title = options.title || '';
	let cwd = {};
	if(options.cwd) cwd['cwd'] = options.cwd;

	return new Promise((resolve,reject) => {
		exec(options.process,cwd)
			.then((result) => {
				return resolve(result.stdout);
			})
			.catch((err) => {
				return reject(err)
			});
	})
}
