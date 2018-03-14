
<template>
  <div id="app" :class="{loading: !loaded}">
    <!-- We can easily add a splash screen with this class while the config is loading -->
     <router-view v-if="loaded"></router-view>
     <!-- TODO: Add fail recovery if the API returns an error -->
     <div v-if="error" class="container">
       <button class="btn btn-primary" type="button" @click="retry">Retry</button>
       <p>ERROR: {{ error.message }}</p>
     </div>
     <field-modal />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FieldModal from '@/components/sections/FieldModal'
import {
  FILTERS_META,
  SUBMISSIONS_LOADED,
  CONFIG_FAILURE
} from '@/constants/types'

export default {
  name: 'app',
  components: {
    FieldModal
  },
  computed: {
    loaded () {
      return this.$store.getters[FILTERS_META] && this.$store.getters[SUBMISSIONS_LOADED]
    },
    ...mapGetters({
      error: CONFIG_FAILURE
    })
  },
  async created () {
    await this.$store.dispatch('getConfig')
    await this.$store.dispatch('fetchSubmissions')
  },
  methods: {
    async retry () {
      await this.$store.dispatch('getConfig')
      await this.$store.dispatch('fetchSubmissions')
    }
  }
}
</script>

<style>
@import "./assets/styles/custom.scss";
</style>
<style lang="sass">
@import "./assets/styles/app.sass";
</style>


<style scoped>
.container {
  padding: 2rem;
  text-align: center;
}

button {
  border: 0;
  padding: 1rem;
  background: #eeeeaa;
  border-radius: 0.5rem;
}
</style>
