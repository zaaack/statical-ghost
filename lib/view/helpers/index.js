var hbs             = require('handlebars'),
    logger          = require('../../utils/logger'),
    utils           = require('./utils'),
    coreHelpers     = {},
    registerHelpers;

// Pre-load settings data:
// - activeTheme
// - permalinks

if (!utils.isProduction) {
    hbs.logger.level = 0;
}

coreHelpers.asset  = require('./asset');
coreHelpers.author  = require('./author');
coreHelpers.body_class  = require('./body_class');
coreHelpers.content  = require('./content');
coreHelpers.date  = require('./date');
coreHelpers.encode  = require('./encode');
coreHelpers.excerpt  = require('./excerpt');
coreHelpers.foreach = require('./foreach');
coreHelpers.ghost_foot = require('./ghost_foot');
coreHelpers.ghost_head = require('./ghost_head');
coreHelpers.image = require('./image');
coreHelpers.is = require('./is');
coreHelpers.has = require('./has');
coreHelpers.meta_description = require('./meta_description');
coreHelpers.meta_title = require('./meta_title');
coreHelpers.navigation = require('./navigation');
coreHelpers.pagination = require('./pagination');
coreHelpers.plural = require('./plural');
coreHelpers.post_class = require('./post_class');
coreHelpers.prev_post = require('./prev_next');
coreHelpers.next_post = require('./prev_next');
coreHelpers.tags = require('./tags');
coreHelpers.title = require('./title');
coreHelpers.url = require('./url');

// Specialist helpers for certain templates
coreHelpers.input_password = require('./input_password');
coreHelpers.page_url = require('./page_url');
coreHelpers.pageUrl = require('./page_url').deprecated;

coreHelpers.helperMissing = function (arg) {
    if (arguments.length === 2) {
        return undefined;
    }
    logger.error('Missing helper: "' + arg + '"');
};

// Register a handlebars helper for themes
function registerThemeHelper(name, fn) {
    hbs.registerHelper(name, fn);
}

// Register a handlebars helper for admin
function registerAdminHelper(name, fn) {
    coreHelpers.adminHbs.registerHelper(name, fn);
}

registerHelpers = function (adminHbs) {
    // Expose hbs instance for admin
    coreHelpers.adminHbs = adminHbs;

    // Register theme helpers
    registerThemeHelper('asset', coreHelpers.asset);
    registerThemeHelper('author', coreHelpers.author);
    registerThemeHelper('content', coreHelpers.content);
    registerThemeHelper('title', coreHelpers.title);
    registerThemeHelper('date', coreHelpers.date);
    registerThemeHelper('encode', coreHelpers.encode);
    registerThemeHelper('excerpt', coreHelpers.excerpt);
    registerThemeHelper('foreach', coreHelpers.foreach);
    registerThemeHelper('is', coreHelpers.is);
    registerThemeHelper('input_password', coreHelpers.input_password);
    registerThemeHelper('has', coreHelpers.has);
    registerThemeHelper('navigation', coreHelpers.navigation);
    registerThemeHelper('page_url', coreHelpers.page_url);
    registerThemeHelper('pageUrl', coreHelpers.pageUrl);
    registerThemeHelper('pagination', coreHelpers.pagination);
    registerThemeHelper('tags', coreHelpers.tags);
    registerThemeHelper('plural', coreHelpers.plural);
    registerThemeHelper('url', coreHelpers.url);
    registerThemeHelper('image', coreHelpers.image);

    // Async theme helpers
    registerThemeHelper('body_class', coreHelpers.body_class);
    registerThemeHelper('ghost_foot', coreHelpers.ghost_foot);
    registerThemeHelper('ghost_head', coreHelpers.ghost_head);
    registerThemeHelper('meta_description', coreHelpers.meta_description);
    registerThemeHelper('meta_title', coreHelpers.meta_title);
    registerThemeHelper('post_class', coreHelpers.post_class);
    registerThemeHelper('next_post', coreHelpers.next_post);
    registerThemeHelper('prev_post', coreHelpers.prev_post);

    // Register admin helpers
    registerAdminHelper('asset', coreHelpers.asset);
    registerAdminHelper('input_password', coreHelpers.input_password);
};

module.exports = coreHelpers;
module.exports.loadCoreHelpers = registerHelpers;
module.exports.registerThemeHelper = registerThemeHelper;
