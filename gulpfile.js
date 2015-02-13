'use strict';

/* Gulpfile for GDG Israel Website */
/* Provides SASS + Livereload functions */
/* Copyright (C) 2014, 2015 Uri Shaked. License: ISC */

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	prefix = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	connectLivereload = require('connect-livereload'),
	git = require('gulp-git'),
	express = require('express');

var serverPort = process.env.GDG_DEVSERVER_PORT || 7000;
var livereloadPort = process.env.GDG_LIVERELOAD_PORT || 35730;

var paths = {
	scripts: ['js/*.js'],
	images: ['images/**/*.{svg,png,jpg}'],
	styles: ['styles/*.scss'],
	html: ['web/*.html']
};

gulp.task('scripts', function () {
	return gulp.src(paths.scripts)
		.pipe(concat('main.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('build/js'));
});

gulp.task('sass', function () {
	gulp.src(paths.styles)
		.pipe(sass())
		.pipe(prefix())
		.pipe(gulp.dest('styles'));
});

gulp.task('imagemin', function () {
	gulp.src(paths.images)
		.pipe(imagemin())
		.pipe(gulp.dest('images'));
});

gulp.task('serve', ['sass'], function () {
	var server = express();
	server.use(connectLivereload({
		port: livereloadPort
	}));
	server.use(express.static('web'));
	server.listen(serverPort);
});

gulp.task('watch', function () {
	var lrserver = livereload(livereloadPort);

	gulp.watch(paths.scripts, ['scripts']);

	gulp.src(paths.styles)
		.pipe(watch())
		.pipe(sass())
		.pipe(prefix())
		.pipe(gulp.dest('styles'))
		.pipe(lrserver);

	gulp.src([].concat(paths.images, paths.html))
		.pipe(watch())
		.pipe(lrserver);
});

gulp.task('publish', function () {
	git.push('origin', 'master:gh-pages')
		.end();
});

gulp.task('default', ['scripts', 'serve', 'watch']);
