const BASE_CONFIG = {
  "id": "backstop",
  "viewports": [
    {
      "name": "phone",
      "width": 320,
      "height": 480
    },
    {
      "name": "tablet_v",
      "width": 568,
      "height": 1024
    },
    {
      "name": "tablet_h",
      "width": 1024,
      "height": 768
    }
  ],
  scenarios: [],
  "paths": {
    "bitmaps_reference": "tests/visual-regression/bitmaps_reference",
    "bitmaps_test": "tests/visual-regression/bitmaps_test",
    "casper_scripts": "tests/visual-regression/casper_scripts",
    "html_report": "tests/visual-regression/html_report",
    "ci_report": "tests/visual-regression/ci_report"
  },
  "casperFlags": [],
  "engine": "phantomjs",
  "report": ["browser"],
  "debug": true
};

module.exports = options => {
  const CONFIG = options ? Object.assign(BASE_CONFIG, options) : BASE_CONFIG;
  return CONFIG;
};
