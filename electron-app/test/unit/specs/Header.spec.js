import Vue from 'vue'
import Header from '@/components/pages/Header'

describe('Header.vue', () => {
  it('should render correct header', () => {
    const Constructor = Vue.extend(Header);
    const HeaderComponent = new Constructor().$mount();
    expect(HeaderComponent.$el.textContent).to.contain('Submissions')
  })
})