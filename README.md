# webpack-server-render-middleware

[![npm](https://img.shields.io/npm/v/webpack-server-render-middleware.svg)](https://www.npmjs.com/package/webpack-server-render-middleware)
[![Travis](https://img.shields.io/travis/wuct/webpack-server-render-middleware.svg)](https://travis-ci.org/wuct/webpack-server-render-middleware)
[![Codecov](https://img.shields.io/codecov/c/github/wuct/webpack-server-render-middleware/master.svg)](https://codecov.io/github/wuct/webpack-server-render-middleware)
[![Code Climate](https://img.shields.io/codeclimate/github/wuct/webpack-server-render-middleware.svg)](https://codeclimate.com/github/wuct/webpack-server-render-middleware)

**THIS MIDDLEWARE SHOULD ONLY USED FOR DEVELOPMENT!**

**DO NOT USE IT IN PRODUCTION!**


## What is this?

This project is like [`webpack-dev-middleware`](https://github.com/webpack/webpack-dev-middleware) but for server-side bundling. 

## Usage

``` javascript
import webpackSeverRenderMiddleware from 'webpack-server-render-middleware'

app.use(webpackSeverRenderMiddleware(...))
app.use((req, res) => {
  const serverBundle = res.serverBundle
  // than use your bundle here to render pages
})
```
