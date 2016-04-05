var Joi = require('joi')
var R = require('rethinkdb')

var Config = require('../config')
var Database = require('../database')


/*
	the subscriber has the
	responsibility to record their issued
	UUID

	it's the only way to
	put/delete stuff in their account
*/


module.exports = [
	{
		path: '/user',
		method: 'GET',
		config: {
			validate: {
				payload: {
					endpoint: Joi.string().required(),			//subscriber's selected endpoint. parametized urls are cool too "https://globunited.com/rssfeed/:rssid"
					passphrase: Joi.string().required(),			//subscriber needs to supply a key for crsspy to have write access
					screenname: Joi.string().required(),
				}
			}
		},
		handler: function (request, reply) {
			reply()
		}
	},
]