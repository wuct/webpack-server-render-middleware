import { test } from 'ava'
import webpack from 'webpack'
import config from './webpack.config'
import webpackServerRenderMiddleware from '../index.js'

test.cb('ok', t => {
  t.plan(2)

  const compiler = webpack(config)
  const middleware = webpackServerRenderMiddleware(compiler, { quiet: false })

  const res = {}

  middleware({}, res, () => {
    t.is(
      res.serverBundle.default(),
      'ok'
    )

    t.is(
      !!res.serverBundleStat.chunks,
      true
    )

    t.end()
  })
})

