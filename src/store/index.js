import { createStore } from 'vuex'
import axios from 'axios';

export default createStore({
  state: {
    token: null,
    user: null,
    error
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getUser: state => state.user,
    getError: state => state.error
  },
  mutations: {
     SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
    }
  },
  actions: {
     async register({ commit }, userData) {
      try {
        const response = await axios.post('/register', userData);
        console.log('Registration successful:', response.data);
      } catch (error) {
        commit('SET_ERROR', 'Registration failed. Please try again.');
        console.error(error);
      }
    },
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/login', credentials);
        const token = response.data.token;

        // Save the token in the store
        commit('SET_TOKEN', token);

        // Save the token in localStorage
        localStorage.setItem('token', token);

        // Optionally fetch user data
        const userResponse = await axios.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        commit('SET_USER', userResponse.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', 'Login failed. Please try again.');
        console.error(error);
      }
    },
    logout({ commit }) {
      commit('CLEAR_AUTH');
      localStorage.removeItem('token');
    }
  },
  
  modules: {
  }
})
