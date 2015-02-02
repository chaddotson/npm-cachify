var checkstyleFileReporter = require('jshint-checkstyle-file-reporter');
var gulp = require('gulp');
var plato = require('plato');
var plugins = require('gulp-load-plugins')();
var glob = require('glob');
var log = plugins.util.log;

var sourceDirectories = ['./src/**/*.js', './tests/**/*.js'];

gulp.task('help', plugins.taskListing);

gulp.task('default', ['help']);

gulp.task('test', function () {
    log('Running unit tests');

    return gulp.src(sourceDirectories, {read:false})
        .pipe(plugins.mocha({reporter: 'spec'}));
});


gulp.task('jshint', function () {
    log('Linting with jshint -> creating xml output file.');

    process.env.JSHINT_CHECKSTYLE_FILE = './jshint.xml'; // default: checkstyle.xml

    return gulp.src(sourceDirectories)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(checkstyleFileReporter))
        .pipe(plugins.jshint.reporter('default'));
});


gulp.task('jscs', function () {
    log('Running jscs');

    return gulp.src(sourceDirectories)
        .pipe(plugins.jscs());
});

gulp.task('inspect', ['jshint', 'jscs']);

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

    var files = [],
        i, options;

    for (i = 0; i < sourceDirectories.length; i++) {
        Array.prototype.push.apply(files, glob.sync(sourceDirectories[i]));
    }

    // excludeFiles = /\/tests\.js/,
    options = {
        title: 'Plato Inspections Report',
        // exclude: excludeFiles
    },

    plato.inspect(files, './plato', options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        log(overview.reports[0].jshint);
    }
}
