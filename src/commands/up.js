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
			flags: {
        p: 'Specify a path to a service'
      },
      vflags: {
        'path': 'Specify a path to a service'
      }
    };
  }

  run(params, callback) {

    let path = process.cwd();
		if(params.vflags.path) {
			path = params.vflags.path
		} else if(params.flags.p) {
			path = params.flags.p
		}

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
				"path":path.toString(),
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
