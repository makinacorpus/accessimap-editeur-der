# Accessimap - Éditeur de dessins en relief
[![Build Status](https://travis-ci.org/makinacorpus/accessimap-editeur-der.svg?branch=master)](https://travis-ci.org/makinacorpus/accessimap-editeur-der)
[![Coverage Status](https://coveralls.io/repos/makinacorpus/accessimap-editeur-der/badge.svg?branch=master&service=github)](https://coveralls.io/github/makinacorpus/accessimap-editeur-der?branch=master)

### Requirements

`sudo apt-get install ruby-dev gem karma`

- gem
- ruby-dev (sudo apt-get install ruby-dev)
- karma (sudo apt-get install karma)

- npm (version > 1.2.10)
- grunt (`npm install -g grunt-cli`)
- gulp (`npm install -g gulp`)

- sass / compass ? (sudo gem install compass) avec ruby-dev d'installé

### Install

- 'npm i bower grunt-cli'
- 'gem install compass'
- 'bower install'
- `npm install`
- `grunt serve`
- look your browser


If you encounter a 'bug' like 'watching tasks too numerous', or an error like 'Error: watch /home/user/workspaces/accessimap-editeur-der/app/scripts/directives ENOSPC' you'll have to increase your max user watch :

https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers

~~~~

$ sysctl fs.inotify.max_user_watches

$ sudo sysctl fs.inotify.max_user_watches=32768

$ sysctl fs.inotify.max_user_watches

~~~

If after a reboot the problem is the same, and fs.inotify.max_user_watches return his old value, you can also modify /etc/sysctl.conf by adding this line at the end :

~~~~

fs.inotify.max_user_watches=32768

~~~

Normally, if you reboot, it will be ok.

### Publish on gh-pages
``` sh
grunt build
git subtree push --prefix dist origin gh-pages
```

### PDFJS
In bower_components/pdfjs-dist/bower.json, this part:
``` json
  "main": [
    "build/pdf.js",
    "build/pdf.worker.js"
  ],
```
should be replaced by this:

``` json
  "main": [
    "build/pdf.combined.js"
  ],
```