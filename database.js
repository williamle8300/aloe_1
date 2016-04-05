var Async = require('async')
var R = require('rethinkdb')

var Config = require('./config')


module.exports = {

	init: function (callback) {			//init the database, and create tables
		
		Async.waterfall([
			this.connect,
			this.createDb,
			this.createTables
		], function (err, connection) {
			
			if (err) {
				callback(err)
			}
			
			console.log('database and tables are lookin\' good!')
			
			callback(null, connection)
		})
	},
		
	connect: function (callback) { 			//helper function to easily connect to rethinkdb
		
	  R.connect({
			host: Config.rethink.host,
			port: Config.rethink.port,
		}, function (err, connection) {
			
			if (err) {
				callback(err)
			}
			
	    connection['_id'] = Math.floor(Math.random()*10001)		//create a unique pid
			
			console.log('new database connection established at:', connection._id)

			R.dbList().contains(Config.rethink.db).run(connection, function (err, doesExist) {

				if (err) {
					callback(err)
				}
				
				if (doesExist) {
					connection.use(Config.rethink.db)			//sets the default db for duration of connection
				}

		    callback(null, connection)
			})
	  })
	},
	
	createDb: function (connection, callback) {
		
		R.dbList().contains(Config.rethink.db).run(connection, function (err, doesExist) {
			
			if (err) {
				callback(err)
			}
		
			if (doesExist) {
	  
				console.log('database already exists:', Config.rethink.db)
				
				connection.use(Config.rethink.db)
				
				callback(null, connection)
			}
			else {
			
			  R.dbCreate(Config.rethink.db).run(connection, function (err, result) {

		      if (err) {
						callback(err)
		      }
					
					console.log('a new database created:', Config.rethink.db)
					
					connection.use(Config.rethink.db)
					
					callback(null, connection)
		    })
			}
		})
	},
	
	createTables: function (connection, callback) {
		
		var i = 0
		var tablesLength = Object.keys(Config.rethink.tables).length
		
    for (var table in Config.rethink.tables) {

			(function(table) {
			
				R.tableList().contains(table).run(connection, function (err, doesExist) {
				
					if (doesExist) {
						console.log('table already exists:', table)
					}
					
					else {

		        R.tableCreate(table, {primaryKey: Config.rethink.tables[table]}).run(connection, function(err, result) {
						
							if (err) {
								callback(err)
							}
						
		          console.log('table created:', table)
		        })
					}
					
					i++

					if (i === tablesLength) {
						callback(null, connection)
					}
				})
			}(table))
    }
	}
}