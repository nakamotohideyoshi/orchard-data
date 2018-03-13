<template lang="pug">
include ../pages/_mixins
modal.modal(
    height="auto"
    name="field-modal"
    @before-open="beforeOpen"
    scrollable
)
  button.close-button(@click="close")
    +icon('ico-close')
  label Description
  .description {{ getDescription(item.criteria) }}
  label Row Id in field-by-field report
  .description {{ item.id }}
  label Row id in Dataset
  .description {{ item.rowid }}
  label Data fields
  .field(v-for="field in item.fields")
    .description ID: {{field.name}}
    .description VALUE: {{field.value}}
  .btn-group
    router-link(:to="`/csv/${item.rowid}`").btn.btn-view-detail View Row
    button(v-on:click="showParams()").btn.btn-view-detail View Test Paramters
</template>

<script>
import { mapGetters } from 'vuex'
import { FILTERS_META } from '@/constants/types'

export default {
  name: 'FieldModal',
  data () {
    return {
      item: {}
    }
  },
  computed: {
    ...mapGetters({
      filters: FILTERS_META
    }),
    rowid () {
      return this.item && this.item.rowid
    }
  },
  methods: {
    beforeOpen (event) {
      this.item = Object.assign({}, this.item, { ...event.params })
    },
    getDescription (id) {
      if (
        this.filters &&
        this.filters[id] &&
        this.filters[id].orchardDescription
      ) {
        return this.filters[id].orchardDescription
      }

      return 'N/A'
    },
    showParams () {
      const { rowid } = this
      this.$router.push(`/report/${rowid}/params`)
      this.$modal.hide('field-modal')
    },
    close () {
      this.$modal.hide('field-modal')
    }
  }
}
</script>
