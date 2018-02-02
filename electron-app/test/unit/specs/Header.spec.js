import Vue from 'vue'
import { mount } from 'avoriaz'
import VueRouter from 'vue-router'
import Header from '@/components/pages/Header'
import router from '../../../src/renderer/router'

describe('Header.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Header, {
      router: router
    })
  })

  it('should render correct header', () => {
    Vue.use(VueRouter)
    expect(wrapper.is('div')).to.equal(true)
  })
})