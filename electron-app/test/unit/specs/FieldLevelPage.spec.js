import Vue from 'vue'
import VueRouter from 'vue-router'
import FieldLevelPage from '@/components/pages/FieldLevelPage'

describe('FieldLevelPage.vue', () => {
  it('should render correct header', () => {
    Vue.use(VueRouter)
    const Constructor = Vue.extend(FieldLevelPage);
    const FieldLevelPageComponent = new Constructor().$mount();
    expect(FieldLevelPageComponent.$el.textContent).to.contain('batch')
  })

  it('should render correct contents', () => {
    Vue.use(VueRouter)
    const Constructor = Vue.extend(FieldLevelPage);
    const FieldLevelPageComponent = new Constructor().$mount();
    const date = new Date()
    expect(FieldLevelPageComponent.batchData.batchDate).to.contain(date)
  })
})
