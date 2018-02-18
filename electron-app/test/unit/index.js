import Vue from 'vue'
Vue.config.devtools = false
Vue.config.productionTip = false

// mock component
const routerView = {
    name: 'router-view',
    render: h => h('div'),
};

// register mock components
Vue.component('router-view', routerView);
// TODO: Find a better way to register a dinamically rendered component
// to prevent avoid (bad) karma warnings
// Vue.component('router-link', ¿?¿?¿?);

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

