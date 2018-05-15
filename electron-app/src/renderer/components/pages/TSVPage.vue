<template lang="pug">
include _mixins
#barba-wrapper
  table.p-table(v-if="keys.length")
    thead
      tr
        td Row ID
        td(v-for="k in keys") {{ columns[k] || k }}

    tbody
      tr(v-for="(item, i) in data", :id="`row-${ i }`", :class="{highlight: isHighlightedRow(item.rowid)}")
<<<<<<< HEAD
        td {{ item.index }}
=======
        td {{ i+1 }}
>>>>>>> a14d9032197bff3362552433636325b81f1020f9
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
    ...mapActions(['fetchTSVSegment']),
    isHighlightedRow (id) {
      return parseInt(id, 10) === window.parseInt(this.highlightRowId, 10)
    }
  },
  computed: {
    ...mapGetters({
      loading: SUBMISSIONS_REQUEST,
      error: SUBMISSIONS_FAILURE,
      items: SUBMISSION_TSV,
      columns: DATASET_COLUMNS
    }),
    data () {
      let items = this.items

      // Check the row in dataset argument and sync the row id with it
      if (items && items.length) {
        let { rowid } = this.$route.query
        let index = items.findIndex(x => x.rowid === this.highlightRowId)

        if (rowid) {
          rowid = parseInt(rowid, 10)
          items = items.map((i) => {
            const item = { index: rowid - index, ...i }
            index = index - 1
            return item
          })
        }
      }

      return items
    },
    id () {
      return this.$route.params.id
    },
    highlightRowId () {
      return window.parseInt(this.$route.params.highlightRowId, 10) || undefined
    },
    keys () {
      return !_.isEmpty(this.data) ? _.chain(this.data[0]).omit(['dataset_id', 'rowid', 'index']).keys().value() : []
    }
  },
  async created () {
    const { id, highlightRowId } = this
    await this.fetchTSVSegment({ id, highlightRowId })

    // if a particular row is to be highlighted, then scroll down to it so it is in view
    if (this.highlightRowId && this.data.length > 15) {
      const targetRow = document.getElementsByClassName('highlight')[0]
      const scrollPos = targetRow.offsetTop / 2

      window.scrollTo(0, scrollPos)
    }
  }
}
</script>
<style lang="scss" scoped>
table {
  margin: 0;
}

.highlight td,
.highlight:hover {
    background: yellow !important;
    cursor: pointer;
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
