<template>
  <navbar-comp/>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import NavbarComp from './components/NavbarComp.vue'
import { mapActions, mapGetters } from 'vuex';

export default {

  computed: {
    ...mapGetters(['isAuthenticated', 'getUser'])
  },
  methods: {
    ...mapActions(['logout'])
  },

  components: {
    NavbarComp,
  }
}
</script>