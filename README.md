### Ce projet a déménagé !

### Merci d'aller sur https://gitlab.com/makinacorpus/accessimap/accessimap-lecteur-der

# Accessimap - Éditeur de dessins en relief
[![Build Status](https://travis-ci.org/makinacorpus/accessimap-editeur-der.svg?branch=master)](https://travis-ci.org/makinacorpus/accessimap-editeur-der)
[![Coverage Status](https://coveralls.io/repos/makinacorpus/accessimap-editeur-der/badge.svg?branch=master&service=github)](https://coveralls.io/github/makinacorpus/accessimap-editeur-der?branch=master)

## Requirements

- on linux mint, 
    + `sudo apt-get install build-essential patch`
    + `sudo apt-get install ruby-dev zlib1g-dev liblzma-dev`    
- npm (version > 1.2.10)
- bower (`npm install -g bower`)
- karma (`npm install -g karma`)

## Install

- `bower install`
- `npm install`
- `npm start`
- look your favorite browser opening accessimap !


If you encounter a 'bug' like 'watching tasks too numerous', 
or an error like `Error: watch /home/user/workspaces/accessimap-editeur-der/app/scripts/directives ENOSPC` 
you'll have to increase your max user watch :

https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers

``` sh
sysctl fs.inotify.max_user_watches
sudo sysctl fs.inotify.max_user_watches=32768
sysctl fs.inotify.max_user_watches
```

If after a reboot the problem is the same, and fs.inotify.max_user_watches return his old value, you can also modify /etc/sysctl.conf by adding this line at the end :

``` sh
fs.inotify.max_user_watches=32768

```

Normally, if you reboot, it will be ok. If not, please tell us in an issue.

## Publish on gh-pages

Publishing on GitHub Pages is automatically done by Travis.

Each commit on master will trigger a build/test in Travis, and if it succeed, 
it will deploy and commit the build on GitHub Pages.

By the way, if you want to do it manually, you can do this :

``` sh
npm build
```

Then copy the dist/v2 into the *gh-pages* branch, commit & push it.
