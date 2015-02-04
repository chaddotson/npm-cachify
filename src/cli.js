/*jslint node: true */
(function () {
    'use strict';

    var parseArgs = require('minimist');
    var cachify = require('./cachify.js');
    var args = parseArgs(process.argv.splice(2));

    //console.log('args', args);

    if (args._.length === 0) {
        usage();
    }

    cachify.cachify(args._, {cacheLocation:args.cache, includeDevDependencies: 'dev' in args});

    function usage() {
        console.log('usage: cachify [--cache <directory>] [--dev] package1 package2 package3');
        process.exit();
    }
})();
