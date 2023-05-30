// eslint-disable-next-line @typescript-eslint/no-var-requires
const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://10.16.112.16:4000/',
      changeOrigin: true,
    })
  )

  app.use(
    '/websock',
    createProxyMiddleware({
      target: 'http://127.0.0.1:9000/',
      changeOrigin: true
    })
  )
}