import FieldModal from '@/components/sections/FieldModal'
import { shallow } from 'avoriaz'
import Vuex from 'vuex'
import sinon from 'sinon'
import { FILTERS_META } from '@/constants/types'
import router from '../../../src/renderer/router'

describe('FieldModal.vue', () => {
  const data = {
    criteria: 'filter1',
    fields: [
      {
        name: 'track_artist',
        values: 'Varios Artistas'
      }
    ],
    id: 1,
    rowid: 2,
    size: 1
  }
  const meta = {
    filter1: {
      orchardDescription: 'orchardDescription'
    }
  }
  let wrapper
  let getters
  let store
  let $router

  beforeEach(() => {
    getters = {
      [FILTERS_META]: () => meta,
      filters: () => meta
    }

    store = new Vuex.Store({
      getters
    })

    $router = {
      push: sinon.stub()
    }

    wrapper = shallow(FieldModal, {
      store,
      router,
      globals: {
        $router
      }
    })
  })

  it('should have a computed prop that represents the dataset rowId', () => {
    wrapper.vm.$modal.show('field-modal', {
      ...data,
      fieldByFieldRowId: 50,
      batchId: 10
    })

    expect(wrapper.vm.datasetRowId).to.equal(1)
  })

  it('should have a computed prop that represents the field-by-field rowId', () => {
    wrapper.vm.$modal.show('field-modal', {
      ...data,
      fieldByFieldRowId: 50,
      batchId: 10
    })

    expect(wrapper.vm.fieldByFieldRowId).to.equal(50)
  })

  it('should have a computed prop that represents the batch ID', () => {
    wrapper.vm.$modal.show('field-modal', {
      ...data,
      fieldByFieldRowId: 50,
      batchId: 10
    })

    expect(wrapper.vm.batchId).to.equal(10)
  })

  it('has the necessary methods', () => {
    expect(wrapper.vm.beforeOpen).to.be.a('function')
    expect(wrapper.vm.getDescription).to.be.a('function')
    expect(wrapper.vm.showParams).to.be.a('function')
    expect(wrapper.vm.close).to.be.a('function')
    expect(wrapper.vm.openTsv).to.be.a('function')
  })

  it('`showParams() should move to another route and close the modal', () => {
    const $modal = {
      hide: sinon.stub()
    }


    wrapper = shallow(FieldModal, {
      store,
      router,
      globals: {
        $router,
        $modal
      }
    })

    wrapper.vm.showParams()
    expect($router.push.calledOnce).to.be.true
    expect($router.push.calledWith(`/report/${wrapper.vm.rowid}/params`)).to.be.true

    expect($modal.hide.calledOnce).to.be.true
    expect($modal.hide.calledWith('field-modal')).to.be.true
  })

  it('`close() should close the modal', () => {
    const $modal = {
      hide: sinon.stub()
    }

    wrapper = shallow(FieldModal, {
      store,
      router,
      globals: {
        $router,
        $modal
      }
    })

    wrapper.vm.close()
    expect($modal.hide.calledOnce).to.be.true
    expect($modal.hide.calledWith('field-modal')).to.be.true
  })
})
