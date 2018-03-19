<template lang="pug">
include ../pages/_mixins
div
    .report__view
        .report__view-title What are the biggest problems with the dataset?
        router-link(:to="'error-by-error'" append).report__view-link
            +icon('ico-document')
            span View the test criteria scores
    .report__view
        .report__view-title What is the sum of problems in each row?
        router-link(:to="'row-by-row'" append).report__view-link
            +icon('ico-document')
            span View the input row scores
    .report__view
        .report__view-title Which fields in the dataset failed?
        router-link(:to="'field-by-field'" append).report__view-link
            +icon('ico-document')
            span View the field level issues
</template>

<script>
    export default {
      name: 'report-links'
    }
</script>

<style scoped>

</style>