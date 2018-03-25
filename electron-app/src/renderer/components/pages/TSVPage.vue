<template lang="pug">
include _mixins
#barba-wrapper
  table.p-table(v-if="keys.length")
    thead
      tr
        td No.
        td(v-for="k in keys") {{ columns[k] || k }}

    tbody
      tr(v-for="(item, i) in data", :id="`row-${ i+1 }`", :class="{highlight: isHighlightedRow(i)}")
        td {{ i+1 }}
        td(v-for="k in keys") {{ item[k] }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import {
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  SUBMISSION_TSV,
  DATASET_COLUMNS
} from '@/constants/types'

export default {
  name: 'tsv-page',
  methods: {
    ...mapActions(['fetchTSV']),
    isHighlightedRow (id) {
      return (id + 1) === window.parseInt(this.highlightRowId)
    }
  },
  computed: {
    ...mapGetters({
      loading: SUBMISSIONS_REQUEST,
      error: SUBMISSIONS_FAILURE,
      data: SUBMISSION_TSV,
      columns: DATASET_COLUMNS
    }),
    id () {
      return this.$route.params.id
    },
    highlightRowId () {
      return window.parseInt(this.$route.params.highlightRowId) || undefined
    },
    keys () {
      return !_.isEmpty(this.data) ? _.keys(this.data[0]) : []
    }
  },
  async created () {
    const { id } = this
    await this.fetchTSV(id)

    // if a particular row is to be highlighted, then scroll down to it so it is in view
    if (this.highlightRowId !== undefined) {
      const targetRow = document.getElementsByClassName('highlight')[0]
      const scrollPos = targetRow.offsetTop

      window.scrollTo(0, scrollPos)
    }
  }
}
</script>
<style lang="scss" scoped>
table {
  margin: 0;
}

.highlight td {
    background: yellow;
}

.p-table thead td,
.p-table tbody td {
  padding: 0.5rem;
  white-space: nowrap;
}

#barba-wrapper {
  overflow-x: scroll;
}
</style>
