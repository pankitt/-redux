let gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    base64 = require('gulp-base64');

gulp.task('scss', function () {
    gulp.src('scss/**/*.scss').pipe(sass()).pipe(base64({
        maxImageSize: 20 * 1024,
        debug: false,
    })).pipe(cleanCSS({ compatibility: 'ie8' })).on('error', onError).pipe(gulp.dest('css'));
});
gulp.task('watch_scss', function () {
    gulp.watch('scss/**/*.scss', ['scss']);
});
function onError(err) {
    console.log(err);
    this.emit('end');
}
