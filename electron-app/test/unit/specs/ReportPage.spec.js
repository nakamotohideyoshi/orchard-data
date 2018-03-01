import { mount } from 'avoriaz'
import Vuex from 'vuex'
import sinon from 'sinon'
import moment from 'moment'
import ReportSummary from '@/components/pages/ReportSummary'
import ReportSummaryLabel from '@/components/ReportSummaryLabel'
import {
  SUBMISSION
  /* Stubbing to pass lint, will work on it later
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE
  */
} from '@/constants/types'
import router from '../../../src/renderer/router'

describe('ReportSummary.vue', () => {
  let wrapper
  let getters
  let store
  let actions
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
  const parsedTime = moment(item.time).format('MM-DD-YYYY. HH:mm')

  beforeEach(() => {
    getters = {
      error: () => ({}),
      loading: () => false,
      item: () => item,
      [`${SUBMISSION}`]: () => item
    }

    actions = {
      fetchDataset: sinon.stub()
    }

    store = new Vuex.Store({
      getters,
      actions
    })

    wrapper = mount(ReportSummary, {
      router,
      store
    })
  })

  it('should render correct function', () => {
    expect(typeof wrapper.methods().showOverallRistk).to.equal('function')
    expect(typeof wrapper.methods().showAppleTab).to.equal('function')
    expect(typeof wrapper.methods().showCustom).to.equal('function')
  })

  it('should set flags when calling overallRiskFlag method', () => {
    wrapper.vm.showOverallRistk()
    wrapper.update()
    expect(wrapper.vm.overallRiskFlag).to.equal(true)
    expect(wrapper.vm.appleTabFlag).to.equal(false)
    expect(wrapper.vm.customFlag).to.equal(false)
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
    const label = wrapper.find('.report-summary__label.report-summary__label--red span')[0]
    const time = wrapper.find('.report-summary .report-summary__col:last-child .report-summary__text')[0]
    const tabButton = wrapper.contains('.report__tabs.report__tabs--left .apple-tab.is-active')
    const tab = wrapper.contains('.report-container.apple-tab.is-active')

    expect(time.text().trim()).to.equal(parsedTime.trim())
    expect(tabButton).to.equal(true)
    expect(tab).to.equal(true)
    expect(actions.fetchDataset.calledOnce).to.equal(true)
  })

  it('should render custom tab data from getters', () => {
    // Switch tab and check data
    wrapper.vm.showCustom()
    wrapper.update()

    const label = wrapper.find('.report-summary__label.report-summary__label--red span')[0]
    const time = wrapper.find('.report-summary .report-summary__col:last-child .report-summary__text')[0]
    const fileName = wrapper.find('.report-container.custom-tab .report__view-link span')[0]
    const tabButton = wrapper.contains('.report__tabs.report__tabs--left .custom-tab.is-active')
    const tab = wrapper.contains('.report-container.custom-tab.is-active')

    expect(time.text().trim()).to.equal(parsedTime.trim())
    expect(fileName.text().trim()).to.equal(item.source.split('/')[2])
    expect(tabButton).to.equal(true)
    expect(tab).to.equal(true)
    expect(actions.fetchDataset.calledOnce).to.equal(true)
  })

  it('should have a `ReportSummaryLabel` component', () => {
      expect(wrapper.contains(ReportSummaryLabel)).to.equal(true)
  })

  // TODO: Write test for the following cases:
  //       * Failure on upload
  //       * Malformed data in uploaded file
  //       * Invalid file extension (if applies, maybe this is a e2e one instead)
})
