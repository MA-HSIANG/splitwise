import { createRouter, createWebHistory } from "vue-router";
import InpoiceView from "../views/InpoiceView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/inpoice",
      name: "inpoice",
      component: InpoiceView,
    },
  ],
});

export default router;
