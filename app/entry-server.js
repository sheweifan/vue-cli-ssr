import { createApp } from './main.js'

import preFetchAsync from '../framework/preFetchAsync'

// const urlCacheKeys = []

// const getCleanUrl = (query) => {
//   let parseUrl = ''
//   for (let i = 0; i < urlCacheKeys.length; i++) {
//     if (typeof query[urlCacheKeys[i]] !== 'undefined') {
//       parseUrl += `&${urlCacheKeys[i]}=${query[urlCacheKeys[i]]}`
//     }
//   }
//   return parseUrl
// }

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    router.push(context.url)

    router.onReady(() => {
      preFetchAsync(router, store, null)
        .then(() => {
          context.rendered = () => {
            context.state = Object.assign(
              {
                serverRendered: true
              },
              store.state
            )
          }
          resolve(app)
        })
        .catch(e => {
          reject(e)
          // if (e.code) {
          //   switch (+e.code) {
          //     case 302:
          //     case 301:
          //       ctx.redirect(e.data.url)
          //       break
          //   }
          //   reject(e)
          //   return e
          // }
        })

    }, reject)
  })
}
