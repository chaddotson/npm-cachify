// var rewire = require("rewire");
//
// var cachify = rewire("../src/cachify.js");
//
//
// cachify.__set__("cachify._load", function() { console.log("rewired");})
//
// cachify.cachify(["jshint"]);


var cachify = require("../src/cachify.js");
var sinon = require("sinon");
var mocha = require("mocha");
var assert = require("assert")

//var func = sinon.spy();

describe("cachify", function() {
    it("should cache the package specified.", function () {
        var add = sinon.spy();

        npm_mocker = {
            //load: func
            load: function(config, callback) {
                //console.log("in caller");
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

        cachify.cachify(["jshint"], {npm: npm_mocker});

        // console.log(add.getCall(0));
        assert(add.calledWith("jshint"));

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
        }

        npm_mocker = {
            load: function(config, callback) {
                callback();
            },
            commands: {
                cache: {
                    add: function () {}
                }
            }
        };

        var add = sinon.stub(npm_mocker.commands.cache, "add", function(packageToAdd, b, c, d, callback) {
            var packageInfo = repository[packageToAdd];
            callback({}, packageInfo);
        });


        cachify.cachify(["level1@1.0.0"], {npm: npm_mocker});

        assert.equal(add.callCount, 4)

        var call = add.getCall(0);
        assert(call.calledWith("level1@1.0.0"));

        call = add.getCall(1);
        assert(call.calledWith("level2a@2.0.0"));

        call = add.getCall(2);
        assert(call.calledWith("level3@2.0.0"));

        call = add.getCall(3);
        assert(call.calledWith("level2b@2.0.0"));

    });

    // it("should only process a package once.", function () {
    //
    // });

});
