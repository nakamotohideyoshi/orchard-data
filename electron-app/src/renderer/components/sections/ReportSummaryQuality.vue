<template lang="pug">
include ../pages/_mixins
.report__top
    .report__top-col
        .report__top-percent {{percentage}} %
        .report__top-description Total percent of rows with errors
    .report__top-col
        .report__top-stars
            .success(v-for="stars in filledStars")
                +icon('ico-star-filled')
            .failed(v-for="stars in emptyStarts")
                +icon('ico-star-empty')
        .report__top-description Overall data quality
    .report__top-col(v-if="duplicates_threshold !== null && duplicates_threshold <= 1")
        .report__top-percent {{duplicates_threshold}} %
        .report__top-description Of ISRCs are duplicates
    .report__top-col(v-else-if="duplicates_threshold !== null && duplicates_threshold > 1")
        .report__top-percent-warning {{duplicates_threshold}} %
        .report__top-description Of ISRCs are duplicates
    .report__top-col(v-if="vacount_percent !== null")
        .report__top-percent {{vacount_percent}} %
        .report__top-description Various Artists
</template>

<script>
  export default {
    name: 'report-summary-quality',
    props: {
      reportSummary: {
        type: Object,
        required: true
      }
    },

    computed: {
      vacount_percent () {
        if (this.reportSummary.hasOwnProperty('vacount_percent')) {
          return (this.reportSummary.vacount_percent * 100).toFixed(2)
        }

        return null
      },
      duplicates_threshold () {
        if (this.reportSummary.hasOwnProperty('duplicates_threshold')) {
          return (this.reportSummary.duplicates_threshold * 100).toFixed(2)
        }

        return null
      },
      no_of_rows () {
        if (this.reportSummary.hasOwnProperty('no_of_rows')) {
          return this.reportSummary.no_of_rows
        }

        return 0
      },
      percentage () {
        return (this.reportSummary.error_percent * 100).toFixed(2)
      },
      filledStars () {
        if (this.reportSummary && this.reportSummary.hasOwnProperty('error_stars')) {
          return parseInt(this.reportSummary.error_stars)
        }

        return 0
      },
      emptyStarts () {
        const filledStars = this.filledStars

        if (filledStars < 5) {
          return 4 - filledStars
        } else {
          return 0;
        }
      }
    }
  }
</script>

<style scoped>
</style>