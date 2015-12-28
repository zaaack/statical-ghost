var markdownit = require('markdown-it')
var hljs = require('highlight.js')

var defaults = {
  html: true,
  linkify: true,
  typographer: true,
  langPrefix: 'hljs ',
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}

    return str; // use external default escaping
  }
}

function target_blank(md) {
  md.core.ruler.after(
    'inline',
    'target_blank',
    function(state) {
      state.tokens.forEach(function(blockToken) {
        if (blockToken.type !== 'inline' || !blockToken.children) {
          return
        }
        blockToken.children.forEach(function(token) {
          if (token.type === 'link_open'
            && !(token.attrs[0][1] && token.attrs[0][1][0] === '#')) {
            token.attrs.push(['target', '_blank'])
          }
        });
      });
      return false;
    }
  );

}

var md = markdownit(defaults)
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-container'), 'warning')
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-ins'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(target_blank);

module.exports = md
