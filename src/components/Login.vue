<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  computed: {
    ...mapGetters(['getError'])
  },
  methods: {
    ...mapActions(['login']),
    async login() {
      await this.login({
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>
