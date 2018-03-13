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
import router from '../../../src/renderer/router'

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
      [ACTIVE_REPORT_CATEGORY]: () => ''
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
      globals: { $route: $validRoute }
    })
  })

  it('should have a `ReportSummaryHeader` component', () => {
    expect(wrapper.contains(ReportSummaryHeader)).to.equal(true)
  })

  it('should render correct function', () => {
    expect(typeof wrapper.methods().goBack).to.equal('function')
    expect(typeof wrapper.methods().setTitles).to.equal('function')
  })

  it('should call fetchDataset action from store', () => {
    expect(actions.fetchDataset.calledOnce).to.equal(true)
  })

  // TODO: Write test for the following cases:
  //       * Failure on upload
  //       * Malformed data in uploaded file
  //       * Invalid file extension (if applies, maybe this is a e2e one instead)
  //       * Click on "back" button
})
