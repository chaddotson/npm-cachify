var gulp = require('gulp');
// del = require('del'),
//var mocha = require('gulp-mocha');
var glob = require('glob');
var plato = require('plato');
// runs = require('run-sequence'),
var plug = require('gulp-load-plugins')();
// browserSync = require('browser-sync'),
// paths = require('./gulp.config.json'),
// reload = browserSync.reload,
// env = plug.util.env,
 log = plug.util.log,
// port = process.env.PORT || 7707;

gulp.task('help', plug.taskListing);

//var taskListing = require('gulp-task-listing');

// Add a task to render the output
//gulp.task('help', taskListing);



gulp.task('default', ['help']);


gulp.task('test', function () {
    log('Run unit tests');

    return gulp.src("./tests/*.js", {read:false})
        .pipe(plug.mocha({reporter: 'spec'}));
});

gulp.task('analyze', function () {
    log('Run static analysis tools and create reports');

    var jscs = analyzejscs(['./src/']);
    startPlatoVisualizer();
    return jscs;
});

function analyzejscs(sources) {
    log('Running JSCS');
    return gulp
    .src(sources)
    .pipe(plug.jscs('./.jscsrc'));
}

function startPlatoVisualizer() {
    log('Running Plato');

    var files = glob.sync('./src/**/*.js'),
    excludeFiles = /\/tests\.js/,
    options = {
        title: 'Plato Inspections Report',
        exclude: excludeFiles
    },
    outputDir = "./plato";//paths.report;

    plato.inspect(files, outputDir, options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        log(overview.summary);
    }
}

// gulp.task("test", function() {
//     log("this is a test");
// });
