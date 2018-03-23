<template lang="pug">
    include pages/_mixins
    div.download-tsv__wrapper
        a.download-tsv__link(
        :href="downloadLink"
        download
        ).report-summary__text
            +icon('ico-download')
        //div.download-tsv__toggle(@click="toggleMenu")
            ul.download-tsv__flyout(v-show="isOpen")
                li
                    a(:href="downloadLink" @click.prevent="openTsv(batchId)") Open TSV
                li
                    a(:href="downloadLink" download) Save TSV
</template>

<script>
  import openTsv from '@/helpers/openTsvViewer'

  export default {
    name: 'download-tsv',

    props: {
      batchId: {
        type: [Number, String],
        required: true
      },
      downloadLink: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        isOpen: false
      }
    },

    methods: {
      toggleMenu () {
        this.isOpen = !this.isOpen
      },

      openTsv
    }
  }
</script>

<style lang="sass" scoped>
    .download-tsv__wrapper
        display: flex
        overflow: visible
        justify-content: center

    .download-tsv__toggle
        position: relative
        width: 20px

        &:hover
            color: #656AEB
            cursor: pointer


        &:after
            content: "•••"
            position: absolute
            top: 50%
            left: 50%
            transform: translate(-50%, -50%) rotate(90deg)
            font-size: 15px
            letter-spacing: 1px
            padding: 5px
    

    .download-tsv__flyout 
        font-size: 0.9em
        padding: 5px 12px
        position: absolute
        top: 0
        left: 5px
        border: 1px solid #C0C4D3
        text-wrap: none
        white-space: nowrap
        display: flex
        flex-direction: column
        background: white
        z-index: 999

        li
            padding: 3px 0

        a:hover
            text-decoration: underline
    

</style>