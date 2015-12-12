// # Encode Helper
//
// Usage:  `{{encode uri}}`
//
// Returns URI encoded string

var hbs             = require('handlebars'),
    encode;

encode = function (context, str) {
    var uri = context || str;
    return new hbs.SafeString(encodeURIComponent(uri));
};

module.exports = encode;
