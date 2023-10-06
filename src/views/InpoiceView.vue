<template>
  <div class="container">
    <div>所有款項金額 : {{ payCount }} NT</div>
    <ul>
      <li v-if="payMents.length > 0">
        <div v-for="member in members" :key="member.id">
          <span>{{ member.name }}</span>
          <span v-if="getPayments(member.name) > 0">
            應收 :
            <span class="getPay">{{ getPayments(member.name) }} NT</span>
          </span>
          <span v-else>
            應付 :
            <span class="pay"> {{ -getPayments(member.name) }} NT </span>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePaysStore } from "@/stores/pays";
const route = useRoute();
const pays = usePaysStore();

let payMents = reactive(pays.loadStorage("payMents") || []);
let members = reactive(pays.loadStorage("members") || []);
//總款項
const payCount = ref(pays.loadStorage("payCount") || 0);
//平均
const averagePay = ref(pays.loadStorage("averagePay") || 0);

const getPayments = (memberName) => {
  //過濾付款紀錄後相加
  const memberPays = payMents.filter((payment) => payment.payer === memberName);
  const payTotal = memberPays.reduce(
    (total, member) => total + member.total,
    0
  );
  const filterAveragePay = payTotal - averagePay.value;

  return filterAveragePay.toFixed(1);
};
</script>

<style scoped>
.container > div {
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

li > div {
  border-bottom: 1px solid black;
  font-size: 1rem;
}

ul {
  list-style-type: none;
}
.getPay {
  color: green;
}
.pay {
  color: red;
}
</style>
