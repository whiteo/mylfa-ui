<template>
    <v-container class='fill-height' fluid>
      <v-row align='center' justify='center'>
        <v-col cols='12' sm='8' md='3'>
          <v-card class='elevation-12' v-if="isAuthenticated">
            <v-toolbar color='primary' dark flat>
              <v-toolbar-title>Register new account</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <validation-observer ref='observer' v-slot='{ invalid }'>
                <v-form @submit.prevent='register'>
                  <validation-provider v-slot='{ errors }' name='login' rules='required|min:5|max:30'>
                    <v-text-field v-model='login'
                                  counter='30'
                                  label='Login'
                                  name='login'
                                  type='text'
                                  :error-messages='errors'
                                  required
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider v-slot='{ errors }' name='password' rules='required|min:8|max:30'>
                    <v-text-field v-model='password'
                                  counter='30'
                                  label='Password'
                                  name='password'
                                  type='password'
                                  :error-messages='errors'
                                  required
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider v-slot='{ errors }' name='confirm password'
                                       rules='required|min:8|max:30|confirmed:password'>
                    <v-text-field v-model='confirmPassword'
                                  counter='30'
                                  label='Confirm Password'
                                  name='confirm password'
                                  type='password'
                                  :error-messages='errors'
                                  required
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider v-slot='{ errors }' name='e-mail' rules='required|email'>
                    <v-text-field v-model='mail'
                                  label='E-mail'
                                  name='email'
                                  type='email'
                                  :error-messages='errors'
                                  required
                    ></v-text-field>
                  </validation-provider>
                </v-form>
              </validation-observer>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <span :style="{ 'font-size': '13px'}">by registering you agree to the&nbsp;</span>
              <a href='https://forum.adenkingdom.ru/index.php?topic=2.0' target='_blank'>
                  <span :style="{ 'font-size': '13px'}">
                    Terms and Conditions
                  </span>
              </a>
              <v-spacer></v-spacer>
              <v-btn color='primary' :disabled='dialog' :loading='dialog' @click='register'>Register</v-btn>
            </v-card-actions>
            <v-alert v-model='alert' border='bottom' dismissible dense text type='error'>
              {{ alertMessage }}
            </v-alert>
          </v-card>
          <v-card class='elevation-12' v-if='success' v-click-outside='onClickOutside'>
            <v-toolbar color='primary' dark flat>
              <v-toolbar-title>Registration completed</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text justify='center'>
              To start the game you need verify your email and download the files
            </v-card-text>
            <v-card-actions class='justify-center'>
              <v-btn color='primary' elevation='2' @click='download'>Download</v-btn>
            </v-card-actions>
          </v-card>
          <v-card class='elevation-12' v-if='dialog'>
            <v-dialog v-model='dialog' hide-overlay persistent width='300'>
              <v-card color='primary' dark>
                <v-card-text>
                  in progress
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AccountPage',
  data() {
    return {
      isAuthenticated: false,
      username: '',
      email: '',
    };
  },
  methods: {
    login() {
      // Логика для входа пользователя
      // ...
      this.isAuthenticated = true;
      this.username = 'JohnDoe'; // Замените на имя пользователя после успешного входа
      this.email = 'johndoe@example.com'; // Замените на электронную почту пользователя после успешного входа
    },
    register() {
      // Логика для регистрации пользователя
      // ...
      this.isAuthenticated = false;
      this.username = 'JaneSmith'; // Замените на имя пользователя после успешной регистрации
      this.email = 'janesmith@example.com'; // Замените на электронную почту пользователя после успешной регистрации
    },
    forgotPassword() {
      // Логика для восстановления пароля
      // ...
      // Показать форму восстановления пароля или перенаправить пользователя на страницу восстановления пароля
    },
    changePassword() {
      // Логика для изменения пароля
      // ...
      // Показать форму изменения пароля
    },
    changeEmail() {
      // Логика для изменения электронной почты
      // ...
      // Показать форму изменения электронной почты
    },
  },
});
</script>

<style>

</style>
