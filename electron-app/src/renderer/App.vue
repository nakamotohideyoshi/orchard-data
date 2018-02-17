
<template>
  <div id="app" :class="{loading: !loaded}">
    <!-- We can easily add a splash screen with this class while the config is loading -->
     <router-view v-if="loaded"></router-view>
     <!-- TODO: Add fail recovery if the API returns an error -->
     <div v-if="error">error</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  FILTERS_META,
  CONFIG_FAILURE
} from '@/constants/types'

  export default {
    name: 'app',
    computed: {
      ...mapGetters({
        loaded: FILTERS_META,
        error: CONFIG_FAILURE
      })
    },
    async created() {
      await this.$store.dispatch('getConfig');
    }
  }
</script>

<style>
  @import "./assets/styles/custom.scss";
</style>