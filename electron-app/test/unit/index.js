import Vue from 'vue'
import VModal from 'vue-js-modal'
Vue.config.devtools = false
Vue.config.productionTip = false

// mock component
const routerView = {
    name: 'router-view',
    render: h => h('div'),
};

const routerLink = {
    name: 'router-link',
    // can't use arrow function, otherwise the wrong context is set
    render: function (h) {
        return h('a', {}, this.$slots.default)
    }
};

// register global modal component, similar to what is being done in `src/renderer/main.js`
const reportSummaryHeader = {
    name: 'report-summary-header',
    render: h => h('div')
}

const emptyState = {
  name: 'empty-state',
  render: h => h('div')
}

Vue.use(VModal, { dynamic: true })

// register mock components
Vue.component('router-view', routerView);
Vue.component('router-link', routerLink);
Vue.component('report-summary-header', reportSummaryHeader);
Vue.component('empty-state', emptyState);

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
// const srcContext = require.context('../../src/renderer', true, /^\.\/(?!main(\.js)?$)/)
const srcContext0 = require.context('../../src/renderer/assets', true, /^app.sass$/)
srcContext0.keys().forEach(srcContext0)

const srcContext1 = require.context('../../src/renderer/store', true)
srcContext1.keys().forEach(srcContext1)

