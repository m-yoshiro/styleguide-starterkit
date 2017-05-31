/* ==========================

  Styleguide Build Tasks

  - Config
  - Stylesheets
  - Pattern lab

  ========================= */

const gulp = require('gulp');
const shell = require('gulp-shell');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const scss = require('postcss-scss');
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

  const POSTCSS_CONFIG = {
    plugins: [
      AUTOPREFIXER_CONFIG,
      cssnano(),
    ],
    options: {
      parser: scss,
    }
  };

  return gulp.src(`${PATHS.src}/source/css/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(postcss(POSTCSS_CONFIG))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${PATHS.dist}/css/style.css`));
});

// Pattern Lab
//

gulp.task('server:patternlab', shell.task([
  'php core/console --server --watch'
]));
