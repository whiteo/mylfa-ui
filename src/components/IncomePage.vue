<template>
  <v-container class='fill-height' fluid>
    <v-row align='center' justify='center'>
      <v-col cols='9' sm='8' md='3' lg='3'>
        <v-card class='elevation-12'>
          <v-toolbar color='primary' dark flat>
            <v-toolbar-title class='disable-select'>{{ $t('income') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn dark density='compact' icon='mdi-plus' variant='text'
                   @click='onClickShowNewItemWindow'></v-btn>
          </v-toolbar>

          <v-data-table-server
            :headers='localizedHeaders'
            :items='items'
            :items-length='totalItems'
            :loading='loading'
            class='elevation-12'
            show-expand
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
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length">
                  {{ item.raw.description }}
                </td>
              </tr>
            </template>

            <template v-slot:tfoot>
              <tr>
                <td style='width: 10%;'>
                  <v-text-field
                    :value='getTotalCount'
                    dense
                    density='compact'
                    disabled
                  ></v-text-field>
                </td>
                <td style='width: 30%;'>
                  <v-combobox
                    v-model='selectedCurrency'
                    :items='currencies'
                    :label="$t('currency')"
                    density='compact'
                    item-title='name'
                  ></v-combobox>
                </td>
                <td style='width: 30%;'>
                  <v-combobox
                    v-model='selectedCategory'
                    :items='categories'
                    :label="$t('category')"
                    density='compact'
                    item-title='name'
                  ></v-combobox>
                </td>
              </tr>
            </template>

          </v-data-table-server>

          <v-dialog v-model='newItemWindow' persistent>
            <v-row align='center' justify='center'>
              <v-col cols='9' lg='3' md='3' sm='8'>
                <v-card class='elevation-12'>
                  <v-toolbar color='primary' dark flat>
                    <v-toolbar-title class='disable-select text-center'>
                      {{ $t('incomePageNewItemTitelText') }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>

                  <v-row>
                    <v-col cols='6'>
                      <v-combobox
                        v-model='selectedCurrency'
                        :items='currencies'
                        :label="$t('currency')"
                        class="tab"
                        density='compact'
                        item-title='name'
                      ></v-combobox>
                    </v-col>
                    <v-col cols='6'>
                      <v-combobox
                        v-model='selectedCategory'
                        :items='categories'
                        :label="$t('category')"
                        class="tab"
                        density='compact'
                        item-title='name'
                      ></v-combobox>
                    </v-col>
                  </v-row>

                  <v-text-field
                    v-model='count'
                    density='compact'
                    hide-details
                    type='number'
                  ></v-text-field>
                  <v-text-field v-model='description' :label="$t('description')" clearable>
                  </v-text-field>

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
              <v-card-title class="text-center">{{ $t('incomePageDeleteItemText') }}</v-card-title>
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
                  {{ $t('incomePageEditItemText') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-row>
                <v-col cols='6'>
                  <v-combobox
                    v-model='selectedCurrency'
                    :items='currencies'
                    :label="$t('currency')"
                    class="tab"
                    density='compact'
                    item-title='name'
                  ></v-combobox>
                </v-col>
                <v-col cols='6'>
                  <v-combobox
                    v-model='selectedCategory'
                    :items='categories'
                    :label="$t('category')"
                    class="tab"
                    density='compact'
                    item-title='name'
                  ></v-combobox>
                </v-col>
              </v-row>

              <v-text-field
                v-model='count'
                density='compact'
                hide-details
                type='number'
              ></v-text-field>
              <v-text-field v-model='description' :label="$t('description')" clearable>
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
import {getIncomeCategories} from '@/api/incomeCategory';
import {getCurrencies} from "@/api/currency";
import {createIncome, deleteIncome, getIncomes, updateIncome} from "@/api/income";

export default defineComponent({
  name: 'IncomePage',
  data() {
    return {
      headers: [
        {title: 'Count', key: 'count', sortable: false,},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
      items: [],
      currencies: [],
      categories: [],
      totalItems: 0,
      selectedCurrency: null,
      selectedCategory: null,
      alert: false,
      alertMessage: '',
      selectItem: '',
      count: 0,
      description: '',
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
    getTotalCount() {
      let totalCount = 0;
      this.items.forEach(item => {
        totalCount += item.count;
      });
      return totalCount;
    },
  },
  methods: {
    async loadFromServer() {
      this.items = [];
      this.loading = true;
      const response = await getIncomes();
      this.items = response.content;
      this.totalItems = response.totalElements;
      this.loading = false;
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
      this.count = 0;
      this.description = '';
    },
    async onClickAddNewItemButton() {
      this.addNewItemInProgress = true;
      const selectedCategory = this.categories.find(category => category.name === this.selectedCategory)
      const selectedCurrency = this.currencies.find(currency => currency.name === this.selectedCurrency)
      const data = {
        'description': this.description,
        'count': this.count,
        'categoryId': selectedCategory.id,
        'currencyTypeId': selectedCurrency.id,
      };
      await createIncome(data)
        .then(() => {
          this.addNewItemInProgress = false;
          this.newItemWindow = false;
          this.count = 0;
          this.description = '';
          this.loadFromServer();
        })
        .catch((err) => {
          this.addNewItemInProgress = false;
          this.showAlert(err);
        })
    },
    editItem(item: any) {
      this.selectItem = Object.assign({}, item);
      this.description = this.selectItem.description;
      this.count = this.selectItem.count;
      this.editDialog = true;
    },
    deleteItem(item: any) {
      this.selectItem = Object.assign({}, item)
      this.deleteDialog = true;
    },
    async onClickDeleteButton() {
      const itemId = this.selectItem.id;
      await deleteIncome(itemId)
        .then(() => {
          this.deleteDialog = false;
          this.selectItem = '';
          this.loadFromServer();
        })
        .catch((err) => {
          this.showAlert(err);
        });
    },
    async onClickEditButton() {
      const itemId = this.selectItem.id;
      const selectedCategory = this.categories.find(category => category.name === this.selectedCategory)
      const selectedCurrency = this.currencies.find(currency => currency.name === this.selectedCurrency)
      const data = {
        'description': this.description,
        'count': this.count,
        'categoryId': selectedCategory.id,
        'currencyTypeId': selectedCurrency.id,
      };
      await updateIncome(itemId, data)
        .then(() => {
          this.editDialog = false;
          this.selectItem = '';
          this.count = 0;
          this.description = '';
          this.loadFromServer();
        })
        .catch((err) => {
          this.showAlert(err);
        });
    },
    async loadCurrencies() {
      const response = await getCurrencies();
      this.currencies = response.content;
      this.selectedCurrency = this.currencies[0].name;
    },
    async loadCategories() {
      const response = await getIncomeCategories();
      this.categories = response.content;
      this.selectedCategory = this.categories[0].name;
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
  mounted() {
    this.loadCurrencies();
    this.loadCategories();
  },
});
</script>

<style>
.disable-select {
  user-select: none;
}
</style>
