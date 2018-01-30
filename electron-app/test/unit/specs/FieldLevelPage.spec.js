import Vue from 'vue'
import { mount } from 'avoriaz'
import FieldLevelPage from '@/components/pages/FieldLevelPage'

describe('FieldLevelPage.vue', () => {

  it('should render correct function', () => {
    const wrapper = mount(FieldLevelPage)
    expect(typeof wrapper.methods().moment).to.equal('function')
  })
})
