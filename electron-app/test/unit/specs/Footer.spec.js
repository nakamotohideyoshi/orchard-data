import { shallow } from 'avoriaz'
import sinon from 'sinon'
import Footer from '@/components/pages/Footer'

describe('Footer.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(Footer)
  })

  it('should have a method to go back', () => {
    expect(wrapper.vm.back).to.be.a('function')
  })

  it('should have a method to go forward', () => {
    expect(wrapper.vm.forward).to.be.a('function')
  })

  it('should go back in history when `back()` is called', () => {
    const backSpy = sinon.spy(window.history, 'back')
    wrapper.vm.back()

    expect(backSpy.called).to.be.true
  })

  it('should go back in history when `forward()` is called', () => {
    const forwardSpy = sinon.spy(window.history, 'forward')
    wrapper.vm.forward()

    expect(forwardSpy.called).to.be.true
  })
})
