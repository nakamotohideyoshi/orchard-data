import Vue from 'vue'
import { mount } from 'avoriaz'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Header from '@/components/pages/Header'
import router from '../../../src/renderer/router'
import {
  SUBMISSIONS
} from '@/constants/types'

describe('Header.vue', () => {
  let wrapper
  let getters
  let store
  let state

  beforeEach(() => {
    state = {
      [`${SUBMISSIONS}`]: []
    }

    getters = {
      [`${SUBMISSIONS}`]: () => item
    }

    store = new Vuex.Store({
      getters,
      state
    })

    wrapper = mount(Header, {
      router,
      store
    })
    Vue.use(VueRouter)
    Vue.use(Vuex)
  })

  it('should render correct header', () => {
    expect(wrapper.is('div')).to.equal(true)
  })
})
