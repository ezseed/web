var gulp = require('gulp')
  , concat = require('gulp-concat')
  , bower = require('gulp-bower-files')
  , uglify = require('gulp-uglify')
  , ngmin = require('gulp-ngmin')
  , rename = require('gulp-rename')
  , sass = require('gulp-sass')
  , add = require('gulp-add-src')
  , minifyCSS = require('gulp-minify-css')

var paths = {
  scripts: ['./src/js/**/**/*.js', './src/js/**/*.js', './src/js/*.js'],
  styles: ['./src/scss/*.scss', './src/scss/**/*.scss']
}
/**
 * Get bower src, concats them together
 */
gulp.task('bower', function() {
  bower()
    .pipe(add('bower_components/modernizr/modernizr.js'))
    .pipe(concat('vendor.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(ngmin())
    .on('error', function(err) {
      console.error(err)
    })
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify({mangle: false}))
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('styles', function() {
  gulp.src(paths.styles)
  .pipe(sass({errLogToConsole: true, includePaths: ['./bower_components']}))
  .pipe(gulp.dest('./dist/css'))
  .pipe(minifyCSS())
  .pipe(rename('app.min.css'))
  .pipe(gulp.dest('./dist/css'));

})

gulp.task('default', ['bower', 'scripts', 'styles'])
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts'])
  gulp.watch(paths.styles, ['styles'])
})
