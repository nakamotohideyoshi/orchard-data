import Vue from 'vue'
import { mount } from 'avoriaz'
import VueRouter from 'vue-router'
import App from '@/App'
import router from '../../../src/renderer/router'

describe('App.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(App, {
      router: router
    })
  })

  it('should render correct App', () => {
    Vue.use(VueRouter)
    expect(wrapper.is('#app')).to.equal(true)
  })
})