// ### Navigation Helper
// `{{navigation}}`
// Outputs navigation menu of static urls

var _               = require('lodash'),
    hbs             = require('handlebars'),

    logger          = require('../../utils/logger'),
    template        = require('./template'),
    navigation;

navigation = function (options) {
    /*jshint unused:false*/
    var navigationData = options.data.blog.navigation,
        currentUrl = options.data.root.relativeUrl,
        output,
        context;

    if (!_.isObject(navigationData) || _.isFunction(navigationData)) {
        return logger.logAndThrowError('navigation data is not an object or is a function');
    }

    if (navigationData.filter(function (e) {
        return (_.isUndefined(e.label) || _.isUndefined(e.url));
    }).length > 0) {
        return logger.logAndThrowError('All values must be defined for label, url and current');
    }

    // check for non-null string values
    if (navigationData.filter(function (e) {
        return ((!_.isNull(e.label) && !_.isString(e.label)) ||
            (!_.isNull(e.url) && !_.isString(e.url)));
    }).length > 0) {
        return logger.logAndThrowError('Invalid value, Url and Label must be strings');
    }

    function _slugify(label) {
        return label.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }

    // {{navigation}} should no-op if no data passed in
    if (navigationData.length === 0) {
        return new hbs.SafeString('');
    }

    output = navigationData.map(function (e) {
        var out = {};
        out.current = e.url === currentUrl;
        out.label = e.label;
        out.slug = _slugify(e.label);
        out.url = hbs.Utils.escapeExpression(e.url);
        return out;
    });

    context = _.merge({}, {navigation: output});

    return template.execute('navigation', context, options);
};

module.exports = navigation;
