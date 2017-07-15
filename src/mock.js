const slice = Array.prototype.slice;
const instances = [];
const noop = function() {};

module.exports = function(db) {
	if (db.mock)
		return;
	var map = {};
	var isClosed = false;
	var toClose = [];
	instances.push(db);

	db.mock = function(collectionName, inserts) {
		if (isClosed)
			throw new Error('already closed');

		var randomSuffix = '_RANDOMSUFFIX' + Math.floor(Math.random() * 100000000);
		var name = collectionName + randomSuffix;
		map[collectionName] = name;
		toClose.push(name);

		var insertArray = slice.call(arguments, 1);
		var got = db.get(name);
		for (var i = 0, ii = insertArray.length; i < ii; i++)
			got.cast(insertArray[i]);

		if (!insertArray.length)
			return Promise.resolve(null);
		return got.insert(insertArray);
	};

	const originalGet = db.get;
	db.get = function(collectionName) {
		return originalGet.call(db, map[collectionName] || collectionName);
	};

	const originalClose = db.close;
	db.close = function(cb) {
		if (isClosed)
			return;
		isClosed = true;

		var queue = [];
		toClose.forEach((collectionName) =>
			queue.push(originalGet.call(db, collectionName).drop())
		);
		return Promise.all(queue).then(() => originalClose.call(db, cb), noop);
	};

	return db;
};

exports.exitHandler = function() {
	var queue = [];
	instances.forEach((db) => queue.push(db.close()));
	return promise.all(queue);
};