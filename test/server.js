/* eslint prefer-template:0 */
import Express from 'express'
import webpack from 'webpack'
import path from 'path'
import webpackServerRenderMiddleware from '../index.js'

const compiler = webpack(require('./webpack.config').default)

const app = new Express()

app.use(webpackServerRenderMiddleware(compiler, { quiet: false }))

app.use((req, res) => {
  console.log('ok')
  // const serverSideRender = (res.serverBundle && res.serverBundle.default)
  // serverSideRender()
})


/* eslint no-console:0, consistent-return:0 */
app.listen(8081, err => {
  if (err) {
    return console.error(err)
  }
  console.log(`🐖  💨  The web server is listening to 8081`)
})
