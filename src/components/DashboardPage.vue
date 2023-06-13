<template>
  <v-container class='fill-height' fluid>
    <v-row align='center' justify='center'>
      <v-col cols='9' lg='3' md='3' sm='8'>
        <v-card class='elevation-12'>
          <v-card-title>
            <h2>Income chart</h2>
          </v-card-title>
          <v-card-text>
            <PieChart v-if='loaded' :data='chartData2' :options='chartOptions'/>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols='9' lg='3' md='3' sm='8'>
        <v-card class='elevation-12'>
          <v-card-title>
            <h2>Outlay chart</h2>
          </v-card-title>
          <v-card-text>
            <PieChart v-if='loaded' :data='chartData' :options='chartOptions'/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {Pie} from 'vue-chartjs'
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {getOutlays} from "@/api/outlay";
import {getOutlayCategories} from "@/api/outlayCategory";
import {getIncomeCategories} from "@/api/incomeCategory";
import {getIncomes} from "@/api/income";

ChartJS.register(Title, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'DashboardPage',
  components: {PieChart: Pie},
  data() {
    return {
      loaded: false,
      chartData: {
        labels: [],
        datasets: [{backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'], data: []}],
      },
      chartData2: {
        labels: [],
        datasets: [{backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'], data: []}],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      }
    }
  },
  async mounted() {
    const categories = await getOutlayCategories();
    const outlays = await getOutlays();
    outlays.content.forEach(outlay => {
      let category = categories.content.find(category => category.id === outlay.categoryId);
      if (category) {
        this.chartData.labels.push(category.name);
        let dataset = this.chartData.datasets[0];
        dataset.data.push(outlay.count);
      }
    });
    const categories2 = await getIncomeCategories();
    const incomes = await getIncomes();
    incomes.content.forEach(outlay => {
      let category = categories2.content.find(category => category.id === outlay.categoryId);
      if (category) {
        this.chartData2.labels.push(category.name);
        let dataset = this.chartData2.datasets[0];
        dataset.data.push(outlay.count);
      }
    });
    this.loaded = true;
  },
});
</script>

<style>

</style>
