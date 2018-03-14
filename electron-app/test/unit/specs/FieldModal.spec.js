import Vue from 'vue'
import FieldModal from '@/components/sections/FieldModal'
import { mount } from 'avoriaz'
import Vuex from 'vuex'
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

  beforeEach(() => {
    getters = {
      [FILTERS_META]: () => meta,
      filters: () => meta
    }

    store = new Vuex.Store({
      getters
    })

    wrapper = mount(FieldModal, {
      store,
      router,
      propsData: _.extend({}, data),
      attachToDocument: true
    })
  })

  it('should have all required props', () => {
    wrapper.update()

    wrapper.vm.$modal.show('field-modal', {
      ...data
    })

    wrapper.update()
    // TODO:
    //  * Find a way to raise the right events
    //  * Stub modal hooks
  })
})
