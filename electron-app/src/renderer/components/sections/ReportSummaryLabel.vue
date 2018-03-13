<template lang="pug">
.report-summary__label(:class="colorClass")
    span(v-if="status === 1") Success
    span(v-if="status === 2") Fail
    span(v-if="status === 3") In Progress
</template>

<script>
export default {
  name: 'ReportSummaryLabel',

  props: {
    status: {
      type: Number,
      required: true,
      validator (value) {
        const MAX_VALUE = 3
        const MIN_VALUE = 1
        const ERROR_VALUE = -1

        return (
          (value >= MIN_VALUE && value <= MAX_VALUE) || value === ERROR_VALUE
        )
      }
    }
  },

  computed: {
    colorClass () {
      const map = {
        1: 'report-summary__label--green',
        2: 'report-summary__label--red',
        3: 'report-summary__label--yellow'
      }

      return map[this.status]
    }
  }
}
</script>
