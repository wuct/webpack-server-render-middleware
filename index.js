module.exports = (compiler, options) => {
  // the state, false: bundle invalid, true: bundle valid
  var state = false
  var callbacks = []

  var filename =
    `${compiler.options.output.path}/${compiler.options.output.filename}`

  compiler.plugin("done", (stats) => {
    if (!options.quiet) console.log(stats.toString({ color: true }))

    state = true

    delete require.cache[filename]

    // Do the stuff in nextTick, because bundle may be invalidated
    // if a change happend while compiling
    process.nextTick(() => {
      // check if still in valid state
      if(!state) returnw

      console.info("webpack: bundle is now VALID.")

      // execute callback that are delayed
      var cbs = callbacks
      callbacks = []
      cbs.forEach(cb => cb())
    })
  })

  function invalidPlugin() {
    if (state) {
      console.info("webpack: bundle is now INVALID.")
    }
    state = false
  }

  function invalidAsyncPlugin(_, callback) {
    invalidPlugin()
    callback()
  }

  compiler.plugin("invalid", invalidPlugin)
  compiler.plugin("watch-run", invalidAsyncPlugin)
  compiler.plugin("run", invalidAsyncPlugin)


  // wait for bundle valid
  function ready(fn, req) {
    if (state) return fn()
    console.log(`webpack: wait until bundle finished: ${req.url || fn.name}`)
    callbacks.push(fn)
  }

  compiler.watch(options.watchOptions, err => {
    if(err) throw err
  })

  function webpackDevMiddleware(req, res, next) {

    // delay the request until we have a vaild bundle
    ready(processRequest, req)

    function processRequest() {
      console.log('@@@ server')
      // server content
      const renderDOMString = require(filename).renderDOMString

      res.send('<!doctype html>\n' + renderDOMString())
    }
  }

  return webpackDevMiddleware
}
