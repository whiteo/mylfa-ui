import {createStore} from 'vuex';

const store = createStore({
  state() {
    return {
      isLoggedIn: false,
      token: localStorage.getItem('token') || null,
      userId: localStorage.getItem('userId') || null,
      account: '',
      verified: false,
    };
  },
  mutations: {
    setLogIn(state) {
      state.isLoggedIn = !!state.token;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = null;
      state.isLoggedIn = false;
      state.userId = null;
      state.account = '';
      state.verified = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
    setUserId(state, userId) {
      state.userId = userId;
      localStorage.setItem('userId', userId);
    },
    setAccount(state, account) {
      state.account = account;
    },
    setVerified(state, verified) {
      state.verified = verified;
    },
  },
});

export default store;
