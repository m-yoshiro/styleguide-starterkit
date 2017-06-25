'use strict';

/* ==========================

  Styleguide Build Tasks

  - Config
  - Stylesheets
  - Pattern lab
  - Watch
  - Tests
  - Development

  ========================= */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
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
const backstopjs = require('backstopjs');
const runSequence = require('run-sequence');


// -------------------
// Config

const PATHS = {
  src: `${__dirname}/source`,
  dist: `${__dirname}/public`,
  tmp: `${__dirname}/.tmp`
};

const options = {
  env: process.env.NODE_ENV || 'development'
};


// -------------------
// Stylesheets

gulp.task('styles', ['lint:styles'], () => {

  const AUTOPREFIXER_CONFIG = {
    browsers: ['last 1 version'],
  };

  const POSTCSS_PLUGINS = [
    autoprefixer(AUTOPREFIXER_CONFIG),
    cssnano(),
    reporter(),
  ];

  return gulp.src(`${PATHS.src}/stylesheets/scss/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(POSTCSS_PLUGINS))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${PATHS.tmp}/stylesheets`));
});

gulp.task('lint:styles', () => {
  return gulp.src(`${PATHS.src}/**/*.scss`)
    .pipe(stylelint({
      reporters: [{ formatter: 'string', console: true }],
    }));
});

gulp.task('copy:styles', () => {
  let stream;
  const delay = options.env === 'production' ? 0 : 1000;

  setTimeout(() => {
    gutil.log(`Starting '${gutil.colors.cyan('copy:style')}' set delay: ${gutil.colors.magenta(delay)} ms`);
    stream = gulp.src(`${PATHS.tmp}/stylesheets/*.css`)
      .pipe(gulp.dest(`${PATHS.src}/stylesheets`));
    gutil.log(`Finished '${gutil.colors.cyan('copy:style')}'`);
  }, delay);

  return stream;
});

gulp.task('styles:dev', (cb) => {
  runSequence('styles', 'copy:styles', cb);
});


// -------------------
// Pattern Lab

gulp.task('serve:patternlab', function (cb) {
  const server = exec('php core/console --server --with-watch', cb);

  server.stdout.on('data', (data) => {
    const url = /https?:\/\/[\w-]+:+\d{4}?/gi;

    if (url.test(data.toString())) {
      gutil.log(gutil.colors.cyan(data.toString()));
    } else {
      gutil.log(data.toString());
    }
  });

  server.stderr.on('data', (data) => {
    process.stdout.write(data.toString());
  });

  server.on('close', (code) => {
    if (code === 0) {
      cb();
    }
    else {
      console.log(`close: ${code}`);
    }
  });
});


// -------------------
// Watch

gulp.task('watch', () => {
  gulp.watch(`${PATHS.src}/**/*.scss`, ['styles:dev']);
});


// -------------------
// Tests

let BACKSTOP_CONFIG = require('./tests/visual-regression/backstop.config.js')();

// Getting **.tests.json files from component directories.
function setupBackstopjs(cb) {
  gutil.log(`Starting '${gutil.colors.cyan('Setup Backstopjs:')}'...`);

  if (!Array.isArray(BACKSTOP_CONFIG.scenarios)) {
    BACKSTOP_CONFIG.scenarios = [];
  }

  gutil.log(`Starting ${gutil.colors.cyan('Setup Backstopjs:')}...`);
  return gulp.src(`${PATHS.src}/**/*.tests.json`)
    .on('data', (file) => {
      gutil.log(`'${file.path}'`);
      const unitConfig = JSON.parse(fs.readFileSync(file.path));
      if(Array.isArray(unitConfig.scenarios) ) {
        BACKSTOP_CONFIG.scenarios = BACKSTOP_CONFIG.scenarios.concat(unitConfig.scenarios);
      }
    })
    .on('end', () => {
      if (cb) cb();
    });
}

gulp.task('visual-regrresion:ref', () => {
  return setupBackstopjs(() => backstopjs('reference', { config: BACKSTOP_CONFIG }));
});

gulp.task('visual-regrresion:test', () => {
  return setupBackstopjs(() => backstopjs('test', {
    config: BACKSTOP_CONFIG,
    filter: gutil.env.filter || null
  }));
});

gulp.task('visual-regrresion:approve', () => {
  return setupBackstopjs(() => backstopjs('approve', { config: BACKSTOP_CONFIG }));
});

// -------------------
// Development

gulp.task('default', ['styles'], () => {
  runSequence (
    'copy:styles',
    'serve:patternlab',
    'watch'
  );
});
