import { shallow } from 'avoriaz'
import Vuex from 'vuex'
import sinon from 'sinon'
import FieldByFieldReport from '@/components/pages/FieldByFieldReport'
import { FIELDS, FIELDS_FAILURE, FILTERS_META, FIELD_BY_FIELD_REPORT, FIELDS_REQUEST, SUBMISSION } from '@/constants/types'
import module from '../../../src/renderer/store/modules/Submissions'
import router from '../../../src/renderer/router'

describe('FieldByFieldReport.vue', () => {
  let wrapper
  let store
  let getters
  let actions
  let $validRoute
  let $invalidRoute
  let state
  // const noDataSetErrorMessage = 'No dataset ID defined'

  beforeEach(() => {
    getters = {
      [SUBMISSION]: () => ({ status: 1, time: 1519789653 }),
      [FIELDS]: () => [],
      [FIELDS_FAILURE]: () => ({}),
      [FILTERS_META]: () => ({}),
      [FIELDS_REQUEST]: () => false
    }

    actions = {
      fetchFieldByFieldReport: sinon.stub(),
      fetchFields: sinon.stub()
    }

    state = { Reports: { [FIELD_BY_FIELD_REPORT]: [] } }

    store = new Vuex.Store({
      getters,
      mutations: { ...module.mutations },
      actions,
      state
    })

    $validRoute = {
      name: 'FieldByFieldReport',
      params: {
        id: 1
      }
    }

    $invalidRoute = {
      name: 'FieldByFieldReport',
      params: {}
    }

    wrapper = shallow(FieldByFieldReport, {
      router,
      store,
      globals: { $route: $validRoute }
    })
  })

  it('should render correct function', () => {
    expect(typeof wrapper.vm.show).to.equal('function')
    expect(typeof wrapper.vm.hide).to.equal('function')
    expect(typeof wrapper.vm.getFilter).to.equal('function')
    // expect(typeof wrapper.vm.fetchFieldByFieldReport).to.equal('function')
  })

  /*
  it('should verify vuex actions were executed on init', () => {
    wrapper.update()

    expect(actions.fetchFieldByFieldReport.calledOnce).to.equal(true)
  })
  */
  it('should verify vuex actions were executed on init', () => {
    wrapper.update()

    expect(actions.fetchFields.calledOnce).to.equal(true)
  })

  it('should NOT execute vuex actions on init if no id is passed in the $route', async () => {
    actions = {
      fetchFieldByFieldReport: sinon.stub(),
      fetchFields: sinon.stub()
    }
    wrapper = shallow(FieldByFieldReport, {
      router,
      store,
      getters,
      globals: { $route: $invalidRoute }
    })
    // wrapper.update()

    // expect(actions.fetchFieldByFieldReport.calledOnce).to.equal(false)
    expect(actions.fetchFields.called).to.equal(false)
    expect(wrapper.vm.error).to.be.an.instanceof(Object)
    // expect(wrapper.vm.error.message).to.equal(noDataSetErrorMessage)
  })

  // TODO: Assert layout
  //       * Check rendered table with valid items
  //       * Check rendered table with invalid items
  //       * Check rendered table with no items
})
