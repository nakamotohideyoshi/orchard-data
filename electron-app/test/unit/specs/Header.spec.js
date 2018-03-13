import { mount } from 'avoriaz'
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
      submissions: () => SUBMISSIONS,
      [`${SUBMISSIONS}`]: () => []
    }

    store = new Vuex.Store({
      getters,
      state
    })

    wrapper = mount(Header, {
      router,
      store
    })
  })

  it('should render correct header', () => {
    expect(wrapper.is('div')).to.equal(true)
  })

  // TODO: Write test cases for the following:
  //      * No items in array
  //      * Items in array
  //      * No array at all (undefined or null)
})
