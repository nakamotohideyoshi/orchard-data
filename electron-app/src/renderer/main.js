import Vue from 'vue'
import axios from 'axios'
import VModal from 'vue-js-modal'

import App from './App'
import router from './router'
import store from './store'
import ReportSummaryHeader from '@/components/sections/ReportSummaryHeader'

Vue.use(VModal)
// Vue.use(VModal, { dialog: true })

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

export const eventHub = new Vue()

// Register global components
Vue.component('report-summary-header', ReportSummaryHeader)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
