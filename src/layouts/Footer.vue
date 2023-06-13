<template>
  <v-footer app>
    <div class='footer-content'>
      <v-divider></v-divider>
      <v-row justify='center' no-gutters>
        <v-col class='text-center' cols='12'>
          <span>&copy; {{ currentYear }} {{ $t('footerText') }} <a :href="feLink">FE v.{{ feVersion }}</a> | <a
            :href="beLink">BE v.{{ beVersion }}</a></span>
        </v-col>
      </v-row>
    </div>
  </v-footer>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import packageJson from '../../package.json';
import {getBEVersion} from "@/api/util";

export default defineComponent({
  name: 'Footer',
  data() {
    return {
      beVersion: '',
      feLink: 'https://github.com/whiteo/mylfa-ui/',
      beLink: 'https://github.com/whiteo/mylfa/',
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    feVersion() {
      return packageJson.version;
    },
  },
  async created() {
    this.beVersion = await getBEVersion();
  },
});
</script>

<style>
.footer-content {
  position: fixed;
  font-size: x-small;
  user-select: none;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
