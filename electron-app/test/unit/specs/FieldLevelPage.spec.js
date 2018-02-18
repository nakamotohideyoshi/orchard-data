import Vue from 'vue'
import { mount, shallow } from 'avoriaz'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import sinon from 'sinon'
import moment from 'moment'
import FieldLevelPage from '@/components/pages/FieldLevelPage'
import {
  FIELDS,
  FIELDS_REQUEST,
  FIELDS_FAILURE,
  FILTERS_META
} from '@/constants/types'
import module from '../../../src/renderer/store/modules/Submissions'
import router from '../../../src/renderer/router'

describe('FieldLevelPage.vue', () => {
  let wrapper
  let invalidWrapper
  let store
  let getters
  let actions
  let $validRoute
  let $invalidRoute
  let fields
  const noDataSetErrorMessage = 'No dataset ID defined'

  beforeEach(() => {
    getters = {
      error: () => FIELDS_FAILURE,
      loading: () => FIELDS_REQUEST,
      items: () => FIELDS,
      filters: () => FILTERS_META,
      [`${FIELDS}`]: () => [],
      [`${FIELDS_FAILURE}`]: () => ({}),
      [`${FILTERS_META}`]: () => ({}),
    }

    actions = {
      fetchFields: sinon.stub()
    }

    store = new Vuex.Store({
      getters,
      mutations: { ...module.mutations },
      actions
    })

    $validRoute = {
      name: 'field-level',
      params: {
        id: 1
      }
    }

    $invalidRoute = {
      name: 'field-level'
    }
  })

  it('should render correct function', () => {
    wrapper = shallow(FieldLevelPage, {
      router,
      store,
      globals: { $route: $validRoute }
    })

    expect(typeof wrapper.methods().show).to.equal('function')
    expect(typeof wrapper.methods().hide).to.equal('function')
    expect(typeof wrapper.methods().beforeOpen).to.equal('function')
    expect(typeof wrapper.methods().getFilter).to.equal('function')
    expect(typeof wrapper.methods().fetchFields).to.equal('function')
  })

  it('should verify vuex actions were executed on init', () => {
    wrapper = shallow(FieldLevelPage, {
      router,
      store,
      globals: { $route: $validRoute }
    })
    wrapper.update()

    expect(actions.fetchFields.calledOnce).to.equal(true)
  })

  it('should execute no vuex actions on init if no id is passed in the $route', async () => {
    wrapper = shallow(FieldLevelPage, {
      router,
      store,
      globals: { $route: $invalidRoute }
    })
    wrapper.update()

    expect(actions.fetchFields.calledOnce).to.equal(false)
    expect(wrapper.vm.error).to.be.an.instanceof(Object)
    // expect(wrapper.vm.error.message).to.equal(noDataSetErrorMessage)
  })

  // TODO: Assert layout
  //       * Check rendered table with valid items
  //       * Check rendered table with invalid items
  //       * Check rendered table with no items
})
