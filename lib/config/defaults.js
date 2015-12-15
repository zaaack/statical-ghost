module.exports = {
  theme: 'Casper',
  paths: {
    subdir: '',
    imagesRelPath: '',
    posts: '/posts',
    public: '/public',
    tmp: '/tmp',
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
    hello: {
      name: 'hello',
      slug: 'hello',
      description: null,
      image: null,
      hidden: null,
      meta_title: 'test',
      meta_description: 'test',
      parent: null
    },
    world: {
      name: 'world',
      slug: 'world',
    }
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
