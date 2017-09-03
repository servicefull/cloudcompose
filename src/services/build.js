'use strict'

const path = require('path');
const YAML = require('yamljs');
const fileio = require('../utils/fileio');
const graphql = require('../utils/graphql');
const childProcess = require('../utils/child-process');
const logger = require('../utils/logger');

module.exports = (options, callback) => {

	const payload = options;

	//
	const props = {
		'dir': {
			'deploy':''
		}
	};

	//
	let serverlessYml = false;
	let functionAsset = {};
	let userAsset = {};
	let packageOptions = {};
	let deployOptions = {};
	let envfile = [];
	let functions = []

	//
	const gqlQuery = `query($serviceId: ID!, $authorId: ID!) {
		Service(id: $serviceId) {
			title
			serverlessYml
			functions {
        id
        title
        code
      }
		}
		User(id: $authorId) {
			awsAccessKeyId
			awsRegion
			awsSecretAccessKey
			token {
				token
			}
		}
	}`;

	//
	const mutationQuery = `($deploymentId: ID!,$status: String,$log: String){
		updateDeployment(id:$deploymentId,status:$status,log:$log) {
			id
		}
	}`;

	// Validate options
	const validate = () => {
		logger.log('validate');
		if(!payload.data) {
			return Promise.reject('Deployment data does not exist');
		} else {
			props.dir.deploy = 'deployments/'+payload.data.Deployment.node.id;
		}
		return Promise.resolve();
	}

	// Write function files
	const writeFunctionFiles = () => {
		logger.log('writeFunctionFiles');
		return new Promise((resolve,reject) => {
			if(functions.length > 0) {
				let cnt = 0;
				const mgr = () => {
					if(cnt > functions.length) {
						resolve();
					} else {
						const funcObj = functions.pop();
						cnt++;

						const writeOptions = {
							'path':path.join(props.dir.deploy,funcObj.title),
							'body':JSON.parse(funcObj.code),
							'encoding':'utf8'
						}

						fileio.writeFile(writeOptions).then((data) => {
							return mgr();
						})
					}
				} // end mgr()
				mgr();
			} else { //end if functionPaths.length > 0
				resolve();
			}
		})
	};

	//
	return validate()

		// Ensure deployment directory
		.then(() => {
			logger.log('Ensure deployment directory');
			return fileio.ensureDir({
				"path":props.dir.deploy
			})
		})

		// Empty deployment directory
		.then(() => {
			logger.log('Empty deployment directory');
			return fileio.emptyDir({
				"path":props.dir.deploy
			})
		})

		// Read from GraphQL
		.then(() => {
			logger.log('Read from GraphQL');
			return graphql.query({
				'query':gqlQuery,
				'vars':{
					serviceId:payload.data.Deployment.node.service.id,
					authorId:payload.data.Deployment.node.author.id
				}
			})
		})

		// Write functions
		.then((body) => {
			logger.log('Write functions');
			functionAsset = body.data.Service;
			userAsset = body.data.User;
			serverlessYml = YAML.parse(functionAsset.serverlessYml);
			functions = body.data.Service.functions;
			return writeFunctionFiles();
		})

		// Write serverless.yml
		.then((body) => {
			logger.log('Write serverless.yml');
			if(body.data.User.awsRegion) serverlessYml.provider['region'] = body.data.User.awsRegion;
			const y = YAML.stringify(serverlessYml,4);
			return fileio.writeFile({
				'path':path.join(props.dir.deploy,'serverless.yml'),
				'body':y,
				'encoding':'utf8'
			})
		})

		// Set AWS credentials
		.then(() => {
			logger.log('Set AWS credentials');
			const cmdstring = 'serverless config credentials --profile ' + userAsset.token.token + ' --provider aws --key '+userAsset.awsAccessKeyId+' --secret '+userAsset.awsSecretAccessKey;
			return childProcess({
				'title':'serverlessAwsCreds',
				'process':cmdstring,
				'cwd':props.dir.deploy
			});
		})

		// Deploy package
		.then(() => {
			logger.log('Deploy package');
			const cmdstring = 'serverless deploy';
			return childProcess({
				'title':'serverlessDeploy',
				'process':cmdstring,
				'cwd':props.dir.deploy
			});
		})

		// Update GraphQL
		.then((serverlessLog) => {
			logger.log('Update GraphQL');
			return graphql.update({
				'query':mutationQuery,
				'vars':{
					'deploymentId':payload.data.Deployment.node.id,
					'status':"complete",
					'log':serverlessLog
				}
			})
		})

		// Finish Up
		.then((body) => {
			logger.log('Finish Up');
			callback(body);
		})
}
