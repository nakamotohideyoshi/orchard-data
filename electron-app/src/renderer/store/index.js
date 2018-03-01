import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  state: {
    active_report_category: ''
  },

  mutations: {
    SET_ACTIVE_CATEGORY (state, category) {
      state.active_report_category = category
    }
  }
})
