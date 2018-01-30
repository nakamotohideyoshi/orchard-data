import Vue from 'vue'
import { mount } from 'avoriaz'
import Header from '@/components/pages/Header'

describe('Header.vue', () => {
  it('should render correct header', () => {
    const wrapper = mount(Header)
     expect(wrapper.is('div')).to.equal(true)
  })
})