<template>
  <v-container class='fill-height' fluid>
    <v-row align='center' justify='center'>
      <v-col cols='9' sm='8' md='3' lg='3'>
        <v-card class='elevation-12'>
          <v-toolbar color='primary' dark flat>
            <v-toolbar-title class='disable-select'>{{ $t('category') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn dark density='compact' icon='mdi-plus' variant='text'
                   @click='onClickShowNewItemWindow'></v-btn>
          </v-toolbar>

          <v-tabs v-model='tab' bg-color='primary' class='dynamic-tabs' density='compact'>
            <v-tab class='tab' prepend-icon='mdi-bank-plus' value='income' @click='onClickShowActualCategories'>
              {{ $t('income') }}
            </v-tab>
            <v-tab class='tab' prepend-icon='mdi-bank-minus' value='outlay' @click='onClickShowActualCategories'>
              {{ $t('outlay') }}
            </v-tab>
          </v-tabs>

          <v-data-table-server
            :headers='localizedHeaders'
            :items='items'
            :items-length='totalItems'
            :loading='loading'
            class='elevation-12'
            hover
            @update:options='loadFromServer'>

            <template v-slot:item.hide='{ item }'>
              <v-checkbox-btn v-model='item.columns.hide' disabled></v-checkbox-btn>
            </template>

            <template v-slot:item.actions='{ item }'>
              <v-icon class='me-2' size='small' @click="editItem(item.raw)">
                mdi-pencil
              </v-icon>
              <v-icon size='small' @click="deleteItem(item.raw)">
                mdi-delete
              </v-icon>
            </template>

          </v-data-table-server>
          <v-dialog v-model='newItemWindow' persistent>
            <v-row align='center' justify='center'>
              <v-col cols='9' lg='3' md='3' sm='8'>
                <v-card class='elevation-12'>
                  <v-toolbar color='primary' dark flat>
                    <v-toolbar-title class='disable-select text-center'>
                      {{ $t('categoryPageNewItemTitelText') }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                  <v-text-field v-model='categoryName' :label="$t('categoryPageNewItemNameText')" clearable>
                  </v-text-field>
                  <v-row>
                    <v-col cols='6'>
                      <v-checkbox-btn v-model='incomeCategory' :label="$t('income')"></v-checkbox-btn>
                    </v-col>
                    <v-col cols='6'>
                      <v-checkbox-btn v-model='outlayCategory' :label="$t('outlay')"></v-checkbox-btn>
                    </v-col>
                  </v-row>
                  <v-spacer></v-spacer>
                  <v-card-actions class='d-flex justify-center'>
                    <v-btn class='mx-auto text-center' color='primary' variant='elevated'
                           @click='onClickBackButton'>
                      {{ $t('backButton') }}
                    </v-btn>
                    <v-btn :disabled='addNewItemInProgress' :loading='addNewItemInProgress' class='mx-auto text-center'
                           color='primary' variant='elevated' @click='onClickAddNewItemButton'>
                      {{ $t('addButton') }}
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
              <v-card-title class="text-center">{{ $t('categoryPageDeleteItemText') }}</v-card-title>
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
          <v-dialog v-model='editDialog' max-width='400px' persistent>
            <v-card class='elevation-12'>
              <v-toolbar color='primary' dark flat>
                <v-toolbar-title class='disable-select'>
                  {{ $t('categoryPageEditItemText') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-text-field v-model='categoryName' :label="$t('categoryPageEditItemNameText')" clearable>
              </v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color='primary' variant='elevated' @click="onClickBackButton">
                  {{ $t('backButton') }}
                </v-btn>
                <v-btn color='primary' variant='elevated' @click="onClickEditButton">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
              <v-alert v-model='alert' v-click-outside='onClickOutsideAlert' closable dense density='compact' dismissible
                       type='error'>
                {{ alertMessage }}
              </v-alert>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {
  createIncomeCategory,
  deleteIncomeCategory,
  getIncomeCategories,
  updateIncomeCategory
} from '@/api/incomeCategory';
import {
  createOutlayCategory,
  deleteOutlayCategory,
  getOutlayCategories,
  updateOutlayCategory
} from '@/api/outlayCategory';

export default defineComponent({
  name: 'CurrencyPage',
  data() {
    return {
      headers: [
        {title: 'Name', key: 'name', sortable: false,},
        {title: 'Hide', key: 'hide', sortable: false,},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
      items: [],
      totalItems: 0,
      alert: false,
      alertMessage: '',
      selectItem: '',
      categoryName: '',
      tab: 'income',
      incomeCategory: false,
      outlayCategory: false,
      loading: false,
      deleteDialog: false,
      editDialog: false,
      newItemWindow: false,
      addNewItemInProgress: false,
    };
  },
  computed: {
    localizedHeaders() {
      return this.headers.map((header) => ({
        ...header,
        title: this.$t(`tableHeaders.${header.title}`),
      }));
    },
  },
  methods: {
    async loadFromServer() {
      this.items = [];
      this.loading = true;
      let response = null;
      if (this.tab === 'income') {
        response = await getIncomeCategories();
        this.items = response!.content;
        this.incomeCategory = true;
        this.outlayCategory = false;
      }
      if (this.tab === 'outlay') {
        response = await getOutlayCategories();
        this.items = response!.content;
        this.incomeCategory = false;
        this.outlayCategory = true;
      }
      this.totalItems = response!.totalElements;
      this.loading = false;
    },
    async onClickShowActualCategories() {
      await this.loadFromServer();
    },
    onClickShowNewItemWindow() {
      this.newItemWindow = true;
    },
    onClickBackButton() {
      this.newItemWindow = false;
      this.deleteDialog = false;
      this.editDialog = false;
      this.selectItem = '';
      this.addNewItemInProgress = false;
      this.alert = false;
      this.alertMessage = '';
      this.categoryName = '';
    },
    async onClickAddNewItemButton() {
      this.addNewItemInProgress = true;
      const data = {
        'name': this.categoryName,
      };
      if (this.outlayCategory) {
        await createOutlayCategory(data)
          .then(() => {
            this.addNewItemInProgress = false;
            this.newItemWindow = false;
            this.categoryName = '';
            this.loadFromServer();
          })
          .catch((err) => {
            this.addNewItemInProgress = false;
            this.showAlert(err);
          })
      }
      if (this.incomeCategory) {
        await createIncomeCategory(data)
          .then(() => {
            this.addNewItemInProgress = false;
            this.newItemWindow = false;
            this.categoryName = '';
            this.loadFromServer();
          })
          .catch((err) => {
            this.addNewItemInProgress = false;
            this.showAlert(err);
          })
      }
    },
    editItem(item: any) {
      this.selectItem = Object.assign({}, item)
      this.editDialog = true;
    },
    deleteItem(item: any) {
      this.selectItem = Object.assign({}, item)
      this.deleteDialog = true;
    },
    async onClickDeleteButton() {
      const itemId = this.selectItem.id;
      if (this.outlayCategory) {
        await deleteOutlayCategory(itemId)
          .then(() => {
            this.deleteDialog = false;
            this.selectItem = '';
            this.loadFromServer();
          })
          .catch((err) => {
            this.showAlert(err);
          });
      }
      if (this.incomeCategory) {
        await deleteIncomeCategory(itemId)
          .then(() => {
            this.deleteDialog = false;
            this.selectItem = '';
            this.loadFromServer();
          })
          .catch((err) => {
            this.showAlert(err);
          });
      }
    },
    async onClickEditButton() {
      const itemId = this.selectItem.id;
      const data = {
        'name': this.categoryName,
      };
      if (this.outlayCategory) {
        await updateOutlayCategory(itemId, data)
          .then(() => {
            this.editDialog = false;
            this.selectItem = '';
            this.categoryName = '';
            this.loadFromServer();
          })
          .catch((err) => {
            this.showAlert(err);
          });
      }
      if (this.incomeCategory) {
        await updateIncomeCategory(itemId, data)
          .then(() => {
            this.editDialog = false;
            this.selectItem = '';
            this.categoryName = '';
            this.loadFromServer();
          })
          .catch((err) => {
            this.showAlert(err);
          });
      }
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

.dynamic-tabs {
  display: flex;
  justify-content: space-between;
}

.dynamic-tabs .tab {
  flex-grow: 1;
  text-align: center;
}
</style>
