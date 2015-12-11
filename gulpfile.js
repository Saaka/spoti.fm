var gulp = require('gulp');
var gp_concat = require('gulp-concat');
var gp_rename = require('gulp-rename');
var gp_uglify = require('gulp-uglify');

// gulp.task('uglify-head', function() {
// 	return gulp.src(['bower_components/angular-animate/angular-animate.min.js',
// 					'bower_components/angular/angular.min.js'])
// 				// .pipe(gp_concat('concat.js'))
// 				// .pipe(gulp.dest('js'))
//         		// .pipe(gp_rename('uglify.js'))
// 				//.pipe(gp_uglify())
// 				.pipe(gulp.dest('js/dist'));
// });

gulp.task('move-js', function() {
	return gulp.src(['bower_components/angular/angular.js',
						'bower_components/angular-animate/angular-animate.js',
						'bower_components/AngularJS-Toaster/toaster.js',
						'bower_components/jquery/dist/jquery.js',
						'bower_components/bootstrap/dist/js/bootstrap.js'])
		.pipe(gulp.dest('js'));
});

gulp.task('move-css', function() {
	return gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css',
						'bower_components/font-awesome/css/font-awesome.css',
						'bower_components/AngularJS-Toaster/toaster.css'])
		.pipe(gulp.dest('css'));
});

gulp.task('move-fonts', function() {
	return gulp.src(['bower_components/font-awesome/fonts/*',
					'bower_components/bootstrap/dist/fonts/*'])
		.pipe(gulp.dest('fonts'));
});

gulp.task('default', ['move-js', 'move-css', 'move-fonts'], function() {});