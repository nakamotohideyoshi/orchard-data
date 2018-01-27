import Vue from 'vue'
import FieldLevelPage from '@/components/pages/FieldLevelPage'

describe('FieldLevelPage.vue', () => {
  it('should render correct header', () => {
    const Constructor = Vue.extend(FieldLevelPage);
    const FieldLevelPageComponent = new Constructor().$mount();
    expect(FieldLevelPageComponent.$el.textContent).to.contain('batch')
  })

  it('should render correct contents', () => {
    const Constructor = Vue.extend(FieldLevelPage);
    const FieldLevelPageComponent = new Constructor().$mount();
    const date = new Date()
    expect(FieldLevelPageComponent.batchData.batchDate).to.contain(date)
  })
})
