import Vue from 'vue'
import { mount } from 'avoriaz'
import VueRouter from 'vue-router'
import NewBatchPage from '@/components/pages/NewBatchPage'
import router from '../../../src/renderer/router'

describe('NewBatchPage.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(NewBatchPage, {
      router: router
    })
  })

  it('should render correct function', () => {
    Vue.use(VueRouter)
    expect(typeof wrapper.methods().countdownArtistList).to.equal('function')
    expect(typeof wrapper.methods().countdownKeywords).to.equal('function')
    expect(typeof wrapper.methods().submitForm).to.equal('function')
    expect(typeof wrapper.methods().processFile).to.equal('function')
    expect(typeof wrapper.computed().list1).to.equal('function')
  })

  it('should get correct data', () => {
    Vue.use(VueRouter)
    const list1 = () => `{
      criteria_id: 'userExplanation',
      dataset_id: 15,
      error_percent: 0.18181818181818182,
      error_score: 2.2766766398366327,
      filter_id: "filter1",
      no_of_errors: 2,
      no_of_rows: 11,
      rowid: 1
    }`
    wrapper.setMethods({list1})
  })

  it('should send correct data', () => {
    Vue.use(VueRouter)
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
