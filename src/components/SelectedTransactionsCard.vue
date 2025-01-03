<!-- SelectedTransactionCard.vue -->
<template>
    <div
      v-if="tidsSelected.length > 0"
      class="selected-transaction-card alert alert-primary"
    >
      <span>
        {{ tidsSelected.length }} transaction{{
          tidsSelected.length > 1 ? "s" : ""
        }}
        selected
      </span>
    </div>
  </template>
  
  <script>
  import { computed } from "vue";
  
  export default {
    props: ["tidsSelected"],
    setup(props) {
      const tidsSelected = computed(() => props.tidsSelected);
  
      return { tidsSelected };
    },
  };
  </script>
  
  <style scoped>
  .selected-transaction-card {
    z-index: 1;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 100px;
    padding: 20px;
  }
  </style>