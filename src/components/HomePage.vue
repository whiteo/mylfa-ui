<template>
  <v-container class='fill-height' fluid>
    <v-row align='center' justify='center'>
      <v-col cols='9' sm='8' md='3' lg='3'>
        <v-card class='elevation-12' v-if="registration">
          <v-toolbar color='primary' dark flat>
            <v-toolbar-title class="disable-select">{{ $t('HomePageRegistrationTitelText') }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model='email' :label="$t('HomePageEmailText')" name='email'
                            type='email' class='disable-select'>
              </v-text-field>
              <v-text-field v-model='password' counter='30' :label="$t('HomePagePasswordText')"
                            name='password' type='password' class='disable-select'>
              </v-text-field>
              <v-text-field v-model='password.confirm' counter='30' :label="$t('HomePageConfirmPasswordText')"
                            name='confirm password' type='password' class='disable-select'>
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class='d-flex justify-space-between'>
            <v-btn class='mr-3' color='primary' variant='elevated' @click='onClickShowLoginWindow'>
              {{ $t('HomePageLoginButton') }}
            </v-btn>
            <v-btn class='ml-3' color='primary' :disabled='registrationDialog' variant='elevated'
                   :loading='registrationDialog' @click='onClickRegisterButton'>
              {{ $t('HomePageRegistrationButton') }}
            </v-btn>
          </v-card-actions>
          <v-alert v-model='alert' density='compact' dismissible dense type='error' closable
                   v-click-outside='onClickOutsideAlert'>
            {{ alertMessage }}
          </v-alert>
        </v-card>
        <v-card class='elevation-12' v-if="login">
          <v-toolbar color='primary' dark flat>
            <v-toolbar-title class="disable-select">{{ $t('HomePageLoginTitelText') }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-card-text>
            <v-form>
              <v-text-field v-model.trim='email' :label="$t('HomePageEmailText')" name='email'
                            type='email' class='disable-select'></v-text-field>
              <v-text-field v-model.trim='password' :label="$t('HomePagePasswordText')"
                            name='password' type='password' class='disable-select'></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class='d-flex justify-space-between'>
            <v-btn class='mr-3' color='primary' :disabled="dialog" variant='elevated' :loading='dialog'
                   @click='onClickShowRegistrationWindow'>
              {{ $t('HomePageRegistrationButton') }}
            </v-btn>
            <v-btn class='mx-auto' color='primary' :disabled='dialog' variant='elevated' :loading='dialog'
                   @click='onClickDemoButton'>
              {{ $t('HomePageDemoButton') }}
            </v-btn>
            <v-btn class='ml-3' color='primary' :disabled="dialog" variant='elevated' :loading='dialog'
                   @click='onClickLoginButton'>
              {{ $t('HomePageLoginButton') }}
            </v-btn>
          </v-card-actions>
          <v-alert v-model='alert' density='compact' dismissible dense type='error' closable
                   v-click-outside='onClickOutsideAlert'>
            {{ alertMessage }}
          </v-alert>
        </v-card>
        <v-alert v-model='registrationSuccess' density='compact' dismissible dense type='success' closable
                 v-click-outside='onClickOutsideAlert'>
          {{ alertMessage }}
        </v-alert>
        <v-card class='elevation-12' v-if='registrationDialog'>
          <v-dialog v-model='registrationDialog' hide-overlay persistent width='300'>
            <v-card color='primary' dark>
              <v-card-text>
                {{ $t('HomePageInProgressText') }}
                <v-progress-linear indeterminate color='white' class='mb-0'></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {useVuelidate} from '@vuelidate/core';
import {email, minLength, maxLength, required, sameAs} from '@vuelidate/validators';
import axios from 'axios';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {getDemoToken} from '@/api/api';

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
      login: true,
      registration: false,
      dialog: false,
      alert: false,
      alertMessage: '',
      registrationDialog: false,
      registrationSuccess: false,
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
  methods: {
    onClickShowRegistrationWindow() {
      this.login = false
      this.registration = true
    },
    onClickShowLoginWindow() {
      this.login = true
      this.registration = false
    },
    async onClickDemoButton() {
      getDemoToken()
        .then((response) => {
          this.store$.commit('setToken', response.token);
          this.store$.commit('setUserId', response.userId);
          this.router$.push('/dashboard');
        })
        .catch((err) => {
          this.alert = true
          if (err.response) {
            this.alertMessage = err.response.data.message
          } else {
            console.log(err.message)
            this.alertMessage = 'Something is wrong'
          }
        })
    },
    onClickOutsideAlert() {
      this.alert = false
      this.registrationSuccess = false
      this.alertMessage = ''
    },
    onClickRegisterButton() {
      this.registrationDialog = true
      this.registration = false
    },
    onClickLoginButton() {

    },
  },
  watch: {
    registrationDialog(val) {
      if (!val) return
      const headers = {
        'Content-Type': 'application/json',
      }
      const data = {
        'email': this.email,
        'password': this.password.password,
      }
      this.email = ''
      this.password.password = ''
      this.password.confirm = ''
      axios.post('http://127.0.0.1:8080/mylfa/api/v1/user/create', JSON.stringify(data), {headers})
        .then(() => {
          this.registrationDialog = false
          this.login = true
          this.registrationSuccess = true
          this.alertMessage = 'Success'
        })
        .catch((err) => {
          this.registration = true
          this.registrationDialog = false
          this.alert = true
          if (err.response) {
            this.alertMessage = err.response.data.message
          } else if (err.request) {
            this.alertMessage = err.request
          } else {
            this.alertMessage = err.message
          }
        })
    },
  },
});
</script>

<style>
.disable-select {
  user-select: none;
}
</style>
