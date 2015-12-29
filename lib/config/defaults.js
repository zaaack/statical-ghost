module.exports = {
  theme: 'Casper',
  paths: {
    subdir: '',
    imagesRelPath: '',
    posts: '/posts',
    public: '/public',
    tmp: '/tmp',
    files: '/files',
    themes: '/themes',
    theme: ''
  },
  blog: {
    url: 'http://localhost',
    title: "My Blog",
    description: 'Keep It Simple and Stupid.',
    logo: '',
    cover: '',
    navigation: [{
      label: '首页',
      url: '/'
    }]
  },
  timeFormat: 'YYYY-MM-DD HH:mm:ss',
  author: 'me', //slug
  authors: {
    me: {
      name: 'me',
      slug: 'me',
      image: null,
      cover: null,
      bio: 'Think',
      website: '',
      location: '北京',
      meta_title: null,
      meta_description: null,
    }
  },
  tags: {
  },
  posts: {
    limit: 5,
    permalinks: '/:year/:month/:day/:slug/'
  },
  routeKeywords: {
    tag: 'tag',
    author: 'author',
    page: 'page'
  }
}
