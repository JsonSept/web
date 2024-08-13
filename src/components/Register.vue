<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label>Username:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: ''
    };
  },
  computed: {
    ...mapGetters(['getError'])
  },
  methods: {
    ...mapActions(['register']),
    async register() {
      await this.register({
        username: this.username,
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>
