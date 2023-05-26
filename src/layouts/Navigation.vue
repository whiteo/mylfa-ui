<template>
  <v-app-bar color='primary' density='compact' location='top' scroll-behavior='collapse'>

    <v-menu transition='slide-y-transition'>
      <template v-slot:activator='{ props  }'>
        <v-btn density='compact' :disabled='!store$.state.isLoggedIn' icon='mdi-apps' v-bind='props'></v-btn>
      </template>

      <v-list density='compact' variant='plain' class='disable-select'>
        <v-list-item variant='plain' density='compact' prepend-icon='mdi-view-dashboard'
                     :title="$t('dashboard')" to='/dashboard'>
        </v-list-item>
        <v-list-item variant='plain' density='compact' prepend-icon='mdi-cash-multiple'
                     :title="$t('currency')" to='/currency'>
        </v-list-item>
        <v-list-item variant='plain' density='compact' prepend-icon='mdi-card-multiple'
                     :title="$t('category')" to='/category'>
        </v-list-item>
        <v-list-item variant='plain' density='compact' prepend-icon='mdi-bank-plus'
                     :title="$t('income')" to="/income">
        </v-list-item>
        <v-list-item variant='plain' density='compact' prepend-icon='mdi-bank-minus'
                     :title="$t('outlay')" to="/outlay">
        </v-list-item>
      </v-list>
    </v-menu>

    <v-app-bar-title class='disable-select'>{{ $t('dashboard') }}</v-app-bar-title>

    <v-menu>
      <template v-slot:activator='{ props }'>
        <v-btn density='compact' icon='mdi-dots-vertical' v-bind='props'></v-btn>
      </template>

      <v-list density='compact' variant='plain' class='disable-select'>
        <v-list-item variant='plain' density='compact' prepend-icon='mdi-account'
                     v-if='store$.state.isLoggedIn' :title="$t('account')"
                     :subtitle='account' to='/account'>
        </v-list-item>
        <v-list-item variant='plain' density='compact' class='language-button' prepend-icon='mdi-web'
                     :title="$t('language')" value='language' @click='toggleLanguageMenu'>
        </v-list-item>
        <v-list-item variant='plain' density='compact' prepend-icon='mdi-logout'
                     v-if='store$.state.isLoggedIn' :title="$t('logout')" @click='logout'>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model='languagesMenu' width='auto' class='disable-select'>
      <v-card>
        <v-row>
          <v-col v-for='(lang, index) in supportedLanguages' :key='index' cols='auto' density='compact'>
            <v-list-item @click="changeLanguage(lang)">
              {{ lang }}
            </v-list-item>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script lang='ts'>
import {defineComponent, inject} from 'vue';
import {useStore} from 'vuex';
import {getAccountData, logout} from '@/api/api';
import {useRouter} from 'vue-router';

export default defineComponent({
  setup() {
    return {
      store$: useStore(),
      router$: useRouter(),
    }
  },
  data() {
    return {
      selectedLanguage: 'en',
      supportedLanguages: ['en', 'de', 'ru'],
      themeState: inject('themeState'),
      account: '',
      verified: false,
      languagesMenu: false,
    };
  },
  methods: {
    changeLanguage(lang) {
      this.selectedLanguage = lang;
      this.$i18n.locale = lang;
      this.languagesMenu = false;
    },
    toggleLanguageMenu() {
      this.languagesMenu = !this.languagesMenu;
    },
    async logout() {
      if (this.store$.state.isLoggedIn) {
        await logout();
        this.store$.commit('clearToken');
        await this.router$.push('/');
      }
    },
    async getUserData() {
      const userId = this.store$.state.userId;
      const accountData = await getAccountData(userId);
      this.store$.commit('setAccount', accountData.email);
      this.store$.commit('setVerified', accountData.verified);
      this.account = accountData.email;
      this.verified = accountData.verified;
    }
  },
  watch: {
    '$store.state.isLoggedIn'(newValue) {
      if (newValue) {
        this.getUserData();
      }
    },
  },
  computed: {
    themeIcon() {
      return this.themeState.darkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent';
    },
    toggleTheme() {
      return this.themeState.toggleTheme();
    },
  },
});
</script>

<style>
.language-button {
  position: relative;
}

.language-button::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 0.5rem;
}

.disable-select {
  user-select: none;
}
</style>
