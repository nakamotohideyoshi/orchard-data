import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import {
  ACTIVE_REPORT_CATEGORY,
  SET_ACTIVE_CATEGORY,
  SALES_DEMO_MODE,
  SET_SALES_DEMO_MODE
} from '@/constants/types'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  state: {
    [SALES_DEMO_MODE]: false,
    [ACTIVE_REPORT_CATEGORY]: ''
  },

  getters: {
    [ACTIVE_REPORT_CATEGORY]: (s) => s[ACTIVE_REPORT_CATEGORY]
  },

  mutations: {
    [SET_ACTIVE_CATEGORY] (state, category) {
      state[ACTIVE_REPORT_CATEGORY] = category
    },

    [SET_SALES_DEMO_MODE] (state) {
      state[SALES_DEMO_MODE] = true
    }
  }
})
