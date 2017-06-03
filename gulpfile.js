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
const reporter = require('postcss-reporter');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// Config
//

const PATHS = {
  src: `${__dirname}/source/`,
  dist: `${__dirname}/public/`,
};

// Stylesheets
//

gulp.task('styles', () => {

  const AUTOPREFIXER_CONFIG = {
    browsers: ['last 1 version'],
  };

  const POSTCSS_PLUGINS = [
    autoprefixer(AUTOPREFIXER_CONFIG),
    cssnano(),
    reporter({ throwError: true }),
  ];

  return gulp.src(`${PATHS.src}/stylesheets/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(POSTCSS_PLUGINS))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${PATHS.dist}/css/`));
});

// Pattern Lab
//

gulp.task('server:patternlab', shell.task([
  'php core/console --server --watch'
]));
