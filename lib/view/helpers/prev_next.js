// ### prevNext helper exposes methods for prev_post and next_post - separately defined in helpers index.
//  Example usages
// `{{#prev_post}}<a href ="{{url}}>previous post</a>{{/prev_post}}'
// `{{#next_post}}<a href ="{{url absolute="true">next post</a>{{/next_post}}'

var schema          = require('../data/schema').checks,
    Promise         = require('bluebird'),
    fetch, prevNext;


// If prevNext method is called without valid post data then we must return a promise, if there is valid post data
// then the promise is handled in the api call.

prevNext =  function (options) {
    options = options || {};

    var key = options.name === 'prev_post' ? 'prev_post' : 'next_post'

    return this[key]
};

module.exports = prevNext;
