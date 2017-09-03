'use strict';

const Command = require('cmnd').Command;
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const Creds = require('../utils/creds.js');

class InitCommand extends Command {

  constructor() {

    super('init');

  }

  help() {

    return {
      description: 'Initializes cloudCompose',
      flags: {
        f: 'Force command to overwrite existing token'
      },
      vflags: {
        'force': 'Force command to overwrite existing token'
      }
    };

  }

  run(params, callback) {

    let force = params.flags.hasOwnProperty('f') || params.vflags.hasOwnProperty('force');
		let credExists = false;

		Creds.read().then((data) => {
			credExists = data;

			if (!force && credExists) {
	      console.log();
	      console.log(chalk.bold.red('Oops!'));
	      console.log();
	      console.log(`A token already exists for this user.`);
	      console.log();
	      console.log(`Use ${chalk.bold('cloudcompose init --force')} to override.`);
	      console.log();
	      return callback(null);
	    }

			console.log();
	    console.log(chalk.bold.green('Welcome to cloudCompose! :)'))
	    console.log();
	    console.log(`To use the ${chalk.bold('cloudcompose')} registry, you must have a cloudCompose account.`);
	    console.log(`It will allow you to push your services to the registry.`);
			console.log(`But first, you need an access token.`);
	    console.log(`It\'s ${chalk.bold.underline.green('free')} to create an account at http://cloudcompose.io.`);
	    console.log();
	    console.log(`Please enter your access token.`);
	    console.log();

	    let questions = [];

	    questions.push({
	      name: 'accessKey',
	      type: 'input',
	      default: '',
	      message: 'Access Key'
	    });

	    inquirer.prompt(questions).then((promptResult) => {
				if(promptResult.accessKey) {
					Creds.write(promptResult.accessKey).then(() => {
						console.log();
						console.log(`${chalk.bold.green('Nice')}`);
						console.log(`You're all set.`);
						console.log();
					});
				} else {
					console.log();
					console.log(`Oops, you didn't and an access key.`);
					console.log(`Try running init again.`);
					console.log();
				}
			})

		});

  }

}

module.exports = InitCommand;
