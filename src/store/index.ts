import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isLoggedIn: false,
      token: null,
      userId: null,
      account: '',
      verified: false,
    };
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.isLoggedIn = !!token;
    },
    clearToken(state) {
      state.token = null;
      state.isLoggedIn = false;
      state.userId = null;
      state.account = '';
      state.verified = false;
    },
    setUserId(state, userId) {
      state.userId = userId;
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
