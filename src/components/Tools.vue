<template>
  <div class="tools">
    <div class="createMembers" v-if="route.path === '/'">
      <div>🙍‍♂️</div>
      <div @click="openCreateMember">新增成員</div>
    </div>
    <div class="createPay" v-if="route.path === '/'">
      <div>💲</div>
      <div @click="openCreatePay">新增款項</div>
    </div>
    <div v-if="route.path === '/'">
      <div>📄</div>
      <div @click="toInpoice">分帳明細</div>
    </div>
    <div v-if="route.path === '/inpoice'">
      <div>🏠</div>
      <div @click="toHome">付款明細</div>
    </div>
    <div>
      <div>🖐</div>
      <div @click="exit">旅途結束</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePaysStore } from "@/stores/pays";
const router = useRouter();
const route = useRoute();
const showMembers = ref(false);
const showPay = ref(false);
const emits = defineEmits([
  "handelShowMembers",
  "handelShowPay",
  "handelRemoveAll",
]);

const pays = usePaysStore();
//modal
const openCreateMember = () => {
  showMembers.value = true;

  emits("handelShowMembers", showMembers.value);
};
const openCreatePay = () => {
  showPay.value = true;

  emits("handelShowPay", showPay.value);
};

const toInpoice = () => {
  router.push("/inpoice");
};
const toHome = () => {
  router.push("/");
};
const exit = () => {
  emits("handelRemoveAll", true);
};
</script>

<style scoped>
.tools {
  display: flex;
  width: 100%;
  background-color: var(--primary-black);
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  color: var(--primary-black-text);
}
</style>
