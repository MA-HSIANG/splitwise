<template>
  <div class="container">
    <div>
      <h4>
        <div @click="close" class="close">X</div>
        <slot name="title"></slot>
      </h4>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["handelClose"]);

const close = () => {
  emits("handelClose", true);
};
</script>

<style scoped>
.container {
  background-color: #fff;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
h4 {
  position: relative;
  font-size: 1.2rem;
  font-weight: 350;
  letter-spacing: 1.5px;
  padding: 0.25rem 0.5rem;
  background-color: var(--primary-black2);
  color: var(--primary-black-text);
  border-radius: 8px 8px 0 0;
}
.close {
  position: absolute;
  right: 0.75rem;
  top: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
