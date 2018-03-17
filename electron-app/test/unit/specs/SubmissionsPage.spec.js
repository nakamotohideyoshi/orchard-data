import { shallow } from 'avoriaz'
import Vuex from 'vuex'
import { SUBMISSIONS, SUBMISSIONS_FAILURE, SUBMISSIONS_REQUEST } from '@/constants/types'
import SubmissionsPage from '@/components/pages/SubmissionsPage'

describe('SubmissionsPage.vue', () => {
  let wrapper
  let store
  let getters

  beforeEach(() => {
    getters = {
      [SUBMISSIONS]: () => [{rowId: 1, status: 1, time: new Date()}, {rowId: 2, status: 2, time: new Date()}, {rowId: 3, status: 3, time: new Date()}],
      [SUBMISSIONS_FAILURE]: () => [],
      [SUBMISSIONS_REQUEST]: () => []
    }

    store = new Vuex.Store({
      getters
    })

    wrapper = shallow(SubmissionsPage, {
      store
    })
  })

  it('should have the correct computed props', () => {
    expect(wrapper.vm.items).to.a('array')
    expect(wrapper.vm.error).to.a('array')
    expect(wrapper.vm.loading).to.a('array')
  })

  it('should render the proper status text based on the status', () => {
    const tableRows = wrapper.find('.p-table__status')

    expect(tableRows[0].text()).to.equal('Success')
    expect(tableRows[1].text()).to.equal('Fail')
    expect(tableRows[2].text()).to.equal('In Progress')
  })
})
