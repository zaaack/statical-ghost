# statical-ghost
another static blog generator using ghost theme

# INSTALL

```sh
npm i -g statical-ghost
```

# FEATURES

* fast, generate thousands of posts only for seconds
* easy to use, see [usage](#usage)
*


# USAGE

## init blog folders

first, you need initialize folders in current directory.

```sh
sg init # or sg i
```

then, you got a structure like this:

```
<current directory>
  |-posts   # for your markdown posts, supports sub directory
  |-public  # this directory include the generated blog site
  |-tmp     # temp directory, speed up generating
  |-themes  # ghost themes
```

this command not only create directories, but also generate demo post, config.yaml and even downloading a default ghost theme Casper. You can right your posts in `/posts`.

after this command, actually you have already got everything ready, just enter next step.

## generate

now you can generate your blog, it's very fast because of using multi-process
```sh
sg generate # or sg g
```

## server

you can see your `/public` directory added many files, then run

```sh
sg server # or sg s
```

to start a local static server, it also auto generate your posts if posts or theme are changed.
now click <http://127.0.0.1:8080> to enjoy your blog !!!

## see help

```sh
sg -h
```
then you can get messages below:

```
Usage: sg sg [command] [options]


  Commands:

    generate|g             generate blog
    init|i                 initialize blog structure in current directory
    clean|c                clean temp dir
    deploy|d               deploy to server, use config.deploy in config.yaml as command
    generateAndDeploy|gd   generate and deploy
    server|s               start a static server, which would auto generate when posts changed

  another static glog generator by ghost theme

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -c, --config <path>  set config path. defaults to ./config.yaml
    -p, --port           the port of local server
```

## config file

config.yaml
```yaml
blog:
  url: 'http://localhost:8080'
  title: My Blog
  description: Keep It Simple and Stupid.
  logo: ''
  cover: ''
  navigation:
    - label: Index
      url: /
theme: Casper
deploy: git add -A;git commit -m 'new post';git push origin master;
# routeKeywords: # link 'author' in http://localhost:8080/author/me
#   tag: tag
#   author: author
#   page: page
paths:
  # subdir: 'blog'    #subdir for all urls, like "http://localhost:8080/blog/author/me"
  # imagesRelPath: '' not use yet
  posts: /posts # directory for your posts
  public: /public # directory for generated site
  tmp: /tmp # temp directory for speed up
  themes: /themes # directory for themes
posts:
  limit: 5   # the number of posts in each page
  permalinks: '/:year/:month/:day/:slug/' # link of post
author: me # default author
authors: #other authors
  me:
    name: me
    slug: me
    bio: Think
    # image: ''
    # cover: ''
    # website: ''
    # location: Beijing
    # meta_title: ''
    # meta_description: ''
tags: # all tags, it would be auto appended after appear in posts
  # hello:
  #   name: hello
  #   slug: hello
  #   description: ''
  #   image: ''
  #   hidden: ''
  #   meta_title: test
  #   meta_description: test
  #   parent: ''
  world:
    name: world
    slug: world

```

# TODO
