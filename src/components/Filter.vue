<template>
  <select
    class="form-select form-select-md me-2"
    aria-label="Large select example"
    v-model="selectedMonth"
  >
    <option v-for="(month,index) in months" :key="index" :value="month">{{ month }}</option>
  </select>
  <select v-model="selectedYear" class="form-select form-select-md" aria-label="Large select example">
    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
  </select>
</template>

<script>
import { ref } from 'vue';
export default {
    setup(){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let selectedMonth = ref(new Date().toLocaleString('default',{month:'long'}));

        let years = [];
        for(let i = 2024;i<=2034;i++){
            years.push(i)
        }
        let selectedYear = ref(new Date().getFullYear());
        return {
            months,
            selectedMonth,
            years,
            selectedYear
        }
    }
};
</script>

<style></style>
