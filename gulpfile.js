var gulp = require('gulp')
  , concat = require('gulp-concat')
  , bower = require('main-bower-files')
  , uglify = require('gulp-uglify')
  , ngmin = require('gulp-ngmin')
  , rename = require('gulp-rename')
  , filter = require('gulp-filter')
  , add = require('gulp-add-src')
  , sass = require('gulp-sass')
  , minifyCSS = require('gulp-minify-css')
  , autoprefixer = require('gulp-autoprefixer')
  , replace = require('gulp-replace')
  , p = require('path')

var paths = {
  scripts: ['./src/js/**/**/*.js', './src/js/**/*.js', './src/js/*.js'],
  styles: ['./src/scss/*.scss', './src/scss/**/*.scss']
}

/**
 * Get bower src, concats them together
 */
gulp.task('bower', function() {
  return gulp.src(
    bower({
      filter: function(path) {
        return p.extname(path) == '.js'
      }
    })
  )
    .pipe(add('bower_components/modernizr/modernizr.js'))
    .pipe(add('bower_components/mousetrap/mousetrap.js'))
    .pipe(concat('vendor.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('aurora', function() {
  gulp.src('./src/aurora/*.js.map')
    .pipe(gulp.dest('./dist/js'))

  gulp.src(['./src/aurora/*.js', '!./src/aurora/_aurora.js']) 
    .pipe(concat('aurora_librairies.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))

  gulp.src('./src/aurora/_aurora.js')
    .pipe(rename('aurora.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
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
  return gulp.src(paths.styles)
  .pipe(sass({errLogToConsole: true, includePaths: ['./bower_components']}))
  .pipe(autoprefixer({
    browsers: ['last 2 versions', 'last 2 Chrome versions'],
    cascade: false
  }))
  .pipe(concat('app.css'))
  .pipe(gulp.dest('./dist/css'))
  .pipe(minifyCSS())
  .pipe(rename('app.min.css'))
  .pipe(gulp.dest('./dist/css'));
})

gulp.task('default', ['bower', 'aurora', 'scripts', 'styles'])
gulp.task('watch', function() {
  gulp.watch(paths.aurora, ['aurora'])
  gulp.watch(paths.scripts, ['scripts'])
  gulp.watch(paths.styles, ['styles'])
})
