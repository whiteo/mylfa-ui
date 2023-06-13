<template>
  <v-container class='fill-height' fluid>
    <v-row align='center' justify='center'>
      <v-col cols='9' sm='8' md='3' lg='3'>
        <v-card v-if='registration' class='elevation-12'>
          <v-toolbar color='primary' dark flat>
            <v-toolbar-title class="disable-select">
              {{ $t('homePageRegistrationTitelText') }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model='email' :label="$t('homePageEmailText')" class='disable-select'
                            clearable placeholder='mail@example.com' type='email'>
              </v-text-field>
              <v-text-field v-model='password.password' :label="$t('homePagePasswordText')" :placeholder="$t('homePagePasswordPlaceholderText')"
                            :type='registrationPasswordFieldType' class='disable-select'
                            clearable counter='30'>
                <template v-if="password.password !== ''" v-slot:append-inner>
                  <v-icon @click="toggleRegistrationPasswordFieldTypeVisibility">
                    {{ registrationPasswordFieldType === 'password' ? 'mdi-eye' : 'mdi-eye-off' }}
                  </v-icon>
                </template>
              </v-text-field>
              <v-text-field v-if="registrationPasswordFieldType === 'password'" v-model='password.confirm'
                            :label="$t('homePageConfirmPasswordText')" :placeholder="$t('homePagePasswordPlaceholderText')"
                            :type='registrationConfirmPasswordFieldType' class='disable-select'
                            clearable
                            counter='30' @click:append-inner='toggleRegistrationConfirmPasswordFieldTypeVisibility'>
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class='d-flex justify-space-between'>
            <v-btn class='mr-3' color='primary' variant='elevated' @click='onClickShowLoginWindow'>
              {{ $t('homePageLoginButton') }}
            </v-btn>
            <v-btn :disabled='registrationInProgress' :loading='registrationInProgress' class='ml-3' color='primary'
                   variant='elevated' @click='onClickRegisterButton'>
              {{ $t('homePageRegistrationButton') }}
            </v-btn>
          </v-card-actions>
          <v-alert v-model='alert' density='compact' dismissible dense type='error' closable
                   v-click-outside='onClickOutsideAlert'>
            {{ alertMessage }}
          </v-alert>
        </v-card>
        <v-card class='elevation-12' v-if="login">
          <v-toolbar color='primary' dark flat>
            <v-toolbar-title class="disable-select">
              {{ $t('homePageLoginTitelText') }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-card-text v-if='!isDemoOnly'>
            <v-form>
              <v-text-field v-model='email' :label="$t('homePageEmailText')" class='disable-select'
                            clearable placeholder='mail@example.com' type='email'>
              </v-text-field>
              <v-text-field v-model='password.password' :label="$t('homePagePasswordText')" :placeholder="$t('homePagePasswordPlaceholderText')"
                            :type='registrationPasswordFieldType' class='disable-select'
                            clearable counter='30'>
                <template v-if="password.password !== ''" v-slot:append-inner>
                  <v-icon @click="toggleRegistrationPasswordFieldTypeVisibility">
                    {{ registrationPasswordFieldType === 'password' ? 'mdi-eye' : 'mdi-eye-off' }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class='d-flex justify-space-between'>
            <v-btn v-if='!isDemoOnly' class='mr-3' color='primary' variant='elevated'
                   @click='onClickShowRegistrationWindow'>
              {{ $t('homePageRegistrationButton') }}
            </v-btn>
            <v-btn v-if='isDemoOnly' :disabled='demoLoginInProgress' :loading='demoLoginInProgress' class='mx-auto'
                   color='primary' variant='elevated' @click='onClickDemoButton'>
              {{ $t('homePageDemoButton') }}
            </v-btn>
            <v-btn v-if='!isDemoOnly' :disabled='loginInProgress' :loading='loginInProgress' class='ml-3'
                   color='primary' variant='elevated' @click='onClickLoginButton'>
              {{ $t('homePageLoginButton') }}
            </v-btn>
          </v-card-actions>
          <v-alert v-model='alert' density='compact' dismissible dense type='error' closable
                   v-click-outside='onClickOutsideAlert'>
            {{ alertMessage }}
          </v-alert>
        </v-card>
        <v-sheet v-if="registrationSuccess" class="text-center mx-auto" elevation="12" rounded>
          <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="100">
          </v-icon>
          <h2 class="text-h5 mb-2">
            {{ $t('homePageRegistrationSuccessTitelText') }}
          </h2>
          <p class="mb-4 text-medium-emphasis text-body-2">
            {{ $t('homePageRegistrationSuccessText') }}
          </p>
          <v-divider class="mb-2"></v-divider>
          <v-btn class="text-none mb-2" color='primary' variant='elevated' @click='onClickRegistrationSuccessButton'>
            {{ $t('homePageRegistrationSuccessButton') }}
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {useVuelidate} from '@vuelidate/core';
import {email, maxLength, minLength, required, sameAs} from '@vuelidate/validators';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {getDemoToken, getToken} from "@/api/util";
import {createUser} from '@/api/user';
import config from '../config/config.json';

export default defineComponent({
  name: 'HomePage',
  setup() {
    return {
      v$: useVuelidate(),
      store$: useStore(),
      router$: useRouter(),
    }
  },
  data() {
    return {
      isDemoOnly: false,
      login: true,
      registration: false,
      alert: false,
      alertMessage: '',
      registrationSuccess: false,
      registrationInProgress: false,
      demoLoginInProgress: false,
      loginInProgress: false,
      registrationPasswordFieldType: 'password',
      registrationConfirmPasswordFieldType: 'password',
      loginPasswordFieldType: 'password',
      email: '',
      password: {
        password: '',
        confirm: '',
      },
    }
  },
  validations() {
    return {
      form: {
        email: {
          required, email
        },
        password: {
          required,
          min: minLength(6),
          max: maxLength(30),
        },
        confirmPassword: {
          required,
          min: minLength(6),
          max: maxLength(30),
          sameAs: sameAs(this.password),
        }
      },
    }
  },
  mounted() {
    this.isDemoOnly = config.demoOnly;
    if (this.isDemoOnly) {
      this.alert = true;
      this.alertMessage = 'Demo mode activated';
    }
  },
  methods: {
    toggleRegistrationPasswordFieldTypeVisibility() {
      this.registrationPasswordFieldType = this.registrationPasswordFieldType === 'password' ? 'text' : 'password';
    },
    toggleRegistrationConfirmPasswordFieldTypeVisibility() {
      this.registrationConfirmPasswordFieldType = this.registrationConfirmPasswordFieldType === 'password' ? 'text' : 'password';
    },
    toggleLoginPasswordVisibility() {
      this.loginPasswordFieldType = this.loginPasswordFieldType === 'password' ? 'text' : 'password';
    },
    onClickShowRegistrationWindow() {
      this.email = '';
      this.password.password = '';
      this.password.confirm = '';
      this.login = false;
      this.registration = true;
      this.registrationPasswordFieldType = 'password';
    },
    onClickShowLoginWindow() {
      this.email = '';
      this.password.password = '';
      this.password.confirm = '';
      this.login = true;
      this.registration = false;
      this.registrationPasswordFieldType = 'password';
    },
    async onClickDemoButton() {
      this.demoLoginInProgress = true
      getDemoToken()
        .then((response) => {
          this.storeData(response);
          this.demoLoginInProgress = false;
          this.router$.push('/dashboard');
        })
        .catch((err) => {
          this.demoLoginInProgress = false;
          this.showAlert(err);
        })
    },
    onClickOutsideAlert() {
      this.alert = false;
      this.alertMessage = '';
    },
    onClickRegistrationSuccessButton() {
      this.registrationSuccess = false;
      this.login = true;
      this.email = '';
      this.password.password = '';
      this.password.confirm = '';
    },
    async onClickRegisterButton() {
      this.registrationInProgress = true;
      await createUser(this.prepareData())
        .then(() => {
          this.registration = false;
          this.registrationSuccess = true;
          this.registrationInProgress = false;
        })
        .catch((err) => {
          this.registrationInProgress = false;
          this.showAlert(err);
        })
    },
    async onClickLoginButton() {
      this.loginInProgress = true;
      await getToken(this.prepareData())
        .then((response) => {
          this.storeData(response);
          this.loginInProgress = false;
          this.router$.push('/dashboard');
        })
        .catch((err) => {
          this.loginInProgress = false;
          this.showAlert(err);
        })
    },
    storeData(response) {
      this.store$.commit('setToken', response.token);
      this.store$.commit('setUserId', response.userId);
    },
    prepareData() {
      return {
        'email': this.email,
        'password': this.password.password,
      };
    },
    showAlert(err: any) {
      this.alert = true;
      if (err.response) {
        this.alertMessage = err.response.data.message;
      } else {
        console.error(err.message);
        this.alertMessage = 'Something is wrong';
      }
    }
  },
});
</script>

<style>
.disable-select {
  user-select: none;
}
</style>
