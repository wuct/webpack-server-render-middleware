import webpack from 'webpack'
import config from './webpack.config'
import webpackServerRenderMiddleware from '../index.js'

test('ok', () => {
  expect.assertions(2)

  const compiler = webpack(config)
  const middleware = webpackServerRenderMiddleware(compiler, { quiet: false })

  const res = {}

  return new Promise(resolve => {
    middleware({}, res, () => {
      // For: https://github.com/facebook/jest/issues/6046
      setTimeout(() => {
        expect(!!res.serverBundleStat.chunks).toBe(true)
        expect(res.serverBundle.default()).toBe('ok')

        resolve()
      }, 100)
    })
  })
})
