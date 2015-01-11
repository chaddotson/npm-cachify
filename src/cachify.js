"use strict";

var cachify = {};



exports = module.exports = cachify;



var npm = require("npm");
var fs = require("fs");
var path = require("path");



cachify.cachify = cachifyPackage;

function cachifyPackage(packages, options) {

    //console.log("packages to install:", packages);

    var _config = {};
    var _addedPackages = [];

    console.log("running...");


    if(options.cacheLocation) {
        _config.cache = options.cacheLocation;
    }

    var _includeDevDependencies = options.includeDevDepencencies || false;


    _load();

    function _load() {
        npm.load(_config, _processPackages);

    }

    function _processPackages() {
        packages.forEach(_addPackageToCache);
    }

    function _addPackageToCache(packageToAdd) {
        if(_addedPackages.indexOf(packageToAdd) > -1) {
            return;
        }

        console.log("caching: " + packageToAdd);

        _addedPackages.push(packageToAdd);

        npm.commands.cache.add(packageToAdd,null,null,false, _packageCached)
    }

    function _packageCached(a, packageInfo) {

        for(var dep in packageInfo.dependencies) {
            //console.log("key:" + key + " val:"+ packageInfo.dependencies[key]);
            _addPackageToCache(dep + "@" + packageInfo.dependencies[dep])
        }

        if(_includeDevDependencies) {
            for(var dep in packageInfo.devDependencies) {
                //console.log("key:" + key + " val:"+ packageInfo.dependencies[key]);
                _addPackageToCache(dep + "@" + packageInfo.devDependencies[dep])
            }
        }

        // _addRegistryEntry(packageInfo.name);
    }

    // function _addRegistryEntry(packageName) {
    //
    //     // var registry = path.join(_config.cache, "registry.npmjs.org");
    //     //
    //     // var packageDir = path.join(registry, packageName);
    //     //
    //     // if(!fs.existsSync(packageDir)) {
    //     //     fs.mkdirSync(packageDir);
    //     // }
    // }
}
