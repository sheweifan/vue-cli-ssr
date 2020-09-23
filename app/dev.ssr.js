const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const PWD = process.env.PWD

const webpack = require('webpack')
const axios = require('axios')
// memory-fs is a simple in-memory filesystem.
// Holds data in a javascript object
// See: https://github.com/webpack/memory-fs
const MemoryFS = require('memory-fs')

// Use parsed configuration as a file of webpack config
// See: https://cli.vuejs.org/zh/guide/webpack.html#%E5%AE%A1%E6%9F%A5%E9%A1%B9%E7%9B%AE%E7%9A%84-webpack-%E9%85%8D%E7%BD%AE
const webpackConfig = require(PWD +
  '/node_modules/@vue/cli-service/webpack.config')
// create a compiler of webpack config
const serverCompiler = webpack(webpackConfig)
// create the memory instance
const mfs = new MemoryFS()
// set the compiler output to memory
// See: https://webpack.docschina.org/api/node/#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F-custom-file-systems-
serverCompiler.outputFileSystem = mfs

let serverBundle
// Monitor webpack changes because server bundles need to be dynamically updated
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err

  stats = stats.toJson()
  stats.errors.forEach(error => console.error('ERROR:', error))
  stats.warnings.forEach(warn => console.warn('WARN:', warn))

  const bundlePath = path.join(
    webpackConfig.output.path,
    'vue-ssr-server-bundle.json'
  )

  console.log(`bundlePath`, bundlePath)

  try {
    serverBundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
    console.log('vue-ssr-server-bundle.json updated')
  } catch (e) {
    console.log('vue-ssr-server-bundle.json error')
  }
})

const resolve = file => path.resolve(__dirname, file)

const { createBundleRenderer } = require('vue-server-renderer')

const renderToString = (renderer, context) =>
  new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) =>
      err ? reject(err) : resolve(html)
    )
  })

const tempStr = fs.readFileSync(resolve(PWD + '/public/index.ejs'), 'utf-8')
const template = ejs.render(tempStr, { title: '{{title}}', mode: 'server' })

const clientHost = process.env.CLIENT_PORT || 'localhost'
const clientPort = process.env.CLIENT_PORT || 8080
const clientPublicPath = process.env.CLIENT_PUBLIC_PATH || '/'

const main = async (ctx, next) => {
  if (!serverBundle) {
    ctx.body = 'Wait Compiling...'
    return
  }

  ctx.set('content-type', 'text/html')
  ctx.set('x-powered-by', 'koa/development')

  const clientManifest = await axios.get(
    `http://${clientHost}:${clientPort}${clientPublicPath}vue-ssr-client-manifest.json`
  )

  const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: template,
    clientManifest: clientManifest.data,
    basedir: process.env.PWD
  })

  const context = {
    title: 'ssr mode',
    url: ctx.url
  }

  const html = await renderToString(renderer, context)

  ctx.body = html
}

module.exports = main
