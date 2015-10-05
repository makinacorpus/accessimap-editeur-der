# Accessimap - Éditeur de dessins en relief
[![Build Status](https://travis-ci.org/makinacorpus/accessimap-editeur-der.svg?branch=master)](https://travis-ci.org/makinacorpus/accessimap-editeur-der)
[![Coverage Status](https://coveralls.io/repos/makinacorpus/accessimap-editeur-der/badge.svg?branch=master&service=github)](https://coveralls.io/github/makinacorpus/accessimap-editeur-der?branch=master)

### Requirements
- gem
- npm (version > 1.2.10)
- grunt (`npm install -g grunt-cli`)

### Install
- `npm install`
- `bower install`
- `grunt serve`
- look your browser

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