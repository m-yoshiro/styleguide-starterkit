const gulp = require('gulp');
const shell = require('gulp-shell');

const PATHS = {
  src: `${__dirname}/source/`,
  dist: `${__dirname}/public/`
};

gulp.task('server:patternlab', shell.task([
  'php core/console --server --watch'
]));
