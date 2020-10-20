import Vue from 'vue'

const getBookFromBackendApi = id =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: '《地球往事》', price: 100, id:id })
    }, 300)
  })

export const Book = {
  namespaced: true,

  state: {
    items: {}
  },

  actions: {
    fetchItem({ commit }, id) {
      return getBookFromBackendApi(id).then(item => {
        console.log(`item`, item)
        commit('setItem', { id, item })
      })
    }
  },

  mutations: {
    setItem(state, { id, item }) {
      Vue.set(state.items, id, item)
    }
  }
}
