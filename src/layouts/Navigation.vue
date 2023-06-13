<template>
  <v-app-bar color='primary' density='compact' location='top' scroll-behavior='collapse'>
    <v-menu transition='slide-y-transition'>
      <template v-slot:activator='{ props  }'>
        <v-btn :disabled='!store$.state.isLoggedIn' :icon="menuIcon" density='compact' v-bind='props'></v-btn>
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
                     :title="$t('income')" to='/income'>
        </v-list-item>
        <v-list-item variant='plain' density='compact' prepend-icon='mdi-bank-minus'
                     :title="$t('outlay')" to='/outlay'>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-app-bar-title class="disable-select">{{ pageTitle }}</v-app-bar-title>

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
              {{ $t(`titles.${lang}`) }}
            </v-list-item>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-model='serviceUnavailable' class='disable-select' max-width='15%' persistent>
      <v-card>
        <v-toolbar :title="$t('serviceUnavailableTitel')" class='text-center' color='red'>
        </v-toolbar>
        <v-card-text class="text-center">
          {{ $t('serviceUnavailableText') }}
        </v-card-text>
        <v-card-actions class='justify-end text-center'>
          <v-btn class="mx-auto" color='red' variant='elevated' @click="serviceUnavailable = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script lang='ts'>
import {defineComponent, inject} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {logout} from "@/api/util";
import {getUser} from "@/api/user";

export default defineComponent({
  setup() {
    return {
      store$: useStore(),
      router$: useRouter(),
    }
  },
  data() {
    return {
      selectedLanguage: '',
      supportedLanguages: ['en', 'de', 'ru'],
      themeState: inject('themeState'),
      account: '',
      verified: false,
      languagesMenu: false,
      serviceUnavailable: false,
    };
  },
  created() {
    this.initializeLanguage();
  },
  methods: {
    initializeLanguage() {
      const lang = localStorage.getItem('lang');
      if (lang && this.supportedLanguages.includes(lang)) {
        this.selectedLanguage = lang;
        this.$i18n.locale = lang;
      } else {
        this.selectedLanguage = 'en';
        this.$i18n.locale = 'en';
      }
    },
    changeLanguage(lang) {
      localStorage.setItem('lang', lang);
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
      const token = this.store$.state.token;
      const accountData = await getUser(token);
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
    '$store.state.account'(newValue) {
      if (newValue) {
        this.getUserData();
      }
    },
  },
  computed: {
    pageTitle() {
      const {path} = this.router$.currentRoute.value;
      const pageTitles = {
        '/dashboard': 'dashboard',
        '/currency': 'currency',
        '/category': 'category',
        '/account': 'account',
        '/income': 'income',
        '/outlay': 'outlay',
      };
      const titleKey = pageTitles[path];
      return this.$t(titleKey || 'dashboard');
    },
    menuIcon() {
      const {path} = this.router$.currentRoute.value;
      const iconMap = {
        '/dashboard': 'mdi-view-dashboard',
        '/currency': 'mdi-cash-multiple',
        '/category': 'mdi-card-multiple',
        '/account': 'mdi-account',
        '/income': 'mdi-bank-plus',
        '/outlay': 'mdi-bank-minus',
        '/': 'mdi-apps',
      };
      return iconMap[path];
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
