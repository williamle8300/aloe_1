var Good = require('good')
var GoodConsole = require('good-console')
var Hapi = require('hapi')
var R = require('rethinkdb')

var Config = require('./config')
var Database = require('./database')

var RssFeedRoutes = require('./routes/rss-feed')
var UserRoutes = require('./routes/user')

var server = new Hapi.Server()

server.connection({
	host: Config.server.host,
	port: Config.server.port,
	routes: {cors: true}
})

server.register([{
	register: Good,
	options: {
		reporters: [{
			reporter: GoodConsole,
			events: {
				response: '*',
				log: '*'
			}
		}]
	}
}], function (err) {
		
	if (err) {
		throw err
	}

	server.route(RssFeedRoutes)
	// server.route(UserRoutes)
	
	Database.init(function (err, connection) {
		
		if (err) {
			throw err
		}
		
		server.start(function () {
			console.log('Server running at: ' +server.info.uri)
		})	
	})
})