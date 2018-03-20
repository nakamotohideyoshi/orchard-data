import { shallow } from 'avoriaz'
import Vuex from 'vuex'
import sinon from 'sinon'
import ReportSummary from '@/components/pages/ReportHome'

import {
  SUBMISSION,
  SET_ACTIVE_CATEGORY,
  ACTIVE_REPORT_CATEGORY,
  REPORT_SUMMARY
  /* Stubbing to pass lint, will work on it later
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE
  */
} from '@/constants/types'

import {
  CUSTOM_CATEGORY,
  ITUNES_CATEGORY,
  OVERALL_CATEGORY
} from '@/constants/report-category'

import router from '../../../src/renderer/router'

describe('ReportHome.vue', () => {
  let wrapper
  let getters
  let mutations
  let store
  let actions
  let state
  let $validRoute
  const item = {
    rowid: 1,
    source: '/dir/1-spanish.tsv',
    artist_blacklist: 'Test',
    keyword_blacklist: 'test',
    duplicates_threshold: 1,
    various_artists_threshold: 1,
    lang: 'en-ES',
    status: 1,
    time: 1518462941917
  }

  beforeEach(() => {
    getters = {
      error: () => ({}),
      loading: () => false,
      item: () => item,
      [`${SUBMISSION}`]: () => item,
      [ACTIVE_REPORT_CATEGORY]: () => ''
    }

    mutations = {
      [SET_ACTIVE_CATEGORY]: () => { }
    }

    state = { Reports: { [REPORT_SUMMARY]: {
          category: {
            itunes: {},
            risk: {}
          }
        }
      }
    }

    actions = {
      fetchSummary: sinon.stub()
    }

    store = new Vuex.Store({
      getters,
      actions,
      mutations,
      state
    })

    $validRoute = {
      name: 'report-home',
      params: {
        id: 1
      }
    }

    wrapper = shallow(ReportSummary, {
      router,
      store,
      globals: { $route: $validRoute }
    })

    actions.fetchSummary.resetHistory()
  })

  it('should render correct function', () => {
    expect(typeof wrapper.vm.showOverallRisk).to.equal('function')
    expect(typeof wrapper.vm.showAppleTab).to.equal('function')
    expect(typeof wrapper.vm.showCustom).to.equal('function')
  })

  it('should set flags when calling overallRiskFlag method', () => {
    wrapper.vm.showOverallRisk()
    wrapper.update()
    expect(wrapper.vm.overallRiskFlag).to.equal(true)
    expect(wrapper.vm.appleTabFlag).to.equal(false)
    expect(wrapper.vm.customFlag).to.equal(false)
  })

  it('should have proper computed props', () => {
    expect(wrapper.vm.itunesQualityData).to.be.an('object')
    expect(wrapper.vm.riskQualityData).to.be.an('object')
    expect(wrapper.vm.summaryData).to.be.an('object')
    expect(wrapper.vm.batchId).to.be.a('number')
    expect(wrapper.vm.fileName).to.be.a('string')
    expect(wrapper.vm.time).to.be.a('string')
    expect(wrapper.vm.status).to.be.a('number')
    expect(wrapper.vm.itemid).to.be.a('number')
  })

  it('should set flags when calling showAppleTab method', () => {
    wrapper.vm.showAppleTab()
    wrapper.update()
    expect(wrapper.vm.overallRiskFlag).to.equal(false)
    expect(wrapper.vm.appleTabFlag).to.equal(true)
    expect(wrapper.vm.customFlag).to.equal(false)
  })

  it('should set flags when calling showCustom method', () => {
    wrapper.vm.showCustom()
    wrapper.update()
    expect(wrapper.vm.overallRiskFlag).to.equal(false)
    expect(wrapper.vm.appleTabFlag).to.equal(false)
    expect(wrapper.vm.customFlag).to.equal(true)
  })

  it('should render apple tab data from getters', () => {
    const tabButton = wrapper.contains('.report__tabs.report__tabs--left .apple-tab.is-active')
    const tab = wrapper.contains('.report-container.apple-tab.is-active')

    expect(tabButton).to.equal(true)
    expect(tab).to.equal(true)
  })

  it('should render custom tab data from getters', () => {
    // Switch tab and check data
    wrapper.vm.showCustom()
    wrapper.update()

    const tabButton = wrapper.contains('.report__tabs.report__tabs--left .custom-tab.is-active')
    const tab = wrapper.contains('.report-container.custom-tab.is-active')

    expect(tabButton).to.equal(true)
    expect(tab).to.equal(true)
  })

  it('should have proper text for tabs', () => {
    const overall = wrapper.find('.report__tab.overall-tab ')[0]
    const itunes = wrapper.find('.report__tab.apple-tab ')[0]
    const custom = wrapper.find('.report__tab.custom-tab ')[0]

    expect(overall.text().trim()).to.equal(OVERALL_CATEGORY)
    expect(itunes.text().trim()).to.equal(ITUNES_CATEGORY)
    expect(custom.text().trim()).to.equal(CUSTOM_CATEGORY)
  })

  it('should default to "OVERALL_CATEGORY" if that is set in the application state', () => {
    getters = {
      error: () => ({}),
      loading: () => false,
      item: () => item,
      [`${SUBMISSION}`]: () => item,
      [ACTIVE_REPORT_CATEGORY]: () => OVERALL_CATEGORY
    }

    store = new Vuex.Store({
      getters,
      actions,
      mutations,
      state
    })

    wrapper = shallow(ReportSummary, {
      router,
      store,
      globals: { $route: $validRoute }
    })

    expect(wrapper.vm.overallRiskFlag).to.equal(true)
    expect(wrapper.vm.appleTabFlag).to.equal(false)
    expect(wrapper.vm.customFlag).to.equal(false)
  })

  it('should default to "ITUNES_CATEGORY" if that is set in the application state', () => {
    getters = {
      error: () => ({}),
      loading: () => false,
      item: () => item,
      [`${SUBMISSION}`]: () => item,
      [ACTIVE_REPORT_CATEGORY]: () => ITUNES_CATEGORY
    }

    store = new Vuex.Store({
      getters,
      actions,
      mutations,
      state
    })

    wrapper = shallow(ReportSummary, {
      router,
      store,
      globals: { $route: $validRoute }
    })

    expect(wrapper.vm.overallRiskFlag).to.equal(false)
    expect(wrapper.vm.appleTabFlag).to.equal(true)
    expect(wrapper.vm.customFlag).to.equal(false)
  })

  it('should default to "CUSTOM_CATEGORY" if that is set in the application state', () => {
    getters = {
      error: () => ({}),
      loading: () => false,
      item: () => item,
      [`${SUBMISSION}`]: () => item,
      [ACTIVE_REPORT_CATEGORY]: () => CUSTOM_CATEGORY
    }

    store = new Vuex.Store({
      getters,
      actions,
      mutations,
      state
    })

    wrapper = shallow(ReportSummary, {
      router,
      store,
      globals: { $route: $validRoute }
    })

    expect(wrapper.vm.overallRiskFlag).to.equal(false)
    expect(wrapper.vm.appleTabFlag).to.equal(false)
    expect(wrapper.vm.customFlag).to.equal(true)
  })

  it('should default to "CUSTOM_CATEGORY" if the report has a status of 3', () => {
    item.status = 3

    getters = {
      error: () => ({}),
      loading: () => false,
      item: () => item,
      [`${SUBMISSION}`]: () => item,
      [ACTIVE_REPORT_CATEGORY]: () => ''
    }

    store = new Vuex.Store({
      getters,
      actions,
      mutations,
      state
    })

    wrapper = shallow(ReportSummary, {
      router,
      store,
      globals: { $route: $validRoute }
    })

    expect(wrapper.vm.overallRiskFlag).to.equal(false)
    expect(wrapper.vm.appleTabFlag).to.equal(false)
    expect(wrapper.vm.customFlag).to.equal(true)
  })

  // TODO: Write test for the following cases:
  //       * Failure on upload
  //       * Malformed data in uploaded file
  //       * Invalid file extension (if applies, maybe this is a e2e one instead)
})
