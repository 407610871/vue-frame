import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/views/layout/Layout";

export const constantRouterMap = [
  {
    path: "",
    component: Layout,
    redirect: "dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "dashboard",
          noCache: true
        }
      },
      {
        path: "dashboardsub",
        component: () => import("@/views/dashboardsub/index"),
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "dashboard",
          noCache: true
        }
      },
      {
        path: "form",
        component: () => import("@/views/form/index"),
        name: "Dashboard",
        meta: {
          title: "form",
          icon: "dashboard",
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
