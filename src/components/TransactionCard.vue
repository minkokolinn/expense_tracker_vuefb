<template>
  <div
    class="card-background row ps-2 ps-lg-4 my-3 py-3"
    :style="{
      boxShadow: `3px 6px ${transaction.type === 'in' ? '#0C6DFD' : 'black'}`,
      borderRadius: '20px',
    }"
  >
    <div
      class="col-3 col-lg-2 d-flex align-items-center justify-content-center"
    >
      <input v-if="showCheckbox" @change="$emit('selectedId',transaction.id,$event.target.checked)" :value="transaction.id" type="checkbox" class="me-2 big-checkbox" />
      <i
        v-else
        :class="categoryIcon"
        class="p-3 bg-primary rounded-3 text-white"
        style="font-size: 30px"
      ></i>
    </div>
    <div class="col-5 col-lg-7 d-flex flex-column align-items-start mt-1 p-0">
      <p class="m-0 fs-5 fw-bold">{{ transaction.title }}</p>
      <p class="m-0 fs-6">{{ transaction.catId.name }}</p>
    </div>
    <div
      class="col-4 col-lg-3 d-flex align-items-center justify-content-end lh-1 pe-4"
    >
      <div class="d-flex flex-wrap align-items-center fw-bold">
        <p class="m-0 fs-4 ms-auto">
          {{ transaction.type === "in" ? "+" : "-" }}
        </p>
        <p class="m-0 ps-1 fs-5 text-break">{{ transaction.amount }}</p>
        <p class="m-0 ps-1 fs-6 ms-auto">Bhat</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: ["transaction", "showCheckbox"],
  emits: ['selectedId'],
  setup(props, context) {
    let t = props.transaction;

    let iconsInfo = {
      cat1: "fas fa-hamburger",
      cat2: "fas fa-shuttle-van",
      cat3: "fas fa-calendar-alt",
      cat4: "fas fa-ellipsis-h",
      in: "fas fa-hand-holding-usd",
    };
    const categoryIcon = computed(() => {
      return t.catId == "" ? iconsInfo["in"] : iconsInfo[t.catId.id];
    });

    return {
      categoryIcon
    };
  },
};
</script>

<style scoped>
.card-background {
  background-color: #f1f1f1;
}
.select-card-background {
  background-color: #7c7c7c;
}
.big-checkbox {
  width: 30px;
  height: 30px;
}
</style>
