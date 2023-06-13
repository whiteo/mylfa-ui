<template>
  <v-container class='fill-height' fluid>
    <v-row align='center' justify='center'>
      <v-col cols='9' sm='8' md='3' lg='3'>
        <v-card v-if='accountWindow' class='elevation-12'>
          <v-toolbar color='primary' dark flat>
            <v-toolbar-title class="disable-select">{{ $t('account') }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field :model-value=account :label="$t('account')" disabled></v-text-field>
              <v-checkbox :model-value=verified :label="$t('verified')" disabled></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions class='d-flex justify-center flex-column'>
            <v-btn class='mx-auto mb-1 text-center' color='primary' style='min-width: 40%' variant='elevated'
                   @click='onClickShowChangePasswordWindow'>
              {{ $t('accountPageChangePasswordButton') }}
            </v-btn>
            <v-btn class='mx-auto mb-1 text-center' color='primary' style='min-width: 40%' variant='elevated'
                   @click='onClickShowChangeEmailWindow'>
              {{ $t('accountPageChangeEmailButton') }}
            </v-btn>
            <v-btn class='mx-auto mb-1 text-center' color='primary' style='min-width: 40%' variant='elevated'
                   @click='onClickDeleteAccountButton'>
              {{ $t('accountPageDeleteAccountButton') }}
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model='passwordWindow' persistent>
          <v-row align='center' justify='center'>
            <v-col cols='9' lg='3' md='3' sm='8'>
              <v-card class='elevation-12'>
                <v-toolbar color='primary' dark flat>
                  <v-toolbar-title class='disable-select text-center'>
                    {{ $t('accountPageChangePasswordTitelText') }}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-text-field v-model='password.old' :append-inner-icon="changeOldPasswordFieldType === 'password' ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('accountPageOldPasswordText')"
                              :placeholder="$t('homePagePasswordPlaceholderText')" :type='changeOldPasswordFieldType'
                              class='disable-select'
                              clearable
                              counter='30' @click:append-inner='toggleChangeOldPasswordFieldTypeVisibility'>
                </v-text-field>
                <v-text-field v-model='password.password' :append-inner-icon="changePasswordFieldType === 'password' ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('homePagePasswordText')"
                              :placeholder="$t('homePagePasswordPlaceholderText')" :type='changePasswordFieldType'
                              class='disable-select'
                              clearable
                              counter='30' @click:append-inner='toggleChangePasswordFieldTypeVisibility'>
                </v-text-field>
                <v-text-field v-if="changePasswordFieldType === 'password'" v-model='password.confirm'
                              :append-inner-icon="changeConfirmPasswordFieldType === 'password' ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('homePageConfirmPasswordText')"
                              :placeholder="$t('homePagePasswordPlaceholderText')" :type='changeConfirmPasswordFieldType'
                              class='disable-select'
                              clearable
                              counter='30' @click:append-inner='toggleChangeConfirmPasswordFieldTypeVisibility'>
                </v-text-field>
                <v-card-actions class='d-flex justify-center'>
                  <v-btn class='mx-auto text-center' color='primary' variant='elevated' @click='onClickBackButton'>
                    {{ $t('backButton') }}
                  </v-btn>
                  <v-btn :disabled='changePasswordInProgress' :loading='changePasswordInProgress' class='mx-auto text-center'
                         color='primary' variant='elevated' @click='onClickChangePasswordButton'>
                    {{ $t('accountPageChangePasswordButton') }}
                  </v-btn>
                </v-card-actions>
                <v-alert v-model='alert' v-click-outside='onClickOutsideAlert' closable dense density='compact' dismissible
                         type='error'>
                  {{ alertMessage }}
                </v-alert>
              </v-card>
            </v-col>
          </v-row>
        </v-dialog>
        <v-dialog v-model='emailWindow' persistent>
          <v-row align='center' justify='center'>
            <v-col cols='9' lg='3' md='3' sm='8'>
              <v-card class='elevation-12'>
                <v-toolbar color='primary' dark flat>
                  <v-toolbar-title class='disable-select text-center'>
                    {{ $t('accountPageChangeEmailTitelText') }}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-text-field v-model='email' :label="$t('homePageEmailText')" class='disable-select'
                              clearable placeholder='mail@example.com' type='email'>
                </v-text-field>
                <v-card-actions class='d-flex justify-center'>
                  <v-btn class='mx-auto text-center' color='primary' variant='elevated'
                         @click='onClickBackButton'>
                    {{ $t('backButton') }}
                  </v-btn>
                  <v-btn :disabled='changeEmailInProgress' :loading='changeEmailInProgress' class='mx-auto text-center'
                         color='primary' variant='elevated' @click='onClickChangeEmailButton'>
                    {{ $t('accountPageChangeEmailButton') }}
                  </v-btn>
                </v-card-actions>
                <v-alert v-model='alert' v-click-outside='onClickOutsideAlert' closable dense density='compact' dismissible
                         type='error'>
                  {{ alertMessage }}
                </v-alert>
              </v-card>
            </v-col>
          </v-row>
        </v-dialog>
        <v-dialog v-model='deleteDialog' max-width='600px' persistent>
          <v-card class='elevation-12'>
            <v-card-title class="text-center">{{ $t('accountPageDeleteText') }}</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color='primary' variant='elevated' @click="onClickBackButton">
                {{ $t('backButton') }}
              </v-btn>
              <v-btn color='primary' variant='elevated' @click="onClickDeleteButton">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {changeUserEmail, changeUserPassword, deleteUser} from "@/api/user";
import {logout} from "@/api/util";

export default defineComponent({
  name: 'AccountPage',
  setup() {
    return {
      store$: useStore(),
      router$: useRouter(),
    }
  },
  data() {
    return {
      alert: false,
      alertMessage: '',
      account: '',
      changeOldPasswordFieldType: 'password',
      changePasswordFieldType: 'password',
      changeConfirmPasswordFieldType: 'password',
      email: '',
      password: {
        password: '',
        confirm: '',
        old: '',
      },
      verified: false,
      emailWindow: false,
      accountWindow: true,
      passwordWindow: false,
      changePasswordInProgress: false,
      changeEmailInProgress: false,
      deleteDialog: false,
    };
  },
  mounted() {
    this.account = this.store$.state.account;
    this.verified = this.store$.state.verified;
  },
  methods: {
    onClickDeleteAccountButton() {
      this.deleteDialog = true;
    },
    onClickShowChangeEmailWindow() {
      this.emailWindow = true;
      this.accountWindow = false;
    },
    async onClickChangeEmailButton() {
      this.changeEmailInProgress = true;
      const data = {
        'email': this.email,
      };
      await changeUserEmail(data)
        .then((response) => {
          this.changeEmailInProgress = false;
          this.emailWindow = false;
          this.accountWindow = true;
          this.account = response.email;
          this.verified = response.verified;
          this.store$.commit('setAccount', response.email);
          this.store$.commit('setVerified', response.verified);
          this.email = '';
        })
        .catch((err) => {
          this.changeEmailInProgress = false;
          this.showAlert(err);
        })
    },
    onClickShowChangePasswordWindow() {
      this.passwordWindow = true;
      this.accountWindow = false;
    },
    onClickBackButton() {
      this.email = '';
      this.password.old = '';
      this.password.password = '';
      this.password.confirm = '';
      this.emailWindow = false;
      this.passwordWindow = false;
      this.accountWindow = true;
      this.changePasswordInProgress = false;
      this.changeEmailInProgress = false;
      this.deleteDialog = false;
    },
    toggleChangeOldPasswordFieldTypeVisibility() {
      this.changeOldPasswordFieldType = this.changeOldPasswordFieldType === 'password' ? 'text' : 'password';
    },
    toggleChangePasswordFieldTypeVisibility() {
      this.changePasswordFieldType = this.changePasswordFieldType === 'password' ? 'text' : 'password';
    },
    toggleChangeConfirmPasswordFieldTypeVisibility() {
      this.changeConfirmPasswordFieldType = this.changeConfirmPasswordFieldType === 'password' ? 'text' : 'password';
    },
    async onClickDeleteButton() {
      await deleteUser();
      await logout();
      this.store$.commit('clearToken');
      await this.router$.push('/');
    },
    async onClickChangePasswordButton() {
      this.changePasswordInProgress = true;
      const data = {
        'password': this.password.password,
        'oldPassword': this.password.old,
      };
      await changeUserPassword(data)
        .then(() => {
          this.changePasswordInProgress = false;
          this.passwordWindow = false;
          this.accountWindow = true;
          this.password.old = '';
          this.password.password = '';
          this.password.confirm = '';
        })
        .catch((err) => {
          this.changePasswordInProgress = false;
          this.showAlert(err);
        })
    },
    showAlert(err: any) {
      this.alert = true;
      if (err.response) {
        this.alertMessage = err.response.data.message;
      } else {
        console.error(err.message);
        this.alertMessage = 'Something is wrong';
      }
    },
    onClickOutsideAlert() {
      this.alert = false;
      this.alertMessage = '';
    },
  },
});
</script>

<style>
.disable-select {
  user-select: none;
}
</style>
