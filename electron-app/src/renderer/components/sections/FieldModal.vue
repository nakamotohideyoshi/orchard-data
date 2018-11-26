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
  .description {{ getDescription(item.criteria, item.explanationsIds) }}
  label Row Id in field-by-field report
  .description {{ fieldByFieldRowId }}
  label Row id in Dataset
  .description {{ datasetRowId }}
  label Data fields
  .field(v-for="field in item.fields")
    .description ID: {{field.name}}
    .description VALUE: {{field.value}}
  .btn-group
    button(v-on:click="openTsv(batchId, tsvRowId, datasetRowId)").btn.btn-view-detail View Row
    button(v-on:click="showParams()").btn.btn-view-detail View Test Parameters
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { FILTERS_META, SET_ACTIVE_CATEGORY } from '@/constants/types'
import { CUSTOM_CATEGORY } from '@/constants/report-category'
import openTsv from '@/helpers/openTsvViewer'

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
    fieldByFieldRowId () {
      return this.item && this.item.fieldByFieldRowId
    },
    datasetRowId () {
      return this.item && this.item.id
    },
    batchId () {
      return this.item && this.item.batchId
    },
    tsvRowId () {
      return this.item && this.item.tsvRowId
    }
  },
  methods: {
    ...mapMutations({ setReportCategory: SET_ACTIVE_CATEGORY }),
    openTsv,
    beforeOpen (event) {
      this.item = Object.assign({}, this.item, { ...event.params })
    },
    getDescription (id, explanationsIds) {
      if (!explanationsIds) return 'N/A'

      let explanationsToConcatenate = []

      explanationsIds.forEach(explanationId => {
        if (
          this.filters &&
          this.filters[id] &&
          this.filters[id].explanations &&
          this.filters[id].explanations[explanationId]
        ) {
          explanationsToConcatenate.push(this.filters[id].explanations[explanationId])
        }
      })

      explanationsToConcatenate = [...new Set(explanationsToConcatenate)]

      if (explanationsToConcatenate.length) return explanationsToConcatenate.join('. ')

      return 'N/A'
    },
    showParams () {
      const { datasetRowId } = this
      this.setReportCategory(CUSTOM_CATEGORY)
      this.$router.push(`/report/${datasetRowId}/params`)
      this.$modal.hide('field-modal')
    },
    close () {
      this.$modal.hide('field-modal')
    }
  }
}
</script>
