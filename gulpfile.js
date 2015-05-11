var gulp = require("gulp"),
    gutil = require("gulp-util"),
    jshint = require("gulp-jshint"),
    less = require("gulp-less"),
    path = require("path"),
    react = require("gulp-react"),
    jsxcs = require("gulp-jsxcs"),
    runSequence = require("run-sequence"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config.js"),
    WebpackDevServer = require("webpack-dev-server");


// Compile LESS into CSS puts output in ./build/css
gulp.task("less", function() {
    return gulp.src("./style/**/*.less")
        .pipe(less({
            paths: [ path.join(__dirname, "style") ]
        }))
        .pipe(gulp.dest("./build/css"));
});

// Initiates a webpack operation and puts the bundle in ./build based
// on the config in webpack.config.js.
gulp.task("webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    myConfig.debug = true;

    webpack(myConfig, function(err, stats) {
        if(err) {
            throw new gutil.PluginError("webpack", err);
        }
        // Log filenames packed:
        //gutil.log("[webpack]", stats.toString({
            // output options
        //}));
        callback();
    });
});

// Starts a webpack dev-server on port 7070
// localhost:7070 can be used instead for development.
// The bundle.js file will not be written out and will be served from memory.
gulp.task("server", function(callback) {
    var myConfig = Object.create(webpackConfig);
    myConfig.debug = true;
    myConfig.cache = true;
    new WebpackDevServer(webpack(myConfig), {
        publicPath: myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(7070, "localhost", function(err) {
        if (err) {
            throw new gutil.PluginError("webpack-dev-server", err);
        }
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:7070/webpack-dev-server/index.html");
        // keep the server alive or continue?
        // callback();
    });
});

// Watch Files For Changes, when there are some will run webpack
// Will also watch for .less changes and generate new .css.
gulp.task("watch", function() {
    gulp.watch("src/**/*.js", ["webpack"]);
    gulp.watch("style/**/*.less", ["less"]);
});

// Default Task
// Not including Flow typechecking by default because it takes so painfully long.
// Maybe because of my code layout or otheriwse, needto figure it out before enabling by default.
gulp.task("default", function(cb) {
    runSequence(["less", "webpack"], cb);
});
