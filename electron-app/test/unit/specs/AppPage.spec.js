import { mount } from 'avoriaz'
import Vuex from 'vuex'
import sinon from 'sinon'
import App from '@/App'
import {
  FILTERS_META,
  CONFIG_FAILURE
} from '@/constants/types'
import router from '../../../src/renderer/router'

describe('App.vue', () => {
  let wrapper
  let store
  let getters
  let actions

  before(() => {
    getters = {
      error: () => FILTERS_META,
      loaded: () => CONFIG_FAILURE,
      [`${FILTERS_META}`]: () => [],
      [`${CONFIG_FAILURE}`]: () => ({})
    }

    actions = {
      getConfig: sinon.stub()
    }

    store = new Vuex.Store({
      getters,
      actions
    })

    wrapper = mount(App, {
      router,
      store
    })
  })

  it('should verify methods are defined', () => {
    expect(typeof wrapper.vm.retry).to.equal('function')
  })

  it('should render correct App', () => {
    expect(wrapper.is('#app')).to.equal(true)
  })

  // TODO: Write case for when no config could be fetched
})
