// # Title Helper
// Usage: `{{title}}`
//
// Overrides the standard behaviour of `{[title}}` to ensure the content is correctly escaped

var hbs             = require('handlebars'),
    title;

title = function () {
    return new hbs.SafeString(hbs.Utils.escapeExpression(this.title || ''));
};

module.exports = title;
