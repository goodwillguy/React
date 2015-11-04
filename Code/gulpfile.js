'use strict';
var gulp = require('gulp');

var connect = require('gulp-connect');//Dev server
var open = require('gulp-open');//Open url
var browerify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
//start local developmentserver

var config = {
    port: 1169,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        dest: './dest',
        js: './src/**/*.js',
        mainJs: './src/main.js',
        css: ['./node_modules\bootstrap\dist\css\bootstrap.min.css',
            './node_modules\bootstrap\dist\css\bootstrap-theme.min.css'
        ]
    }
};

gulp.task('connect', function () {
    connect.server({
        root: ['dest'],
        port: config.port,
        base: config.devBaseUrl,
        livereload:true
    });
});


gulp.task('open',['connect'], function () {
   return gulp.src('dest/index.html')
        .pipe(open( { uri: config.devBaseUrl + ':' + config.port + '/' }));
});

gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dest))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
});

gulp.task('js', function () {
    //gulp.src(config.paths.js)
    //.pipe(gulp.dest(config.paths.dest))
    //.pipe(connect.reload());

    browerify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dest+'/scripts'))
    .pipe(connect.reload());
});

gulp.task('css', function () {
    gulp.src(config.paths.css)
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.paths.dest+'/css'));
});

gulp.task('default',['html','open','js','watch','css']);