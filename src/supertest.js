const { agent } = require('supertest');


function Macro() {
	var $this = this;
	this.latestError = null;
	this.middleware = function*(next) {
		try {
			yield next;
			$this.latestError = null;
		} catch (e) {
			$this.latestError = e;
			throw e;
		}
	};
};


module.exports = Macro;


Macro.prototype.agent = function( /*redirect*/ ) {
	return this.req = agent.apply(null, arguments);
};


Macro.prototype.GET = function*(url, error) {
	var ans = yield expect(this, this.req.get(url), error);
	return makeOutput(ans);
};


Macro.prototype.POST = function*(url, send, error) {
	if (send instanceof Array)
		send = send[0];
	if (send)
		var ans = yield expect(this, this.req.post(url).send(send), error);
	else
		var ans = yield expect(this, this.req.post(url), error);
	return makeOutput(ans);
};


Macro.prototype.PUT = function*(url, send, error) {
	if (send instanceof Array)
		send = send[0];
	if (send)
		var ans = yield expect(this, this.req.put(url).send(send), error);
	else
		var ans = yield expect(this, this.req.put(url), error);
	return makeOutput(ans);
};


Macro.prototype.DELETE = function*(url, send, error) {
	if (send instanceof Array)
		send = send[0];
	if (send)
		var ans = yield expect(this, this.req.delete(url).send(send), error);
	else
		var ans = yield expect(this, this.req.delete(url), error);
	return makeOutput(ans);
};


const expect = function(runner, req, error) {
	return req.expect(function(res) {
		var httpCode = 400;
		if (error === undefined)
			httpCode = 200;
		else if (typeof error === 'number')
			httpCode = error;

		var text = res.text && res.text.replace(/\r?\n/g, ' ').replace(/  /g, '') || '';

		if (res.statusCode !== httpCode) {
			if (runner.latestError)
				console.log(runner.latestError);
			throw new Error(`expected ${httpCode}, got ${res.statusCode} ${text}`);
		}

		if (error instanceof RegExp && !error.test(res.text)) {
			if (runner.latestError)
				console.log(runner.latestError);
			throw new Error(`expected ${text}, to match ${error}`);
		}
	});
};


const makeOutput = function(httpOut) {
	var hasBody = false;
	for (var x in httpOut.body) {
		hasBody = true;
		break;
	}
	return httpOut[hasBody ? 'body' : 'text'];
};
