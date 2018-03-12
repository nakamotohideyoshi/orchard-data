import { shallow } from 'avoriaz'
import Vuex from 'vuex'
import Vue from 'vue'
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
      getConfig: sinon.stub(),
      fetchSubmissions: sinon.stub()
    }

    store = new Vuex.Store({
      getters,
      actions
    })

    wrapper = shallow(App, {
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

  it('should call actions were called from store', () => {
    wrapper.update()

    Vue.nextTick(() => {
      expect(actions.getConfig.calledOnce).to.equal(true)
      expect(actions.fetchSubmissions.calledOnce).to.equal(true)
    })
  })

  // TODO:
  //     * Write case for when no config could be fetched
  //     * Write case for when no submissions where found
})
