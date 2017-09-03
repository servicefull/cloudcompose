'use strict';
const chalk = require('chalk');
const fs = require('fs-extra');

const log = (msg) => {
	return console.log(chalk.blue('clouseCompose') + ' :: ' + msg)
}

const err = (msg) => {
	return console.log(chalk.blue('clouseCompose') + ' :: error :: ' + msg)
}

module.exports = {
	log:log,
	err:err
}
