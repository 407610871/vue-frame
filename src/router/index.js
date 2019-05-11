import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/views/layout/Layout";

export const constantRouterMap = [
  {
    path: "/",
    component: Layout,
    redirect: "user",
    children: [
      {
        path: "user",
        component: () => import("@/views/usersManagement/usersList"),
        name: "user",
        meta: {
          title: "用户管理",
          icon: "user",
          noCache: true,
          keepAlive: false
  
        }
      },
      {
        path: "role",
        component: () => import("@/views/rolesManagement/rolesList"),
        name: "role",
        meta: {
          title: "角色管理",
          icon: "role",
          noCache: true,
          keepAlive: false  
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
