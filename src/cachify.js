/*jslint node: true */
(function () {
    'use strict';

    var cachify = {};

    exports = module.exports = cachify;

    cachify.cachify = function (packages, options) {
        options = options || {};

        var _config = {};
        var _addedPackages = [];
        var _includeDevDependencies = options.includeDevDependencies || false;
        var _npm = options.npm || require('npm');

        if(options.cacheLocation) {
            _config.cache = options.cacheLocation;
        }

        _load();

        function _load() {
            _npm.load(_config, _processPackages);
        }

        function _processPackages() {
            packages.forEach(_addPackageToCache);
        }

        function _addPackageToCache(packageToAdd) {
            if (_addedPackages.indexOf(packageToAdd) > -1) {
                return;
            }
            //console.log('caching: ' + packageToAdd);
            _addedPackages.push(packageToAdd);
            _npm.commands.cache.add(packageToAdd, null, null, false, _packageCached);
        }

        function _packageCached(a, packageInfo) {
            if (!packageInfo) {
                return;
            }

            var dep;
            if (packageInfo.dependencies) {
                //console.log('Adding dependencies...', packageInfo.dependencies);
                for (dep in packageInfo.dependencies) {
                    if (packageInfo.dependencies.hasOwnProperty(dep)) {
                        //console.log('key:' + key + ' val:'+ packageInfo.dependencies[key]);
                        _addPackageToCache(dep + '@' + packageInfo.dependencies[dep]);
                    }
                }
            }

            if (packageInfo.devDependencies && _includeDevDependencies) {
                for (dep in packageInfo.devDependencies) {
                    if (packageInfo.devDependencies.hasOwnProperty(dep)) {
                        //console.log('dep:' + key + ' val:'+ packageInfo.dependencies[key]);
                        _addPackageToCache(dep + '@' + packageInfo.devDependencies[dep]);
                    }
                }
            }

            // _addRegistryEntry(packageInfo.name);
        }

        // function _addRegistryEntry(packageName) {
        //
        //     // var registry = path.join(_config.cache, 'registry.npmjs.org');
        //     //
        //     // var packageDir = path.join(registry, packageName);
        //     //
        //     // if(!fs.existsSync(packageDir)) {
        //     //     fs.mkdirSync(packageDir);
        //     // }
        // }
    };
})();
