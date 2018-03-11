import ReportSummaryHeader from '@/components/sections/ReportSummaryHeader'
import ReportSummaryLabel from '@/components/sections/ReportSummaryLabel'
import { shallow } from 'avoriaz'
import _ from 'lodash'
import moment from 'moment'

describe('ReportSummaryHeader.vue', () => {
  let wrapper
  let now = (new Date()).getTime()
  let parsedNow = moment(now).format('dddd MMM Do YYYY HH:mmA')
  let data = {
    status: 1,
    time: now,
    id: 1,
    category: 'itunes',
    title: 'Title',
    root: true
  }

  it('should have a `ReportSummaryLabel` component', () => {
    wrapper = shallow(ReportSummaryHeader, {
      propsData: _.extend({}, data)
    })

    expect(wrapper.contains(ReportSummaryLabel)).to.equal(true)
  })

  it('should have all required props', () => {
    wrapper = shallow(ReportSummaryHeader, {
      propsData: _.extend({}, data)
    })

    expect(wrapper.getProp('status')).to.be.a('number')
    expect(wrapper.getProp('status')).to.equal(1)

    expect(wrapper.getProp('time')).to.be.a('number')
    expect(wrapper.getProp('time')).to.equal(now)

    expect(wrapper.getProp('id')).to.be.a('number')
    expect(wrapper.getProp('id')).to.equal(1)

    expect(wrapper.getProp('category')).to.be.a('string')
    expect(wrapper.getProp('category')).to.equal(data.category)

    expect(wrapper.getProp('title')).to.be.a('string')
    expect(wrapper.getProp('title')).to.equal(data.title)
  })

  it('should update template', () => {
    wrapper = shallow(ReportSummaryHeader, {
      propsData: _.extend({}, data)
    })

    wrapper.update()

    const category = wrapper.find('.report-summary .report-summary__col:nth-child(1) .report-summary__head')[0]
    const title = wrapper.find('.report-summary .report-summary__col:nth-child(1) .report-summary__text')[0]
    const id = wrapper.find('.report-summary .report-summary__col:nth-child(2) .report-summary__text')[0]
    const date = wrapper.find('.report-summary .report-summary__col:nth-child(3) .report-summary__text')[0]

    expect(typeof wrapper.vm.date).to.equal('string')
    expect(category.text().trim()).to.equal(data.category)
    expect(title.text().trim()).to.equal(data.title)
    expect(parseInt(id.text().trim(), 10)).to.equal(data.id)
    expect(date.text().trim()).to.equal(parsedNow)
  })
})
