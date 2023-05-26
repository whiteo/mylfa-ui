import vuetify from './vuetify'
import i18n from './i18n';
import type {App} from 'vue'

export function registerPlugins(app: App) {
  app
    .use(i18n)
    .use(vuetify)
}
