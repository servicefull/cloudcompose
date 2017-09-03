const path = require('path');
const childProcess = require('../utils/child-process');
const yaml = require('../utils/yaml');
const fileio = require('../utils/fileio');
const request = require('../utils/request');

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
		'description':null
	}

	const validate = () => {
		return new Promise((_, reject) => {
			if(!options.path) {
				reject(new Error('Please specify a valid path to your service'));
			}
			if(!options.token) {
				reject(new Error('Please specify a valid access token'));
			} else {
				serviceObj.token = options.token;
				return;
			}
		})
		.catch(error => {
			console.log('ERROR: '+error.message);
			return false;
		});
	};

	const searchForReadMe = () => {
		return new Promise((_, reject) => {
			if(!options.path) {
				reject(new Error('Please specify a valid path to your service'));
			}
			if(!options.token) {
				reject(new Error('Please specify a valid access token'));
			} else {
				serviceObj.token = options.token;
				return;
			}
		})
		.catch(error => {
			console.log('ERROR: '+error.message);
			return false;
		});
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
			console.log('cloudcompose:constructFunctionObj');
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
				let cnt = 0;
				const mgr = () => {
					if(cnt > functionPaths.length) {
						resolve();
					} else {
						const funcObj = functionPaths.pop();
						cnt++;

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

	const handleError = ((e) => {
		console.log('ERROR: '+e);
	});

	//
	validate()
		.catch(handleError('sup'))
		.then(fileio.pathExists({
			"path":path.join(options.path,"README.md")
		}))
		.catch(handleError('sup'));
		// .then(writeReadMe)
		// .then(searchForPackageJson)
		// .then(readPackageJson)
		// .then(setPackageJson)
		// .then(getServerlessYml)
		// .then(getFunctionFile)
		// .then(readServiceCode)
		// .then(packageServerlessService)
		// .then(postToLambda)
		// .then(finishUp);

		// Search for ReadMe
		// .then(() => {
			// return fileio.pathExists({
				// "path":path.join(options.path,"README.md")
			// });
		// })

		// .then(() => {
			// console.log('all good homey');
		// })
		//
		// // Read readme.md
		// .then((exists) => {
		// 	if(exists) {
		// 		return fileio.readFile({
		// 			'path':path.join(options.path,"README.md"),
		// 			'config':{
		// 				encoding:'utf8'
		// 			}
		// 		});
		// 	} else {
		// 		return Promise.resolve(null);
		// 	}
		// })
		//
		// // Write readme and then get packagejson
		// .then((readme) => {
		// 	if(readme) {
		// 		serviceObj.readme = JSON.stringify(readme);
		// 	}
		//
		// 	// Search for packagejson
		// 	return fileio.pathExists({
		// 		"path":path.join(options.path,"package.json")
		// 	});
		// })
		//
		// // Read packagejson
		// .then((exists) => {
		// 	if(exists) {
		// 		return fileio.readFile({
		// 			'path':path.join(options.path,"package.json"),
		// 			'config':{
		// 				encoding:'utf8'
		// 			}
		// 		});
		// 	} else {
		// 		return Promise.resolve(null);
		// 	}
		// })
		//
		// // Set packageJson and then get serverless yml
		// .then((data) => {
		// 	if(data) {
		// 		packageJson = JSON.parse(data);
		// 		if(packageJson.keywords) {
		// 			serviceObj.keywords = packageJson.keywords;
		// 		}
		// 		if(packageJson.description) {
		// 			serviceObj.description = packageJson.description;
		// 		}
		// 	}
		//
		// 	serverlessYmlPath = path.join(options.path,'serverless.yml');
		// 	return yaml.load(serverlessYmlPath);
		// })
		//
		// // Get function file info
		// .then((yml) => {
		// 	if (!yml) {
		// 		callback('Unable to find a valid serverless.yml file in ' + options.path);
		// 	} else {
		// 		// Delete custom vars and plugins
		// 		if(yml.custom) delete yml.custom;
		// 		if(yml.plugins) delete yml.plugins;
		// 		serviceObj.yml = yml;
		// 		return constructFunctionObj(yml.functions);
		// 	}
		// })
		//
		// // Read service code
		// .then(() => {
		// 	return loadFunctionCode();
		// })
		//
		// // Package serverless service
		// .then(() => {
		// 	serviceObj['functions'] = functionCode;
		// 	return childProcess({
		// 		'title':'serverlessBuild',
		// 		'process':'serverless package',
		// 		'cwd':options.path,
		// 	});
		// })
		//
		// // Post to lambda
		// .then((response) => {
		// 	console.log(response);
		// 	return request({
		// 		method: 'POST',
		// 		url: 'https://v9zjlp1anf.execute-api.us-east-1.amazonaws.com/dev/up',
		// 		headers: {
		// 			'cache-control': 'no-cache',
		// 			'content-Type': 'application/json'
		// 		},
		// 		json: true,
		// 		body: serviceObj
		// 	});
		// })
		//
		// // Finish up
		// .then((url) => {
		// 	if((url)) {
		// 		console.log(url);
		// 		console.log('CloudCompose :: Your service URL is located here:');
		// 		console.log('https://cloudcompose.io/service/'+url);
		// 	}
		// 	return callback('CloudCompose :: Up Complete!');
		// });
}
