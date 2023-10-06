<template>
  <div class="alert alert-danger">
    <span>💥</span>
    {{ props.alertText }}
    <button @click="close" class="btn-close">×</button>
  </div>
</template>

<script setup>
const emits = defineEmits(["handelAlertClose"]);
const props = defineProps({
  alertText: {
    type: String,
    default: "這是一個警告!!",
  },
});
const close = () => {
  emits("handelAlertClose", true);
};
</script>

<style scoped>
.alert {
  display: flex;
  justify-content: space-between;
  background-color: #e5e7eb;
  padding: 10px 30px;
  letter-spacing: 3px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.alert-danger {
  background-color: #ef4444;
  color: #fee2e2;
}

.btn-close {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #6b7280;
}

.btn-close:hover {
  background-color: #c9c8c8;
  color: #fff;
}
</style>
