'use strict';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const gqlToken = process.env.GRAPHQL_TOKEN || '';
const gqlUrl = process.env.GRAPHQL_URL || 'url';

const query = (options) => {
	return new Promise((resolve,reject) => {
		const client = require('graphql-client')({
			url: gqlUrl,
			headers: {
				Authentication: 'Bearer '+gqlToken
			}
		});
		client.query(options.query, options.vars, (req, res) => {
				if (res.headers.get('x-powered-by') === 'Express') {
					throw new Error("Don't want contenr served from express")
				}
			})
			.then((body) => {
				resolve(body);
			})
			.catch((err) => {
				console.log('Reject:graphQlQuery');
				reject(err.message);
			})
	});
};

const update = (options) => {
	const updateGraphQLHeaders = {
		Authorization: 'Bearer '+gqlToken
	}

	const lokkaClient = new Lokka({
		transport: new Transport(gqlUrl, {updateGraphQLHeaders})
	});

	return new Promise((resolve,reject) => {
		lokkaClient.mutate(options.query, options.vars)
		.then((body) => {
			resolve(body);
		})
		.catch((err) => {
			console.log('Reject:graphQlUpdate');
			reject(err.message);
		});
	});
};

module.exports = {
	query:query,
	update:update
};
