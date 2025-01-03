<template>
  <select
    class="form-select form-select-md me-2"
    aria-label="Large select example"
    v-model="selectedMonth"
    @change="handleSelectChange"
  >
    <option v-for="(month, index) in months" :key="index" :value="index + 1">
      {{ month }}
    </option>
  </select>
  <select
    v-model="selectedYear"
    class="form-select form-select-md"
    aria-label="Large select example"
    @change="handleSelectChange"
  >
    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
  </select>
</template>

<script>
import { ref } from "vue";
export default {
  emits:["filterSelectChange"],
  setup(props,context) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let selectedMonth = ref(
      new Date().getMonth()+1
    );

    let years = [];
    for (let i = 2024; i <= 2034; i++) {
      years.push(i);
    }
    let selectedYear = ref(new Date().getFullYear());

    let handleSelectChange = ()=>{
      context.emit("filterSelectChange",{
        selectedMonth : selectedMonth.value,
        selectedYear : selectedYear.value
      });
    }

    return {
      months,
      selectedMonth,
      years,
      selectedYear,
      handleSelectChange
    };
  },
};
</script>

<style></style>
