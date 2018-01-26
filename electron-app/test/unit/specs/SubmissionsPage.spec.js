import Vue from 'vue'
import SubmissionsPage from '@/components/pages/SubmissionsPage'

describe('SubmissionsPage.vue', () => {
  it('should render correct contents', () => {
    const Construtor = Vue.extend(SubmissionsPage)
    const SubmissionsComponent = new Construtor().$mount()
    expect(SubmissionsComponent.$el.textContent).to.contain('play games')
  })
})

describe('SubmissionsPage.vue', () => {
  let cmp

  beforeEach(() => {
    cmp = shallow(SubmissionsPage, {
      data: {
        dbData: [
          {id: 1}, 
          {status: 1},
          {time: 1516388306565}
        ]
      }
    })
  })

  it('has received dbData as the list props', () => {
    const Construtor = Vue.extend(SubmissionsPage)
    const SubmissionsComponent = new Construtor().$mount()
    expect(SubmissionsComponent.$el.dbData).toEqual([
      {id: 1}, 
      {status: 1},
      {time: 1516388306565}
    ])
  })

  it('is a submissionlist component', () => {
    expect(cmp.is(SubmissionsPage)).toBe(true)
  })

  it('has the expected html structure', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
