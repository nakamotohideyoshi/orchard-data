import { shallow } from 'avoriaz'
import Vuex from 'vuex'
import sinon from 'sinon'
import _ from 'lodash'
import ReportSummary from '@/components/pages/ReportSummary'
import ReportSummaryHeader from '@/components/sections/ReportSummaryHeader'
import {
  SUBMISSION,
  ACTIVE_REPORT_CATEGORY
  /* Stubbing to pass lint, will work on it later
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE
  */
} from '@/constants/types'
import router from '@/router'

describe('ReportSummary.vue', () => {
  let wrapper
  let getters
  let store
  let actions
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
  const data = {
    title: 'Title',
    category: 'Category',
    canGoBack: false
  }

  beforeEach(() => {
    getters = {
      error: () => ({}),
      loading: () => false,
      item: () => item,
      [`${SUBMISSION}`]: () => item,
      category: () => ACTIVE_REPORT_CATEGORY,
      [ACTIVE_REPORT_CATEGORY]: () => '',
      rowByRowDownloadLink: () => () => 'link',
      errorByErrorDownloadLink: () => () => 'link',
      fieldByFieldDownloadLink: () => () => 'link',
      summaryDownloadLink: () => () => 'link'
    }

    actions = {
      fetchDataset: sinon.stub()
    }

    store = new Vuex.Store({
      getters,
      actions
    })

    $validRoute = {
      name: 'report',
      params: {
        id: 1
      }
    }

    wrapper = shallow(ReportSummary, {
      router,
      store,
      propsData: _.extend({}, data),
      globals: {
        $route: $validRoute,
        $router: {
          go: () => ''
        }
      }
    })
  })

  it('should have a `ReportSummaryHeader` component', () => {
    expect(wrapper.contains(ReportSummaryHeader)).to.equal(true)
  })

  it('should render correct function', () => {
    expect(typeof wrapper.vm.goBack).to.equal('function')
    expect(typeof wrapper.vm.setTitles).to.equal('function')
  })

  it('should call fetchDataset action from store', () => {
    expect(actions.fetchDataset.calledOnce).to.equal(true)
  })

  it('should go back in history when `goBack()` is called', () => {
    const backSpy = sinon.spy(wrapper.vm.$router, 'go')
    wrapper.vm.goBack()

    expect(backSpy.called).to.be.true
  })

  it('should set the proper info for `row-by-row` report', () => {
    wrapper.vm.setTitles('row-by-row')

    expect(wrapper.vm.title).to.equal('Input Row Scores')
    expect(wrapper.vm.downloadLink).to.be.not.empty
    expect(wrapper.vm.canGoBack).to.be.true
    expect(wrapper.vm.downloadLink).to.be.not.empty
  })

  it('`setTitles()` should set the proper info for `field-by-field` report', () => {
    wrapper.vm.setTitles('field-by-field')

    expect(wrapper.vm.title).to.equal('Every Error')
    expect(wrapper.vm.downloadLink).to.be.not.empty
    expect(wrapper.vm.canGoBack).to.be.true
    expect(wrapper.vm.downloadLink).to.be.not.empty
  })

  it('`setTitles()` should set the proper info for `error-by-error` report', () => {
    wrapper.vm.setTitles('error-by-error')

    expect(wrapper.vm.title).to.equal('Test Criteria Scores')
    expect(wrapper.vm.downloadLink).to.be.not.empty
    expect(wrapper.vm.canGoBack).to.be.true
    expect(wrapper.vm.downloadLink).to.be.not.empty
  })

  it('`setTitles()` should have a default title if nothing is passed in', () => {
    wrapper.vm.setTitles()

    expect(wrapper.vm.title).to.equal('Report Summary')
    expect(wrapper.vm.canGoBack).to.be.false
    expect(wrapper.vm.downloadLink).to.be.not.empty
  })

  // TODO: Write test for the following cases:
  //       * Failure on upload
  //       * Malformed data in uploaded file
  //       * Invalid file extension (if applies, maybe this is a e2e one instead)
  //       * Click on "back" button
})
