var DB = function (opts) {
	var self = this;
	self.init(opts)
};

DB.prototype.init = function (settings) {
	var self = this;
	var mysql = require('mysql');
	self.promise = require('promise');
	self.pool = mysql.createPool(settings);
};

DB.prototype.escape = function (str) {
	var self = this;
	return self.pool.escape(str);
};

DB.prototype.getConnection = function () {
	var self = this;
	return new self.promise(function (resolve, reject) {
		self.pool.getConnection(function (err, connection) {
			if (err) {
				reject(err);
			} else {
				resolve(connection);
			}
		});
	});
};

DB.prototype.sql = function (query) {
	var self = this;
	return new self.promise(function (resolve, reject) {
		self.getConnection()
			.then(function (connection) {
				connection.query(query, function (err, rows) {
					connection.destroy();
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				});
			})
			.then(null, function (err) {
				reject(err);
			});
	});
};

module.exports = function (opts) {
	if (!opts) { return; }
	return new DB(opts);
};
