'use strict';

const fs = require('fs-extra');

const ensureFile = (options) => {
	return new Promise((resolve,reject) => {
		fs.ensureFile(options.path)
			.then(() => {
				resolve('success');
			})
			.catch(err => {
				console.log('Reject:ensureFile');
				reject(err);
			})
	})
}

const ensureDir = (options) => {
	return new Promise((resolve,reject) => {
		fs.ensureDir(options.path)
			.then(() => {
				resolve('success');
			})
			.catch(err => {
				console.log('Reject:ensureDir');
				reject(err);
			})
	})
}

const emptyDir = (options) => {
	return new Promise((resolve,reject) => {
		fs.emptyDir(options.path)
			.then(() => {
				resolve('success');
			})
			.catch(err => {
				console.log('Reject:emptyDir');
				reject(err);
			})
	})
}

const readFile = (options) => {
	const config = options.config || {}
	return new Promise((resolve,reject) => {
		fs.readFile(options.path,config)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				console.log('Reject:readFile');
				reject(err);
			})
	})
}

const pathExists = (options) => {
	return new Promise((resolve,reject) => {
		fs.pathExists(options.path)
			.then((exists) => {
				resolve(exists);
			})
			.catch(err => {
				console.log('Reject:pathExists');
				reject(err);
			})
	})
}


const writeFile = (options) => {
	return new Promise((resolve,reject) => {
		fs.writeFile(options.path,options.body,options.encoding)
			.then(() => {
				resolve('success');
			})
			.catch(err => {
				console.log('Reject:writeFile');
				reject(err);
			})
	})
}

module.exports = {
	ensureFile:ensureFile,
	ensureDir:ensureDir,
	emptyDir:emptyDir,
	readFile:readFile,
	pathExists:pathExists,
	writeFile:writeFile
}
