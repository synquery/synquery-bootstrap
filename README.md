<a href="https://github.com/synquery/logos">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/synquery/logos/blob/4d523a4dc1a6115979a051cdc3e18d3294836968/synquery-web-platform.png" />
    <img src="https://github.com/synquery/logos/blob/4d523a4dc1a6115979a051cdc3e18d3294836968/synquery-web-platform.png" height="50" alt="synquery project logo" />
  </picture>
</a>


# Synquery Bootstrap ![Build Status](https://app.travis-ci.com/synquery/synquery-bootstrap.svg?branch=master) ![synquery-bootstrap version](https://img.shields.io/badge/version-v0.0.1-yellow.svg)

<!-- To update this table of contents, ensure you have run `npm install` then `npm run doctoc` -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Intro](#intro)
- [About](#about)
- [Installing and Updating](#installing-and-updating)
  - [Install & Update Script](#install--update-script)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Intro

`synquery-bootstrap` allows you to quickly install and setup develop environment with synquery web-platform via the command line.

**Example:**
```sh
$ sb use [project id]
Now ready to execute \#project_id 
```

Simple as that!

`synquery-bootstrap` also provides convenience tools for building Single-Session Application:

**1. HTML replacer**
```sh
# change parcel absolute paths to relative
$ node .sb/etc/replacer.js relativize -a

# add or modify html node in bulk
$ node .sb/etc/replacer.js add -a head content-type "<meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\">"

# delete html node in bulk
$ node .sb/etc/replacer.js del head meta,content-type
```

## Synquery web-platform technology basis

- [Node.js](https://nodejs.org/)
- [Mongodb](https://www.mongodb.com/)
- [Yarn package manager](https://yarnpkg.com/cli/install)
- [Parcel](https://parceljs.org/)
- [Foonyah CI](https://github.com/ystskm/foonyah-ci/)

## About
synquery-bootstrap needs the well-known javascript runtime [node.js](https://nodejs.org/en/). We recommend to install [nvm](https://github.com/nvm-sh/nvm) before installing this module.

<a id="installation-and-update"></a>
<a id="install-script"></a>
## Installing and Updating

### Install & Update Script

After installing [node.js](https://nodejs.org/en/), you should make your project directory and move into it.
```sh
mkdir myproject
cd myproject
```

Then, to install the release version:  
```sh
npm install synquery-bootstrap
```


Or to install the latest version(only on bash environment):  
```sh
curl -o- https://raw.githubusercontent.com/synquery/synquery-bootstrap/refs/heads/main/cmd/setup.sh | bash
```
```sh
wget -qO- https://raw.githubusercontent.com/synquery/synquery-bootstrap/refs/heads/main/cmd/setup.sh | bash
```
