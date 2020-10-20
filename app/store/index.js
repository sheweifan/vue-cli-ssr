import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// import { Book } from './book'

export function createStore() {
  return new Vuex.Store({
    modules: {
      // book: Book
    },
    state: {},
    mutations: {},
    actions: {},
  })
}
