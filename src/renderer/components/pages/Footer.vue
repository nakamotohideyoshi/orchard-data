<template lang="pug">
include _mixins
// FOOTER :: START
footer.footer(js-reveal-footer)
  .container
    ul.footer__menu
      li
        a(href="#") Docs
      li
        a(href="#") Customer Support
      li
        a(href="mailto:info@musicalturk.co") info@musicalturk.co

    .footer__logo
      i.icon.icon-logo

// FOOTER :: END
</template>

<script>
	export default {
	  name: 'app-footer',
	  components: {

	  },
	  methods: {
	  }
	}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>
