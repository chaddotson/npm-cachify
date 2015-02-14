/*jslint node: true */
(function () {
    'use strict';

    var parseArgs = require('minimist'),
        cachify = require('./cachify.js'),
        args = parseArgs(process.argv.splice(2));

    if (args._.length === 0) {
        usage();
    }

    cachify.cachify(args._, {cacheLocation:args.cache, includeDevDependencies: 'dev' in args});

    function usage() {
        console.log('usage: cachify [--cache <directory>] [--dev] package1 package2 package3');
        process.exit();
    }
})();
