<template>
  <v-container class='fill-height' fluid>
    <v-row align='center' justify='center'>
      <v-col cols='9' sm='8' md='3' lg='3'>
        <v-card class='elevation-12'>
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {useStore} from "vuex";

export default defineComponent({
  name: 'AccountPage',
  setup() {
    return {
      store$: useStore(),
    }
  },
  data() {
    return {
      account: '',
      verified: false,
    };
  },
  mounted() {
    this.account = this.store$.state.account;
    this.verified = this.store$.state.verified;
  },
  methods: {},
});
</script>

<style>
.disable-select {
  user-select: none;
}
</style>
