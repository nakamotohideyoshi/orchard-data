<template lang="pug">
include _mixins
// FOOTER :: START
footer.footer(js-reveal-footer)
  .container
    ul.footer__menu
      li
        span(v-on:click="back") &lt;
      li
        span(v-on:click="forward") &gt;
    //-   li
    //-     a(href="mailto:info@musicalturk.co") info@musicalturk.co

    //- .footer__logo
    //-   i.icon.icon-logo

// FOOTER :: END
</template>

<script>
	export default {
	  name: 'app-footer',
	  components: {

	  },
	  methods: {
    back: function (evt) {
      window.history.back()
    },
    forward: function (evt) {
      window.history.forward()
    }
	  }
	}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>
