<a href="https://github.com/synquery/logos">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/synquery/logos/HEAD/synquery-web-patform.png" />
    <img src="https://raw.githubusercontent.com/synquery/logos/HEAD/synquery-web-patform.png" height="50" alt="synquery project logo" />
  </picture>
</a>


# Synquery Bootstrap [![Build Status](https://app.travis-ci.com/synquery/synquery-bootstrap.svg?branch=master)] [![synquery-bootstrap version](https://img.shields.io/badge/version-v0.0.1-yellow.svg)]

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


Or to install the latest version(requires shx):  
```sh
curl -o- https://raw.githubusercontent.com/synquery/synquery-bootstrap/refs/heads/main/cmd/setup.sh | bash
```
```sh
wget -qO- https://raw.githubusercontent.com/synquery/synquery-bootstrap/refs/heads/main/cmd/setup.sh | bash
```
