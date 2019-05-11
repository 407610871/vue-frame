import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/views/layout/Layout";
import Login from "@/views/layout/Login";
export const constantRouterMap = [
  {
    path: "",
    component: Layout,
    redirect: "home",
    children: [
      {
        path: "home",
        component: () => import("@/views/dashboard/index"),
        name: "home",
        meta: {
          title: "数据枢纽平台",
          icon: "home",
          noCache: true
        }
      }
    ]
  },
  {
    path: '',
    component: Login,
    children: [
      {
        path: "login",
        component: () => import("@/views/login/login"),
        name: "login",
        meta: {
          title: "数据枢纽平台",
          icon: "login",
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
