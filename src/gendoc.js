#!/usr/bin/env node
const glob = require('glob');
require('shelljs/global');


const fileList = process.argv.slice(2);
for (var i = 0, ii = fileList.length; i < ii; i++) {
	var folders = glob.sync(fileList[i]);
	if (!folders[0])
		continue;
	var folder = folders[0].split('/').shift();
	var folderName = (folder === '.')? 'API': folder;
	ShellString(`## ${folderName}\n`).to(folder + '/readme.md')
	exec(`node node_modules/.bin/jasmine ${fileList[i]} --helper="${__dirname}/gendoc_reporter.js"`, { silent: true })
		.toEnd(folder + '/readme.md');
}
