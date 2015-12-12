// # Ghost Foot Helper
// Usage: `{{ghost_foot}}`
//
// Outputs scripts and other assets at the bottom of a Ghost theme
//
// We use the name ghost_foot to match the helper for consistency:
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var hbs             = require('handlebars'),
    _               = require('lodash'),
    config          = require('../../config'),
    utils           = require('./utils'),
    ghost_foot;

ghost_foot = function (options) {
    /*jshint unused:false*/
    var jquery = utils.isProduction ? 'jquery.min.js' : 'jquery.js',
        foot = [];

    foot.push(utils.scriptTemplate({
      source: config.paths.subdir + '/public/' + jquery,
      version: config.assetHash
    }));

    // TODO: ghost_foot config to foot.push
    var footString = _.reduce(foot, function (memo, item) { return memo + ' ' + item; }, '');
    return new hbs.SafeString(footString.trim());
};

module.exports = ghost_foot;
