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
