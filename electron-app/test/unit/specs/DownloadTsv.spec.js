import { shallow } from 'avoriaz'
import sinon from 'sinon'
import DownloadTsv from '@/components/DownloadTsv'

describe('DownloadTsv.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(DownloadTsv, {
      propsData: {
        batchId: '99',
        downloadLink: '/some/link/99.tsv'
      }
    })
  })

  it('should render correct function', () => {
    expect(typeof wrapper.vm.toggleMenu).to.equal('function')
    expect(typeof wrapper.vm.openTSV).to.equal('function')
  })

  it('should render correct props', () => {
    expect(typeof wrapper.vm.batchId).to.equal('string')
    expect(typeof wrapper.vm.downloadLink).to.equal('string')
  })

  it('should default to closed', () => {
    expect(wrapper.vm.isOpen).to.be.false
  })

  it('can be toggleed open and closed', () => {
    expect(wrapper.vm.isOpen).to.be.false
    wrapper.vm.toggleMenu()
    expect(wrapper.vm.isOpen).to.be.true
    wrapper.vm.toggleMenu()
    expect(wrapper.vm.isOpen).to.be.false
  })
})
