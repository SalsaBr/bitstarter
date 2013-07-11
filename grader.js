#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var cli = require('commander');
var cheerio = require('cheerio');

var HTML_FILE_DEFAULT = "index.html";
var CHECKS_FILE_DEFAULT = "checks.json";

var assertFileExists = function(inFile) {
    var instr = inFile.toString();
    if (!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting", instr);
        process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlFile) {
    return cheerio.load(fs.readFileSync(htmlFile));
};

var loadChecks = function(checksFile) {
    return JSON.parse(fs.readFileSync(checksFile));
};

var checkHtmlFile = function(htmlFile, checksFile) {
    $ = cheerioHtmlFile(htmlFile);
    var checks = loadChecks(checksFile);
    var out = {};

    for(var index in checks) {
        var present = $(checks[index]).length > 0;
        out[checks[index]] = present;
    }

    return out;
};

var clone = function(fn) {
    //Workarounf for commandr.js issue
    //http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    cli
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKS_FILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTML_FILE_DEFAULT)
        .parse(process.argv);

    var checkJson = checkHtmlFile(cli.file, cli.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
