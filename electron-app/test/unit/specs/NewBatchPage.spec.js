import { shallow } from 'avoriaz'
import NewBatchPage from '@/components/pages/NewBatchPage'
import router from '../../../src/renderer/router'
import Vuex from 'vuex'
import {
    SUBMISSION,
    SUBMISSIONS_REQUEST,
    SUBMISSIONS_FAILURE
} from '@/constants/types'

describe('NewBatchPage.vue', () => {
  let wrapper
  let store
  let getters

  beforeEach(() => {
      getters = {
          [SUBMISSIONS_FAILURE]: () => ({ response: { data: { message: 'test' } } }),
          [SUBMISSIONS_REQUEST]: () => ({}),
          [SUBMISSION]: () => ({status: 1, time: 1519789653})
      }

      store = new Vuex.Store({
          getters
      })

      wrapper = shallow(NewBatchPage, {
      router,
      store
    })
  })

  it('should render correct function', () => {
    expect(typeof wrapper.vm.countdownArtistList).to.equal('function')
    expect(typeof wrapper.vm.countdownKeywords).to.equal('function')
    expect(typeof wrapper.vm.submitForm).to.equal('function')
    expect(typeof wrapper.vm.processFile).to.equal('function')
  })

  it('should send correct data', () => {
    const submitForm = `{
      artist_blacklist: 12,
      duplicates_threshold: 10,
      keyword_blacklist: 20,
      lang: 'en-US',
      source: '/Users/admin/Desktop/test.tsv',
      time: 1517239250526,
      various_artists_threshold: 12
    }`
    wrapper.setMethods({submitForm})
  })
})
