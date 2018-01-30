import Vue from 'vue'
import { mount } from 'avoriaz'
import VueRouter from 'vue-router'
import FieldLevelPage from '@/components/pages/FieldLevelPage'
import router from '../../../src/renderer/router'

describe('FieldLevelPage.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(FieldLevelPage, {
      router: router
    })
  })

  it('should render correct function', () => {
    Vue.use(VueRouter)
    //const wrapper = mount(FieldLevelPage)
    expect(typeof wrapper.methods().moment).to.equal('function')
  })
})
