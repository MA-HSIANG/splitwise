import { ref, reactive } from "vue";
import { defineStore } from "pinia";

export const usePaysStore = defineStore("pays", () => {
  //儲存
  const saveStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  //讀取
  const loadStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };

  const removeAll = () => {
    localStorage.clear();
  };

  return {
    removeAll,
    loadStorage,
    saveStorage,
  };
});
