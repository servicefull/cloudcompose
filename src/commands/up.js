'use strict';

const Command = require('cmnd').Command;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const Services = require('../index.js');
const Creds = require('../utils/creds.js');
const logger = require('../utils/logger.js');

let USER_ACCESS_TOKEN = '';

class UpCmd extends Command {

  constructor() {
    super('up');
  }

  help() {
    return {
      description: 'Deploys a service to the cloudCompose registry',
      args: [
        'path'
      ]
    };
  }

  run(params, callback) {

    let path = params.args[0];

    // if (!path) {
			// return callback(new Error('Please specify a deployment path to a directory with a serverless.yml'));
    // }

		Creds.read().then((data) => {
			if (!data) {
				console.log();
	      console.log(chalk.bold.red('Oops!'));
	      console.log();
	      console.log(`You must have a token to run this command`);
	      console.log();
	      console.log(`Use ${chalk.bold('cloudcompose init')} to initialize.`);
	      console.log();
	      return callback(null);
			}

			USER_ACCESS_TOKEN = data;

			Services.up({
				"path":path,
				"token":USER_ACCESS_TOKEN
			},(err,results) => {
				if(err) {
					logger.log(err)
				} else {
					logger.log(results)
				}
				process.exit()
			});

		})

  }

}

module.exports = UpCmd;
