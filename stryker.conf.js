
  module.exports = function(config){
    config.set(
      {
  "files": [
    {
      "pattern": "src/**/*.js",
      "mutated": true,
      "included": true
    },
    "test/**/*.js"
  ],
  "testRunner": "mocha",
  "reporter": [
    "clear-text",
    "progress"
  ],
  "testFramework": "mocha",
  "coverageAnalysis": "perTest"
}
    );
  }