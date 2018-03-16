<template lang="pug">
include _mixins
#barba-wrapper
  table.p-table(v-if="keys.length")
    thead
      tr
        td(v-for="k in keys") {{ columns[k] || k }}

    tbody
        tr(v-for="(item, i) in data" :id="`row-${ i+1 }`")
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
    ...mapActions(['fetchTSV'])
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
    keys () {
      return !_.isEmpty(this.data) ? _.keys(this.data[0]) : []
    }
  },
  async created () {
    const { id } = this
    await this.fetchTSV(id)
  }
}
</script>
<style lang="scss" scoped>
table {
  margin: 0;
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
