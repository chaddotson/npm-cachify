var parseArgs = require("minimist");

var cachify = require("./cachify.js");


var args = parseArgs(process.argv.splice(2));
//console.log("args", args);

if( args._.length == 0) {
    usage();
}


//console.log(args);
cachify.cachify(args._, {cacheLocation:args.cache, includeDevDepencies: false});



function usage() {
    console.log("usage: cachify [--cache <directory>] package1 package2 package3")
    process.exit()
}
