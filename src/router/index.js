import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/views/layout/Layout";

export const constantRouterMap = [
  {
    path: "",
    component: Layout,
    redirect: "user",
    children: [
      {
        path: "user",
        component: () => import("@/views/dashboard/index"),
        name: "user",
        meta: {
          title: "用户管理",
          icon: "user",
          noCache: true
        }
      }
    ]
  }
];

export default new Router({
  mode: "history", // require service support
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
