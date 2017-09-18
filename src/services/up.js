const path = require('path');
const childProcess = require('../utils/child-process');
const yaml = require('../utils/yaml');
const fileio = require('../utils/fileio');
const request = require('../utils/request');
const logger = require('../utils/logger');
const fs = require('fs-extra');

process.on('unhandledRejection', (reason) => {
	logger.err(reason);
});

module.exports = (_options,callback) => {
	'use strict';

	const options = _options || {};
	let serverlessYmlPath = null;
	let packageJson = [];
	let functionPaths = [];
	let functionCode = [];
	let serviceObj = {
		'method':'up',
		'token':null,
		'yml':null,
		'readme':null,
		'keywords':null,
		'description':null,
		'packageJson':null
	}

	const validate = () => {
		if(!options.path) options.path = process.cwd();
		logger.log('Starting UP in '+options.path);
		if(!options.token) {
			callback('Access token not found');
		} else {
			serviceObj.token = options.token
		}
		return Promise.resolve();
	};

	const searchFunctionPathsArray = (filePath) => {
		for (var i = 0; i < functionPaths.length; i++) {
			if (functionPaths[i].name === filePath) {
				return functionPaths[i];
			}
		}
		return false;
	};

	const constructFunctionObj = (functions) => {
		return new Promise((resolve,reject) => {
			let obj = {};
			for (var key in functions) {
				if (!functions.hasOwnProperty(key)) continue;
				const fnc = functions[key];
				const p = fnc.handler.split('.');
				const fname = p[0]+'.js';
				const fpath = path.join(options.path,fname);
				const existsPath = searchFunctionPathsArray(fname);
				if(!existsPath) {
					functionPaths.push({
						"name":fname,
						"path":fpath
					});
				}
			}
			resolve();
		})
	};

	const loadFunctionCode = () => {
		return new Promise((resolve,reject) => {
			if(functionPaths.length > 0) {
				const mgr = () => {
					if(functionPaths.length < 1) {
						resolve();
					} else {
						const funcObj = functionPaths.pop();
						const readOptions = {
							'path':funcObj.path,
							'config':{
								encoding:'utf8'
							}
						}
						fileio.readFile(readOptions).then((data) => {
							functionCode.push({title:funcObj.name,code:JSON.stringify(data)});
							return mgr();
						})

					}
				} // end mgr()
				mgr();
			} else { //end if functionPaths.length > 0
				resolve();
			}
		})
	}

	//
	validate()

		// Search for ReadMe
		.then(() => {
			logger.log('Search for README.md');
			return fileio.pathExists({
				"path":path.join(options.path,"README.md")
			});
		})

		// Read readme.md
		.then((exists) => {
			if(exists) {
				logger.log('Found README.md');
				return fileio.readFile({
					'path':path.join(options.path,"README.md"),
					'config':{
						encoding:'utf8'
					}
				});
			} else {
				return Promise.resolve(null);
			}
		})

		// Write readme and then get packagejson
		.then((readme) => {
			if(readme) {
				serviceObj.readme = JSON.stringify(readme);
			}

			// Search for packagejson
			logger.log('Search for package.json');
			return fileio.pathExists({
				"path":path.join(options.path,"package.json")
			});
		})

		// Read packagejson
		.then((exists) => {
			if(exists) {
				logger.log('Found package.json');
				return fileio.readFile({
					'path':path.join(options.path,"package.json"),
					'config':{
						encoding:'utf8'
					}
				});
			} else {
				return Promise.resolve(null);
			}
		})

		// Set packageJson and then get serverless yml
		.then((data) => {
			if(data) {
				serviceObj.packageJson = data;
				packageJson = JSON.parse(data);
				if(packageJson.keywords) {
					serviceObj.keywords = packageJson.keywords;
				}
				if(packageJson.description) {
					serviceObj.description = packageJson.description;
				}
			}

			logger.log('Search for serverless.yml');
			serverlessYmlPath = path.join(options.path,'serverless.yml');
			return fileio.pathExists({
				"path":serverlessYmlPath
			});
		})

		.then((exists) => {
			if(exists) {
				return yaml.load(serverlessYmlPath);
			} else {
				callback('Unable to find a valid serverless.yml file in ' + options.path);
			}
		})

		// Get function file info
		.then((yml) => {
			if (!yml) {
				callback('Unable to load the serverless.yml');
			} else {
				logger.log('Processing serverless.yml');
				// Delete custom vars and plugins
				if(yml.custom) delete yml.custom;
				if(yml.plugins) delete yml.plugins;
				serviceObj.yml = yml;
				return constructFunctionObj(yml.functions);
			}
		})

		// Read service code
		.then(() => {
			logger.log('Processing Service');
			return loadFunctionCode();
		})

		// Package serverless service
		.then(() => {
			serviceObj['functions'] = functionCode;
			return childProcess({
				'title':'serverlessBuild',
				'process':'serverless package',
				'cwd':options.path,
			});
		})

		// Post to lambda
		.then((response) => {
			logger.log('Sending Service to cloudCompose');
			return request({
				method: 'POST',
				url: 'https://nrlxmcfyll.execute-api.us-east-1.amazonaws.com/prod/up',
				headers: {
					'cache-control': 'no-cache',
					'content-Type': 'application/json'
				},
				json: true,
				body: serviceObj
			},(err) => {
				callback('Unable to send service to cloudCompose.  Please check that your access key is entered correctly by running cloudCompose init');
			});
		})

		// Finish up
		.then((url) => {
			if((url)) {
				logger.log('Your service URL is located here: https://cloudcompose.io/service/'+url);
			}
			return callback(null,'Up Complete!');
		});
}
