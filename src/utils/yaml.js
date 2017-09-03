'use strict';

const fs = require('fs-extra');
const YAML = require('yamljs');
const fileio = require('./fileio');

const load = (path) => {
	return new Promise((resolve, reject) => {
		fileio.ensureFile({
				"path": path
			})
			.then(() => {
				return resolve(YAML.load(path));
			});
	})
}

const stringify = (yml,unit) => {
	return YAML.stringify(yml, unit);
}

module.exports = {
	load: load,
	stringify: stringify
}
