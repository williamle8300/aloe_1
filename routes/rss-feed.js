var Joi = require('joi')
var R = require('rethinkdb')

var Config = require('../config')
var Database = require('../database')


module.exports = [
	{
		path: '/rss-feed',
		method: 'POST',
		config: {
      validate: {
        payload: {
          rssFeedUrl: Joi.string().required(),
        }
			}
		},
		handler: function (request, reply) {
			
		 	var rssFeedId = encodeURIComponent(request.payload.rssFeedUrl)
			var rssFeedUrl = encodeURI(request.payload.rssFeedUrl)
			
			Database.connect(function (err, connection) {

				if (err) {
					throw err
				}

				R.table('rss_feed')
					.get(rssFeedId)
					.run(connection, function (err, result) {
						
						if (err) {
							throw err
						}

						reply(result)
					})
			})
		}
	},
	{
		path: '/rss-feed',
		method: 'GET',
		handler: function (request, reply) {
			
			Database.connect(function (err, connection) {
				
				if (err) {
					throw err
				}
				
				R.table('rss_feed')
					.run(connection, function (err, cursor) {

						if (err) {
							throw err
						}
						
						cursor.toArray(function (err, results) {
							reply(results)
						})
					})
			})
		}
	},
	{
		path: '/rss-feed/{id}',
		method: 'GET',
		config: {
			validate: {
				params: {
					id: Joi.string().required()
				}
			}
		},
		handler: function (request, reply) {
			
			var id = request.params.id
			
			Database.connect(function (err, connection) {
				
				R.table('rss_feed')
					.get(id)
					.run(connection, function (err, rssFeed) {
						
						if (err) {
							throw err
						}
						
						reply(rssFeed)
					})
			})
		}
	},
	{
		path: '/rss-feed',
		method: 'DELETE',
		config: {
			validate: {
				payload: {
					url: Joi.string().required()
				}
			}
		},
		handler: function (request, reply) {
			
			reply(':<')
			//Database.connect(function (err, connection) {
			//	
			//	if (err) {
			//		throw err
			//	}
			//	
			//	R.table('rss_feed')
			//		.get(rssFeedId)
			//		.delete()
			//		.run(connection, function (err, result) {
			//			
			//			if (err) {
			//				throw err
			//			}
			//			
			//			reply(result)
			//		})
			//})
		}
	},
]