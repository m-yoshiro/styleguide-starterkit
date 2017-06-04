/* ==========================

  Styleguide Build Tasks

  - Config
  - Stylesheets
  - Pattern lab

  ========================= */

const gulp = require('gulp');
const shell = require('gulp-shell');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');
const reporter = require('postcss-reporter');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();

// Config
//

const PATHS = {
  src: `${__dirname}/source`,
  dist: `${__dirname}/public`,
};

// Stylesheets
//

gulp.task('styles', ['lint:styles'], () => {

  const AUTOPREFIXER_CONFIG = {
    browsers: ['last 1 version'],
  };

  const POSTCSS_PLUGINS = [
    autoprefixer(AUTOPREFIXER_CONFIG),
    cssnano(),
    reporter(),
  ];

  return gulp.src(`${PATHS.src}/stylesheets/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(POSTCSS_PLUGINS))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${PATHS.dist}/css/`))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('lint:styles', () => {
  return gulp.src(`${PATHS.src}/stylesheets/**/*.scss`)
    .pipe(stylelint({
      reporters: [{ formatter: 'string', console: true }],
    }));
});

// Pattern Lab
//

gulp.task('watch:patternlab', shell.task([
  'php core/console --watch --patternsonly'
]));


// BrowserSync
//

gulp.task('browserSync-reload', () => {
  browserSync.reload();
});

gulp.task('browserSync', () => {
  connect.server({}, () => {
    browserSync.init({
      server: './public'
    });
  });
});

// Watch
//

gulp.task('watch', ['styles', 'watch:patternlab', 'browserSync'], () => {
  gulp.watch(`${PATHS.src}/_patterns`, ['browserSync-reload']);
  gulp.watch(`${PATHS.src}/stylesheets`, ['styles']);
});
