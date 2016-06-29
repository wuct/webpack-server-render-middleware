/* eslint no-console:0 no-param-reassign:0 */
import MemoryFileSystem from 'memory-fs'
import evalAsModule from 'eval-as-module'

const middlewareCreator = (compiler, options) => {
  // the state, false: bundle invalid, true: bundle valid
  let state = false
  let queue = []
  const fs = compiler.outputFileSystem = new MemoryFileSystem()


  const watchOptions = {
    aggregateTimeout: 200,
    ...options.watchOptions,
  }

  const filename =
    `${compiler.options.output.path}/${compiler.options.output.filename}`

  compiler.plugin('done', (stats) => {
    if (!options.quiet) console.log(stats.toString())

    state = true

    delete require.cache[filename]

    // Do the stuff in nextTick, because bundle may be invalidated
    // if a change happend while compiling
    process.nextTick(() => {
      // check if still in valid state
      if (!state) return

      console.info('webpack: bundle is now VALID.')

      // execute callbacks that are delayed
      queue.forEach(cb => cb())
      queue = []
    })
  })

  const invalidPlugin = () => {
    if (state) {
      console.info('webpack: server bundle is now INVALID.')
    }
    state = false
  }

  const invalidAsyncPlugin = (_, callback) => {
    invalidPlugin()
    callback()
  }

  compiler.plugin('invalid', invalidPlugin)
  compiler.plugin('watch-run', invalidAsyncPlugin)
  compiler.plugin('run', invalidAsyncPlugin)

  // wait for bundle valid
  const ready = (fn, req) => {
    if (state) return fn()
    console.log(`webpack: wait until server bundle finished: ${req.url || fn.name}`)
    return queue.push(fn)
  }

  compiler.watch(watchOptions, err => {
    if (err) throw err
  })

  return (req, res, next) => {
    // delay the request until we have a vaild bundle
    ready(processRequest, req)

    function processRequest() {
      const buffer = fs.readFileSync(filename)
      const bundleModule = evalAsModule(buffer.toString(), filename)
      res.serverBundle = bundleModule.exports
      next()
    }
  }
}

export default middlewareCreator
