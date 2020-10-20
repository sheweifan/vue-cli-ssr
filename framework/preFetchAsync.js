export default (router, store, cookie, logger = console) =>
  new Promise((resolve, reject) => {
    const matchedComponents = router.getMatchedComponents()
    if (!matchedComponents || !matchedComponents.length) {
      return reject({
        code: '404'
      })
    }
    Promise.all(
      matchedComponents.map(component => {
        logger.info('----- preFetch inside -----\n')
        let prefetch = Promise.resolve()

        if (component.dataStore) {
          let storeList = Array.isArray(component.dataStore)
            ? [...component.dataStore]
            : [component.dataStore]

          storeList.forEach(ds => {
            const { name, store: _store } = ds
            logger.info('----- preFetch storeList -----\n')

            if (!store.state[name]) {
              store.registerModule(name, _store)
            }
          })
        }

        if (component.preFetch) {
          prefetch = component
            .preFetch(
              {
                store,
                cookie,
                route: router.currentRoute
              },
              logger
            )
            .then(() => {
              return Promise.resolve()
            })
            .catch(e => {
              return Promise.reject(e)
            })
        }
        return prefetch
      })
    )
      .then(resolve)
      .catch(e => reject(e))
  })
