"use strict";

var cachify = require("../src/cachify.js");
var sinon = require("sinon");
var assert = require("assert");


describe("cachify", function() {
    it("should cache the package specified.", function () {
        var add = sinon.spy();

        var npmMocker = {
            load: function(config, callback) {
                callback();
            },
            commands: {
                cache: {
                    add: add
                    // function (packageToAdd, b, c, d, callback) {
                    //     console.log("Added:",packageToAdd);
                    //     callback({}, {
                    //         name: "test"
                    //     });
                    //}
                }
            }
        };

        cachify.cachify(["tester_pkg"], {npm: npmMocker});

        assert(add.calledWith("tester_pkg"));

    });

    it("should cache the first level package dependencies.", function () {

        var repository = {
            "level1@1.0.0": {
                name: "level1",
                dependencies: {
                    "level2a": "2.0.0",
                    "level2b": "2.0.0"
                }
            },
            "level2a@2.0.0": {
                name: "level2a",
                dependencies: {
                    "level3": "2.0.0"
                }
            },
            "level2b@2.0.0": {
                name: "level2b",
                dependencies: {
                }
            },
            "level3@2.0.0": {
                name: "level3",
                dependencies: {
                }
            }
        };

        var npmMocker = {
            load: function(config, callback) {
                callback();
            },
            commands: {
                cache: {
                    add: function () {}
                }
            }
        };

        var add = sinon.stub(npmMocker.commands.cache, "add", function(packageToAdd, b, c, d, callback) {
            var packageInfo = repository[packageToAdd];
            callback({}, packageInfo);
        });


        cachify.cachify(["level1@1.0.0"], {npm: npmMocker});

        assert.equal(add.callCount, 4);

        var call = add.getCall(0);
        assert(call.calledWith("level1@1.0.0"));

        call = add.getCall(1);
        assert(call.calledWith("level2a@2.0.0"));

        call = add.getCall(2);
        assert(call.calledWith("level3@2.0.0"));

        call = add.getCall(3);
        assert(call.calledWith("level2b@2.0.0"));

    });

    it("should only process a package once.", function () {

        var repository = {
            "level1@1.0.0": {
                name: "level1",
                dependencies: {
                    "level2a": "2.0.0",
                    "level2b": "2.0.0"
                }
            },
            "level2a@2.0.0": {
                name: "level2a",
                dependencies: {
                    "level2b": "2.0.0"
                }
            },
            "level2b@2.0.0": {
                name: "level2b",
                dependencies: {
                }
            },
            "level3@2.0.0": {
                name: "level3",
                dependencies: {
                }
            }
        };

        var npmMocker = {
            load: function(config, callback) {
                callback();
            },
            commands: {
                cache: {
                    add: function () {}
                }
            }
        };

        var add = sinon.stub(npmMocker.commands.cache, "add", function(packageToAdd, b, c, d, callback) {
            var packageInfo = repository[packageToAdd];
            callback({}, packageInfo);
        });


        cachify.cachify(["level1@1.0.0"], {npm: npmMocker});

        assert.equal(add.callCount, 3);

        var call = add.getCall(0);
        assert(call.calledWith("level1@1.0.0"));

        call = add.getCall(1);
        assert(call.calledWith("level2a@2.0.0"));

        call = add.getCall(2);
        assert(call.calledWith("level2b@2.0.0"));
    });

    it("should only process a package once.", function () {

        var repository = {
            "level1@1.0.0": {
                name: "level1",
                dependencies: {
                    "level2a": "2.0.0",
                    "level2b": "2.0.0"
                }
            },
            "level2a@2.0.0": {
                name: "level2a",
                dependencies: {
                    "level2b": "2.0.0"
                },
                devDependencies: {
                    "level2c": "1.0.0"
                }

            },
            "level2b@2.0.0": {
                name: "level2b",
                dependencies: {
                }
            },
            "level2c@1.0.0": {
                name: "level2c",
                dependencies: {
                }
            },
            "level3@2.0.0": {
                name: "level3",
                dependencies: {
                }
            }
        };

        var npmMocker = {
            load: function(config, callback) {
                callback();
            },
            commands: {
                cache: {
                    add: function () {}
                }
            }
        };

        var add = sinon.stub(npmMocker.commands.cache, "add", function(packageToAdd, b, c, d, callback) {
            var packageInfo = repository[packageToAdd];
            callback({}, packageInfo);
        });


        cachify.cachify(["level1@1.0.0"], {npm: npmMocker});

        assert.equal(add.callCount, 3);

        var call = add.getCall(0);
        assert(call.calledWith("level1@1.0.0"));

        call = add.getCall(1);
        assert(call.calledWith("level2a@2.0.0"));

        call = add.getCall(2);
        assert(call.calledWith("level2b@2.0.0"));

    });

    it("should install devDependencies only if specified.", function () {

        var repository = {
            "level1@1.0.0": {
                name: "level1",
                dependencies: {
                    "level2a": "2.0.0",
                    "level2b": "2.0.0"
                }
            },
            "level2a@2.0.0": {
                name: "level2a",
                dependencies: {
                    "level2b": "2.0.0"
                },
                devDependencies: {
                    "level2c": "1.0.0"
                }

            },
            "level2b@2.0.0": {
                name: "level2b",
                dependencies: {
                }
            },
            "level2c@1.0.0": {
                name: "level2c",
                dependencies: {
                }
            },
            "level3@2.0.0": {
                name: "level3",
                dependencies: {
                }
            }
        };

        var npmMocker = {
            load: function(config, callback) {
                callback();
            },
            commands: {
                cache: {
                    add: function () {}
                }
            }
        };

        var add = sinon.stub(npmMocker.commands.cache, "add", function(packageToAdd, b, c, d, callback) {
            var packageInfo = repository[packageToAdd];
            callback({}, packageInfo);
        });


        cachify.cachify(["level1@1.0.0"], {npm: npmMocker, includeDevDependencies: true});

        assert.equal(add.callCount, 4);

        var call = add.getCall(0);
        assert(call.calledWith("level1@1.0.0"));

        call = add.getCall(1);
        assert(call.calledWith("level2a@2.0.0"));

        call = add.getCall(2);
        assert(call.calledWith("level2b@2.0.0"));

        call = add.getCall(3);
        assert(call.calledWith("level2c@1.0.0"));
    });



    // TODO: it should gracefully handle failing to install a package.
    // it("should handle package not found in repository.", function () {
    //
    //     var repository = {
    //         "level1@1.0.0": {
    //             name: "level1",
    //             dependencies: {
    //                 "level5": "2.0.0"
    //             }
    //         }
    //     }
    //
    //     npmMocker = {
    //         load: function(config, callback) {
    //             callback();
    //         },
    //         commands: {
    //             cache: {
    //                 add: function () {}
    //             }
    //         }
    //     };
    //
    //     var add = sinon.stub(npmMocker.commands.cache, "add", function(packageToAdd, b, c, d, callback) {
    //         var packageInfo = repository[packageToAdd];
    //         callback({}, packageInfo);
    //     });
    //
    //
    //     cachify.cachify(["level1@1.0.0"], {npm: npmMocker});
    //
    // });




});
