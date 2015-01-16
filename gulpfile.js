var gulp = require('gulp');
// del = require('del'),
//var mocha = require('gulp-mocha');
var glob = require('glob');
var plato = require('plato');
// runs = require('run-sequence'),
var plugins = require('gulp-load-plugins')();
var checkstyleFileReporter = require('jshint-checkstyle-file-reporter');
// browserSync = require('browser-sync'),
var config = require('./gulp.config.json'),
// reload = browserSync.reload,
// env = plugins.util.env,
 log = plugins.util.log;
// port = process.env.PORT || 7707;

//var jshint = require('gulp-jshint');



gulp.task('help', plugins.taskListing);

//var taskListing = require('gulp-task-listing');

// Add a task to render the output
//gulp.task('help', taskListing);



gulp.task('default', ['help']);


gulp.task('test', function () {
    log('Running unit tests');

    return gulp.src(config.paths.tests, {read:false})
        .pipe(plugins.mocha({reporter: 'spec'}));
});


gulp.task('jshint', function() {
    log('Linting with jshint -> creating xml output file.');

    process.env.JSHINT_CHECKSTYLE_FILE = config.paths.jshint_outfile; // default: checkstyle.xml

    return gulp.src(config.paths.js)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(checkstyleFileReporter))
        .pipe(plugins.jshint.reporter('default'));
});


// gulp.task('jscs', function () {
//     log('Running jscs');
//     return gulp.src(config.paths.js)
//         .pipe(plugins.jscs('./.jscsrc'))
//         .pipe(plugins.notify({
//             title: 'JSCS',
//             message: 'JSCS Passed. Let it fly!'
//         }));
// });


gulp.task('analyze', function () {
    log('Run static analysis tools and create reports');

    //var jscs = analyzejscs(['./src/']);
    runPlato();
    //return jscs;
});

function analyzejscs(sources) {
    log('Running JSCS');
    return gulp.src(sources)
        .pipe(plugins.jscs('./.jscsrc')
        .pipe(plugins.notify({
            title: 'JSCS',
            message: 'JSCS Passed. Let it fly!'
        })));
}

function runPlato() {
    log('Running Plato');

    var files = [];
    for(var i = 0; i < config.paths.js.length; i++) {
        Array.prototype.push.apply(files, glob.sync(config.paths.js[i]));
    }

    console.log(files);
    // excludeFiles = /\/tests\.js/,
    options = {
        title: 'Plato Inspections Report',
        // exclude: excludeFiles
    },
    outputDir = config.paths.plato_outputdir;

    plato.inspect(files, outputDir, options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        log(overview.summary);
    }
}

// gulp.task("test", function() {
//     log("this is a test");
// });
