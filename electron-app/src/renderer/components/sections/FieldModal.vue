<template lang="pug">
include ../pages/_mixins
modal.modal(
    height="auto"
    name="field-modal"
    @before-open="beforeOpen"
    @before-close="beforeClose"
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
    //
        .description {{detailData.test_data_field_ids}}
    //
        .description {{detailData.test_data_field_values}}
    .btn-group
        router-link(:to="`/csv/${item.rowid}`").btn.btn-view-detail View Row
        button(v-on:click="showParams()").btn.btn-view-detail View Test Paramters
</template>

<script>
import { mapGetters } from 'vuex'
import {
  FILTERS_META
} from '@/constants/types'

export default {
    name: 'FieldModal',
    data() {
        return {
            item: {}
        }
    },
    computed: {
        ...mapGetters({
            filters: FILTERS_META
        })
    },
    methods: {
        beforeOpen(event) {
            this.item = Object.assign({}, this.item, { ...event.params })
        },
        beforeClose(event) {
            console.log('before close')
        },
        getDescription (id) {
            if (this.filters && this.filters[id] && this.filters[id].orchardDescription) {
                return this.filters[id].orchardDescription
            }

            return 'N/A'
        },
        showParams() {
            console.log('show params')
        },
        close() {
            this.$modal.hide('field-modal')
        }
    }
}
</script>