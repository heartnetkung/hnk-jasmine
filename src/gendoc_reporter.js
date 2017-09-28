require('./co')();

var str = '';
var tab = 0;

const oldWrite = process.stdout.write;
process.stdout.write = function() {};

const appendSpace = function(tab) {
	var ans = '';
	for (var i = 0; i < tab; i++)
		ans += '    ';
	return ans;
};
jasmine.getEnv().addReporter({
	suiteStarted: function(result) {
		if (result.description === result.fullName)
			tab = 0;
		else if (tab === 0)
			tab++;
		str += `\n${appendSpace(tab)}${result.description}\n`;
	},
	specDone: function(result) {
		str += `${appendSpace(tab+1)}|${result.description}\n`;
	}
});
afterAll(function() {
	oldWrite.call(process.stdout, '```js' + str + '\n```');
});
