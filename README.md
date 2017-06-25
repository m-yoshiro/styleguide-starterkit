# Styleguide Starterkit

For learning styleguide development.

## Installing

```.sh
# Install nodejs tools.
$ yarn

# Install Gulp CLI.
$ npm i -g gulp-cli
# or
$ yarn global add gulp-cli

# Install Pattern Lab.
$ composer install
```

## Usage

### Development

```.sh
$ gulp

```

### Test

#### Visual regression test

Using [BackstopJS](https://github.com/garris/BackstopJS).

```.sh
# Generate reference images.
$ gulp visual-regression:ref

# Start test.
$ gulp visual-regression:test
# You can use filter option.
$ gulp visual-regression:test --filter <scenario.label>

# Approving test results.
$ gulp visual-regression:approve
```
