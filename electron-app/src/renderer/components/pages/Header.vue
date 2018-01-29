<template lang="pug">
include _mixins
.header-wrapper
    // HEADER
    header.header
        .container
            .header__wrapper
                .header__logo
                    router-link(:to="'/'")
                        i.icon.icon-logo
                ul.header__menu
                    li
                        router-link(:to="'/submissions'").is-active
                            +icon('ico-home')
                            span Submissions (20)
                    li
                        router-link(:to="'/new-batch'").btn.btn-primary
                            span Add new dataset

                //- .header__hamburger(js-hamburger)
                //-     .hamburger.hamburger--squeeze
                //-         .hamburger-box
                //-         .hamburger-inner

    // header user dropdown
    // should be positioned outside header to prevent z-index conflicts
    ul.header__user-drop__options(js-header-dropdown-list)
        li
            a(href="#") Profile
        li
            a(href="#") Settings
        hr
        li
            a(href="#") Log Out  

    // MOBILE MENU
    .mobile-navi
        ul.mobile-navi__menu
            li
                router-link(:to="'/submissions'").is-active Submissions (20)
            li
                router-link(:to="'/new-batch'") Add new dataset
            li
                a(href="#") Profile
            li
                a(href="#") Settings
            li
                a(href="#") Log Out

</template>

<script>
    export default {
      name: 'app-header',
      components: {

      },
      methods: {
      }
    }
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>