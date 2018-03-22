import { shallow } from 'avoriaz'
import NewBatchPage from '@/components/pages/NewBatchPage'
import router from '../../../src/renderer/router'
import sinon from 'sinon'
import Vuex from 'vuex'
import {
  SUBMISSION,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE
} from '@/constants/types'

describe('NewBatchPage.vue', () => {
  let wrapper
  let store
  let getters
  let mutations
  let actions
  let $router
  let fakeChangeEvent
  const windowAlertSpy = sinon.spy(window, 'alert')

  beforeEach(() => {
    windowAlertSpy.resetHistory()

    getters = {
      [SUBMISSIONS_FAILURE]: () => ({ response: { data: { message: 'test' } } }),
      [SUBMISSIONS_REQUEST]: () => ({}),
      [SUBMISSION]: () => ({ status: 1, time: 1519789653 })
    }

    actions = {
      'submitDataset': sinon.stub().resolves()
    }

    mutations = {
      SUBMISSION: () => {},
      SUBMISSIONS_FAILURE: () => {}
    }

    store = new Vuex.Store({
      getters,
      actions,
      mutations
    })

    $router = {
      push: sinon.stub()
    }

    fakeChangeEvent = {
      target: {
        files: [{
          name: 'fake file',
          path: '/some/fake/path'
        }]
      }
    }

    wrapper = shallow(NewBatchPage, {
      router,
      store,
      globals: {
        $router
      }
    })
  })

  it('should render correct function', () => {
    expect(typeof wrapper.vm.countdownArtistList).to.equal('function')
    expect(typeof wrapper.vm.countdownKeywords).to.equal('function')
    expect(typeof wrapper.vm.submitForm).to.equal('function')
    expect(typeof wrapper.vm.processFile).to.equal('function')
  })

  it('should send correct data', () => {
    const submitForm = `{
      artist_blacklist: 12,
      duplicates_threshold: 10,
      keyword_blacklist: 20,
      lang: 'en-US',
      source: '/Users/admin/Desktop/test.tsv',
      time: 1517239250526,
      various_artists_threshold: 12
    }`
    wrapper.setMethods({ submitForm })
  })

  it('Collect all file info when processing it', () => {
    wrapper.vm.processFile(fakeChangeEvent)

    expect(wrapper.vm.fileName).to.equal('fake file')
    expect(wrapper.vm.filePath).to.equal('/some/fake/path')
    expect(wrapper.vm.buttonDisabled).to.be.false
  })

  it('should show an alert message when form is submitted but no file has been processed', () => {
    wrapper.vm.submitForm()
    expect(windowAlertSpy.called).to.be.true
    expect(windowAlertSpy.calledWith('Please select Dataset file')).to.be.true
  })

  it('should submit the data set if a filePath is set', (done) => {
    wrapper.vm.processFile(fakeChangeEvent)

    wrapper.vm.submitForm()
      .then(() => {
        expect(actions['submitDataset'].calledOnce).to.be.true
        done()
      })
      .catch((error) => {
        done(error)
      })

    // expect(actions['submitDataset'.calledWith()])
  })

  it('should change routes when the file submission is complete', (done) => {
    wrapper.vm.processFile(fakeChangeEvent)

    wrapper.vm.submitForm()
      .then(() => {
        expect($router.push.called).to.be.true
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should show report-progress page if submitting the file does not yield a new submission', (done) => {
    getters[SUBMISSION] = () => ''

    store = new Vuex.Store({
      getters,
      actions,
      mutations
    })

    wrapper = shallow(NewBatchPage, {
      router,
      store,
      globals: {
        $router
      }
    })

    wrapper.vm.processFile(fakeChangeEvent)

    wrapper.vm.submitForm()
      .then(() => {
        expect($router.push.called).to.be.true
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should not submit anything if `threshold1` is above 100', (done) => {
    wrapper.vm.threshold1 = '120%'
    wrapper.vm.processFile(fakeChangeEvent)

    wrapper.vm.submitForm()
      .then(() => {
        expect(actions['submitDataset'].called).to.be.false
        expect(windowAlertSpy.called).to.be.true
        expect(windowAlertSpy.calledWith('Duplicates threshold must be between 0 and 100.')).to.be.true
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should not submit anything if `threshold1` is below 0', (done) => {
    wrapper.vm.threshold1 = '-1%'
    wrapper.vm.processFile(fakeChangeEvent)

    wrapper.vm.submitForm()
      .then(() => {
        expect(actions['submitDataset'].called).to.be.false
        expect(windowAlertSpy.called).to.be.true
        expect(windowAlertSpy.calledWith('Duplicates threshold must be between 0 and 100.')).to.be.true
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should not submit anything if `threshold2` is below 0', (done) => {
    wrapper.vm.threshold2 = '-1%'
    wrapper.vm.processFile(fakeChangeEvent)

    wrapper.vm.submitForm()
      .then(() => {
        expect(actions['submitDataset'].called).to.be.false
        expect(windowAlertSpy.called).to.be.true
        expect(windowAlertSpy.calledWith('Various Artists threshold must be greater than -1.')).to.be.true
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('`countdownArtistList()` should prevent defect event action if `artistList` is > than `textareaMax`', () => {
    const event = {
      preventDefault: sinon.stub()
    }

    wrapper.vm.artistList = ['A', 'B', 'C', 'D']
    wrapper.vm.textareaMax = 3
    wrapper.vm.countdownArtistList(event)
    expect(event.preventDefault.calledOnce).to.be.true
  })

  it('`countdownArtistList()` should prevent defect event action if `artistList` is < than `textareaMax`', () => {
    const event = {
      preventDefault: sinon.stub()
    }

    wrapper.vm.artistList = ['A', 'B', 'C', 'D']
    wrapper.vm.textareaMax = 30
    wrapper.vm.countdownArtistList(event)
    expect(event.preventDefault.called).to.be.false
  })

  it('`countdownKeywords()` should prevent defect event action if `keywordList` is > than `textareaMax`', () => {
    const event = {
      preventDefault: sinon.stub()
    }

    wrapper.vm.keywordList = ['A', 'B', 'C', 'D']
    wrapper.vm.textareaMax = 3
    wrapper.vm.countdownKeywords(event)
    expect(event.preventDefault.calledOnce).to.be.true
  })

  it('`countdownKeywords()` should prevent defect event action if `keywordList` is < than `textareaMax`', () => {
    const event = {
      preventDefault: sinon.stub()
    }

    wrapper.vm.keywordList = ['A', 'B', 'C', 'D']
    wrapper.vm.textareaMax = 30
    wrapper.vm.countdownKeywords(event)
    expect(event.preventDefault.called).to.be.false
  })
})
