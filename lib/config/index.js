var _ = require('lodash'),
  yaml = require('js-yaml'),
  fs = require('fs'),
  urlConfig = require('./url')

var config,
  configFile = process.cwd() + '/config.yaml',
  configFromFile = null

config = {
  theme: 'Casper',
  url: 'http://localhost:8080',
  urlSSL: 'https://localhost:8080',
  routeKeywords: {
    tag: 'tag',
    author: 'author',
    page: 'page'
  },
  paths: {
    subdir: '',
    imagesRelPath: '',

    posts: '/posts',
    public: '/public',
    tmp: '/tmp',
    themes: '/themes',
    theme: ''
  },
  posts: {
    limit: 5,
    permalinks: '/:year/:month/:day/:slug/'
  },
  blog: {
    url: 'http://localhost',
    title: "Z's Blog",
    description: 'Keep It Simple and Stupid.',
    logo: '',
    cover: '',
    navigation: [{
      label: '首页',
      url: '/'
    },{
      label: 'hello',
      url: '/tag/hello'
    }]
  },
  author: 'z', //slug
  authors: {
    z:{
      name: 'z',
      slug: 'z',
      image: null,
      cover: null,
      bio:'Think',
      website: '',
      location: '北京',
      "meta_title": null,
      "meta_description": null,
    }
  },
  tags:  {
    hello: {
      name:'hello',
      slug: 'hello',
      description: null,
      image: null,
      hidden: null,
      meta_title: 'test',
      meta_description: 'test',
      parent: null
    },
    world: {
      name:'world',
      slug: 'world',
    }
  }
}


if (fs.existsSync(configFile)) {
  configFromFile = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
  config = _.merge(config, configFromFile)
}

// var baseDir = process.cwd()
var baseDir = 'E:/versioncontrol/doubangit/code/mine/node/github-blog';

['posts', 'public', 'tmp', 'themes'].forEach(function (name) {
  config.paths[name]  = baseDir + config.paths[name]
})
config.paths.theme = config.paths.themes + '/' + config.theme

urlConfig.setConfig(config)
config = _.merge(config, urlConfig)

module.exports = config
