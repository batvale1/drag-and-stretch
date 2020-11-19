import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import cards from './cards/cards';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { cards },
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    cards,
  },
  plugins: [new VuexPersistence().plugin],
})

export default store
