<template>
  <div class="card">
    <header>
      <div>簡單分帳</div>
    </header>
    <section v-if="route.path === '/'">
      <div v-if="payMents.length === 0" class="payZero">
        <div>😢</div>
        <span>無資料</span>
      </div>

      <ul v-else>
        <li class="list" v-for="pay of payMents" :key="pay.id">
          <div
            :class="
              isDelete && deleteId === pay.id ? 'list--delete' : 'list--payer'
            "
          >
            <div class="list--title">
              <div>{{ pay.payer }}</div>
              <h2>{{ pay.name }}💸</h2>
            </div>
            <div class="list--footer">
              <span>${{ pay.total }}</span>
              <div @click="delPay(pay.id)">❌</div>
            </div>
          </div>
        </li>
      </ul>

      <div class="modal--container" v-if="showMembers">
        <Modal @handelClose="handelClose">
          <template #title> 新增旅遊成員? </template>
          <template #content>
            <div class="create--member">
              <label>成員姓名:</label>
              <input type="text" v-model="member" />
              <div class="create--btn" @click="createMember">+</div>
            </div>
          </template>
        </Modal>
      </div>

      <div class="modal--pay-container" v-if="showPay">
        <Modal @handelClose="handelClose">
          <template #title> 新增旅遊款項? </template>
          <template #content>
            <div class="create--pay">
              <label>款項名:</label>
              <input type="text" v-model="payName" />
              <label>款項:</label>
              <input type="number" v-model="payMent" />
              <select v-model="payer">
                <option value="">--誰來付款?--</option>
                <option v-for="m of members" :key="m.id" :value="m.name">
                  {{ m.name }}
                </option>
              </select>
              <div class="create--btn" @click="createPayMent">+</div>
            </div>
          </template>
        </Modal>
      </div>

      <div
        class="alert--container"
        :class="showAlert ? 'alert--open' : 'alert--close'"
      >
        <Alert
          @handelAlertClose="handelAlertClose"
          :alertText="alertText"
        ></Alert>
      </div>
    </section>
    <section>
      <RouterView v-if="isReload"></RouterView>
    </section>
    <div class="allPayCount--container" v-if="route.path === '/'">
      <div>所有款項金額 : {{ payCount }} NT</div>
    </div>
    <Tools
      @handelShowMembers="handelShowMembers"
      @handelShowPay="handelShowPay"
      @handelRemoveAll="handelRemoveAll"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { useRouter, useRoute, RouterView } from "vue-router";
import { usePaysStore } from "@/stores/pays";
import Tools from "@/components/Tools.vue";
import Modal from "@/components/Modal.vue";
import Alert from "@/components/Alert.vue";

const router = useRouter();
const route = useRoute();
const pays = usePaysStore();
//款項
const payMent = ref(0);
const payName = ref("");
let payMents = reactive(pays.loadStorage("payMents") || []);
const payer = ref("");
//成員
const member = ref("");
let members = reactive(pays.loadStorage("members") || []);
//平均
const averagePay = ref(pays.loadStorage("averagePay"));
//總款項
const payCount = ref(0);
//刪除
const isDelete = ref(false);
const deleteId = ref(0);

//modal
const showMembers = ref(false);
const showPay = ref(false);
//alert
const showAlert = ref(false);
const alertText = ref("");

const isReload = ref(true);

const createMember = () => {
  if (member.value === "") {
    alertText.value = "請輸入成員...";
    showAlert.value = true;

    return;
  }
  const data = {
    id: new Date().getTime(),
    name: member.value,
  };
  members.push(data);
  pays.saveStorage("members", members);
  loadCount();
  member.value = "";
  showMembers.value = false;
};

const createPayMent = () => {
  if (
    payName.value === "" ||
    Number(payMent.value) === 0 ||
    payer.value === ""
  ) {
    alertText.value = "內容有空請確認!!";
    showAlert.value = true;
    return;
  }
  const data = {
    id: new Date().getTime(),
    name: payName.value,
    total: payMent.value,
    payer: payer.value,
  };
  payMents.push(data);
  pays.saveStorage("payMents", payMents);
  loadCount();
};
const loadCount = () => {
  payCount.value = payMents.reduce(
    (total, payMent) => total + payMent.total,
    0
  );
  averagePay.value = (payCount.value / members.length).toFixed(1);
  pays.saveStorage("payCount", payCount.value);
  pays.saveStorage("averagePay", averagePay.value);
  payName.value = "";
  payMent.value = 0;
  payer.value = "";
  showPay.value = false;
};

//接收
const handelShowMembers = (value) => {
  showMembers.value = value;
};
const handelShowPay = (value) => {
  showPay.value = value;
};
const handelRemoveAll = (value) => {
  if (value) {
    pays.removeAll();
    payMents.length = 0;
    members.length = 0;
    averagePay.value = 0;
    payCount.value = 0;

    isReload.value = false;
    setTimeout(() => {
      isReload.value = true;
    }, 50);
  }
};
const delPay = (id) => {
  deleteId.value = id;
  isDelete.value = true;
  setTimeout(() => {
    payMents = payMents.filter((payMent) => payMent.id !== id);
    pays.saveStorage("payMents", payMents);
    loadCount();
  }, 250);
};
const handelClose = (value) => {
  if (value) {
    showMembers.value = false;
    showPay.value = false;
  }
};
const handelAlertClose = (value) => {
  if (value) {
    showAlert.value = false;
  }
};
onMounted(() => {
  loadCount();
});
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: space-between;
}

header {
  text-align: center;
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  font-size: 1.8rem;
  letter-spacing: 1.2px;
}
section {
  display: flex;
  justify-content: center;
  align-items: center;

  overflow: scroll;
}
ul {
  list-style-type: none;
  margin-top: 1rem;
}
.payZero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 300;
  letter-spacing: 1.2px;
  color: var(--primary-black-text2);
}
.payZero > div {
  font-size: 2rem;
}
.payZero > span {
  font-size: 1rem;
}
.list--payer {
  display: flex;
  justify-content: space-between;
  width: 20rem;
  gap: 1rem;
  margin-bottom: 0.5rem;
  margin-right: 2.5rem;
  font-size: 1.2rem;
  border-bottom: 1px solid var(--primary-black);
  animation: add 1s;
}
.list--payer,
h2 {
  font-weight: 300;
  font-size: 1.2rem;
}
.list--delete {
  display: flex;
  justify-content: space-between;
  width: 20rem;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  border-bottom: 1px solid black;
  animation: del 0.3s;
}
.list--title {
  display: flex;
  gap: 1rem;
}
.list--footer {
  display: flex;
}
.counts--container {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-light-1);
}

.create--member {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  font-size: 1rem;
  background-color: #fff;
  border: 1px solid var(--primary-black);
  border-top: transparent;
  border-radius: 0 0 8px 8px;
}

.create--pay {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem;
  background-color: #fff;
  border: 1px solid var(--primary-black);
  border-top: transparent;
  border-radius: 0 0 8px 8px;
}
.create--pay > .create--btn {
  text-align: center;
}
.create--btn {
  background-color: var(--primary-btn);
  padding: 0 0.5rem;
  cursor: pointer;
  color: #fff;
  border-radius: 3px;
}
.allPayCount--container {
  display: flex;
  justify-content: end;
  margin-right: 2.5rem;
}
.allPayCount--container div {
  font-size: 0.5rem;
  letter-spacing: 1px;
}

.alert--container {
  position: fixed;
  opacity: 0;
  transition: all 0.6s;
}
.alert--open {
  top: 10px;
  opacity: 1;
}
.alert--close {
  top: -100px;
}
::-webkit-scrollbar {
  display: none;
}
/*animation*/

@keyframes add {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes del {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
