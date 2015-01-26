var gulp = require('gulp');
// del = require('del'),
//var mocha = require('gulp-mocha');
//var glob = require('glob');
var plato = require('plato');
// runs = require('run-sequence'),
var plugins = require('gulp-load-plugins')();
var checkstyleFileReporter = require('jshint-checkstyle-file-reporter');
// browserSync = require('browser-sync'),
// reload = browserSync.reload,
// env = plugins.util.env,
var log = plugins.util.log;
// port = process.env.PORT || 7707;

//var jshint = require('gulp-jshint');



var sourceDirectories = ["./src/**/*.js", "./tests/**/*.js"];
var testDirectories = ["./tests/**/*.js"];


gulp.task('help', plugins.taskListing);

//var taskListing = require('gulp-task-listing');

// Add a task to render the output
//gulp.task('help', taskListing);



gulp.task('default', ['help']);


gulp.task('test', function () {
    log('Running unit tests');

    return gulp.src(sourceDirectories, {read:false})
        .pipe(plugins.mocha({reporter: 'spec'}));
});


gulp.task('jshint', function() {
    log('Linting with jshint -> creating xml output file.');

    process.env.JSHINT_CHECKSTYLE_FILE = "./jshint.xml"; // default: checkstyle.xml

    return gulp.src(sourceDirectories)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(checkstyleFileReporter))
        .pipe(plugins.jshint.reporter('default'));
});


gulp.task('jscs', function () {
    log('Running jscs');
    return gulp.src(sourceDirectories)
        .pipe(plugins.jscs())
});

gulp.task('inspect', ['jshint', 'jscs'])


gulp.task('analyze', function () {
    log('Run static analysis tools and create reports');

    //var jscs = analyzejscs(['./src/']);
    runPlato();
    //return jscs;
});

function analyzejscs(sources) {
    log('Running JSCS');
    return gulp.src(sources)
        .pipe(plugins.jscs({
            configPath: './.jscsrc',
            reporter: 'checkstyle',
            filePath: './jscs.xml'
        }))
        .pipe(plugins.notify({
            title: 'JSCS',
            message: 'JSCS Passed. Let it fly!'
        }));
}

function runPlato() {
    log('Running Plato');

    var files = [];
    for(var i = 0; i < sourceDirectories.length; i++) {
        Array.prototype.push.apply(files, glob.sync(sourceDirectories[i]));
    }

    // excludeFiles = /\/tests\.js/,
    options = {
        title: 'Plato Inspections Report',
        // exclude: excludeFiles
    },

    plato.inspect(files, "./plato", options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        log(overview.reports[0].jshint);
    }
}
