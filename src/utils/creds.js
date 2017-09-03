'use strict';

const path = require('path');
const homedir = require('os').homedir();
const fileio = require('./fileio');
const CREDFILE = '.cloudcompose';
const CREDPATH = path.join(homedir, CREDFILE);

module.exports = {
	read: () => {
		return fileio.ensureFile({
				'path': CREDPATH
			})
			.then(() => {
				return fileio.readFile({
					'path':CREDPATH,
					'config':{
						encoding:'utf8'
					}
				})
			})
	},

  write: (token) => {
    return fileio.writeFile({
			'path':CREDPATH,
			'body':token,
			'encoding':'utf8'
		})
  }
};
