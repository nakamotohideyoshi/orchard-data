import { shallow } from 'avoriaz'
import Vuex from 'vuex'
import sinon from 'sinon'
import FieldByFieldReport from '@/components/pages/FieldByFieldReport'
import ReportSummaryLabel from '@/components/ReportSummaryLabel'
import {
  FIELDS,
  FIELDS_REQUEST,
  FIELDS_FAILURE,
  FILTERS_META,
  FIELD_BY_FIELD_REPORT,
  SUBMISSION
} from '@/constants/types'
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
      // error: () => FIELDS_FAILURE,
      // loading: () => FIELDS_REQUEST,
      // items: () => FIELDS,
      [SUBMISSION]: () =>  ({status: 1, time: 1519789653}),
      [`${FIELDS}`]: () => [],
      [`${FIELDS_FAILURE}`]: () => ({}),
      [`${FILTERS_META}`]: () => ({})
    }

    actions = {
      fetchFieldByFieldReport: sinon.stub()
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
  })

  it('should render correct function', () => {
    wrapper = shallow(FieldByFieldReport, {
      router,
      store,
      globals: { $route: $validRoute }
    })

    expect(typeof wrapper.vm.show).to.equal('function')
    expect(typeof wrapper.vm.hide).to.equal('function')
    expect(typeof wrapper.vm.beforeOpen).to.equal('function')
    expect(typeof wrapper.vm.getFilter).to.equal('function')
    expect(typeof wrapper.vm.fetchFieldByFieldReport).to.equal('function')
  })

  it('should have the correct report title', () => {
      wrapper = shallow(FieldByFieldReport, {
          router,
          store,
          globals: { $route: $validRoute }
      })
      const label = wrapper.find('.report-summary__text--red')[0]

      expect(label.text().trim()).to.equal('Every Error')
  })

  it('should have a `ReportSummaryLabel` component', () => {
      wrapper = shallow(FieldByFieldReport, {
          router,
          store,
          globals: { $route: $validRoute }
      })

      expect(wrapper.contains(ReportSummaryLabel)).to.equal(true)
  })

  it('should verify vuex actions were executed on init', () => {
    wrapper = shallow(FieldByFieldReport, {
      router,
      store,
      globals: { $route: $validRoute }
    })
    wrapper.update()

    expect(actions.fetchFieldByFieldReport.calledOnce).to.equal(true)
  })

  it('should execute no vuex actions on init if no id is passed in the $route', async () => {
    wrapper = shallow(FieldByFieldReport, {
      router,
      store,
      globals: { $route: $invalidRoute }
    })
    // wrapper.update()

    expect(actions.fetchFieldByFieldReport.calledOnce).to.equal(false)
    expect(wrapper.vm.error).to.be.an.instanceof(Object)
    // expect(wrapper.vm.error.message).to.equal(noDataSetErrorMessage)
  })

  // TODO: Assert layout
  //       * Check rendered table with valid items
  //       * Check rendered table with invalid items
  //       * Check rendered table with no items
})
