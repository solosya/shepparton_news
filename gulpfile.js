var gulp = require ('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gp_rename = require("gulp-rename");
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require("gulp-clean-css");
var runSequence = require('run-sequence');


gulp.task('styles', function(callback) {
  runSequence('sass', 'concat', 'minify-css', callback);
});


// task
gulp.task('minify-css', function () {
    return gulp.src([
        './static/deploy/concat.css',
    ]) // path to your file
    .pipe(gp_rename({suffix: '.min'}))
    .pipe(minifyCss())
    .pipe(gulp.dest('./static/deploy'));
});


gulp.task('concat', function () {
    return gulp.src([
        './static/css/main.css',
        './static/development/js/plugins/jquery.fancybox/source/jquery.fancybox.css',
        './static/development/js/plugins/jquery.noty-2.3.8/demo/animate.css',
        './static/development/js/sdk/media-player/mediaelementplayer.css'
    ]) // path to your file
    .pipe(concat('concat.css'))

    .pipe(gulp.dest('./static/deploy'));
});


gulp.task('sass', function() {
    return gulp.src([
            './static/css/main.scss',
        ])
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: [
            './static/css/partials', 
        ]}).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/css'));
});





gulp.task('scripts', function(){
	return gulp.src([
		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
		
        './static/developement/js/plugins/slick.js',
        './static/developement/js/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js',
        './static/developement/js/plugins/bootstrap-modalmanager.js',
        './static/developement/js/plugins/bootstrap-modal.js',
        './static/developement/js/plugins/jquery.noty-2.3.8/js/noty/packaged/jquery.noty.packaged.min.js',
        './static/developement/js/plugins/jquery.fancybox/source/jquery.fancybox.js',
        './static/developement/js/plugins/bootbox.min.js',
        './static/developement/js/plugins/jquery.validate/jquery.validate.min.js',
        './static/developement/js/plugins/waypoint/lib/jquery.waypoints.min.js',
        './static/developement/js/plugins/handlebars-v4.0.5.js',
        './static/developement/js/plugins/jquery.lazyload.min.js',
        './static/developement/js/plugins/jquery.dotdotdot.min.js',
        './static/developement/js/plugins/owl.carousel.min.js',

        './static/developement/js/sdk/cloudinary/jquery.cloudinary.js',
        './static/developement/js/sdk/common.js',
        './static/developement/js/sdk/blog.js',
        './static/developement/js/sdk/article.js',
        './static/developement/js/sdk/search.js',
        './static/developement/js/sdk/disqus.js',
        './static/developement/js/sdk/video-player.js',
        './static/developement/js/sdk/user-articles.js',
        './static/developement/js/sdk/follow.js',
        './static/developement/js/sdk/login.js',
        './static/developement/js/sdk/image.js',
        './static/developement/js/sdk/social-share.js',
        './static/developement/js/sdk/yii/yii.js',
        './static/developement/js/sdk/yii/yii.captcha.js',
        './static/developement/js/sdk/uploadfile.js',
        './static/developement/js/sdk/media-player/mediaelement-and-player.min.js',

		'./static/developement/js/*.js',
		])
		.pipe(concat('concat.js'))
		.pipe(gulp.dest('./static/deploy'))
		.pipe(gp_rename('scripts.js'))
		.pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('./static/deploy'));

});


gulp.task('user_scripts', function(){
    return gulp.src([
        './bower_components/jquery/dist/jquery.js',
        './bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
        './assets/scripts/plugins/jquery.fancybox/source/jquery.fancybox.js',
        './assets/scripts/plugins/handlebars-v4.0.5.js',
        './assets/scripts/plugins/jquery.lazyload.min.js',
        './assets/scripts/plugins/jquery.dotdotdot.min.js',
        './assets/scripts/plugins/owl.carousel.min.js',

        './assets/scripts/sdk/search.js',
        './assets/scripts/sdk/video-player.js',
        './assets/scripts/sdk/user-articles.js',
        './assets/scripts/sdk/follow.js',
        './assets/scripts/sdk/login.js',
        './assets/scripts/sdk/image.js',
        './assets/scripts/sdk/social-share.js',
        './assets/scripts/sdk/yii/yii.js',
        './assets/scripts/sdk/yii/yii.captcha.js',
        './assets/scripts/sdk/uploadfile.js',
        './assets/scripts/sdk/media-player/mediaelement-and-player.min.js',
        './assets/scripts/*.js',
        ])
        .pipe(concat('user_concat.js'))
        .pipe(gulp.dest('./static/deploy'))
        .pipe(gp_rename('user_scripts.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('./static/deploy'));

});

gulp.task('watch', function (){
	gulp.watch('./static/css/**/*.scss', ['styles']);
	gulp.watch('./static/developement/js/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'user_scripts', 'styles']);