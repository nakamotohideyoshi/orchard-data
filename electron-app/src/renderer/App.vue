
<template>
  <div id="app" :class="{loading: !loaded}">
    <!-- We can easily add a splash screen with this class while the config is loading -->
     <router-view v-if="loaded"></router-view>
     <div v-if="!loaded && error" class="container">
       <button class="btn btn-primary" type="button" @click="retry">Retry</button>
       <p>ERROR: {{ error.message }}</p>
     </div>
     <field-modal />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import FieldModal from '@/components/sections/FieldModal'
import {
  FILTERS_META,
  SUBMISSIONS_LOADED,
  CONFIG_FAILURE,
  SET_SALES_DEMO_MODE
} from '@/constants/types'
import searchInPage from 'electron-in-page-search'
import { remote } from 'electron'

export default {
  name: 'app',
  data () {
    return {
      search: null
    }
  },
  components: {
    FieldModal
  },
  computed: {
    loaded () {
      return (
        this.$store.getters[FILTERS_META] &&
        this.$store.getters[SUBMISSIONS_LOADED]
      )
    },
    ...mapGetters({
      error: CONFIG_FAILURE
    })
  },
  async created () {
    await this.$store.dispatch('getConfig')
    await this.$store.dispatch('fetchSubmissions')

    this.retryingConnectionInterval = setInterval(() => {
      if (this.error) {
        this.retry()
      }
    }, 200)

    window.addEventListener('keyup', this.activeDemoMode)
    this.search = searchInPage(remote.getCurrentWebContents())
    window.addEventListener('keydown', this.searchHandler)
  },
  methods: {
    ...mapMutations([SET_SALES_DEMO_MODE]),
    searchHandler (event) {
      // metakey is the "cmd" key on Mac, or the "windows" key on Windows
      // keyCode70 is the leter "f"
      if (event.metaKey && event.keyCode === 70) {
        // open on meta + f
        this.search.openSearchWindow()
      } else if (event.keyCode === 27) {
        // close on escape key
        this.search.closeSearchWindow()
      }
    },
    activeDemoMode (event) {
      // ctrl + period (.)
      if (event.ctrlKey && event.keyCode === 190) {
        this.SET_SALES_DEMO_MODE()
        console.log('demo mode, enabled')
      }
    },

    async retry () {
      await this.$store.dispatch('getConfig')
      await this.$store.dispatch('fetchSubmissions')

      if (this.retryingConnectionInterval && this.loaded) {
        clearInterval(this.retryingConnectionInterval)
      }
    }
  }
}
</script>

<style>
@import "./assets/styles/custom.scss";
.electron-in-page-search-window.search-active {
  visibility: visible;
  background: white;
  position: fixed;
  top: -1px;
  right: -1px;
  width: 500px;
  z-index: 999;
  height: 40px;
  border-bottom-left-radius: 10px;
  box-shadow: -1px 1px 17px 0px #656aeb;
}
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
