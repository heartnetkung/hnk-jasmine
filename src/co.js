const co = require('co');
const noop = function() {};

module.exports = function() {
	const originalIt = global.it;
	global.it = function(description, run, timeout) {
		run = run || noop;

		if (run.constructor.name !== 'GeneratorFunction')
			return originalIt(description, run, timeout);

		return originalIt(description, function(done) {
			co(run).then(done, done.fail);
		}, timeout);
	};
};
