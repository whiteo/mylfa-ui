import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {VDataTable, VDataTableServer, VDataTableVirtual} from 'vuetify/labs/VDataTable'

import {createVuetify} from 'vuetify'

export default createVuetify({
  components: {
    VDataTable,
    VDataTableServer,
    VDataTableVirtual,
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
        },
      },
      dark: {
        colors: {
          primary: '#1867C1',
        },
      },
    },
  },
})
