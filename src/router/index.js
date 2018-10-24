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
        name: "dashboard",
        meta: {
          title: "dashboard",
          icon: "dashboard",
          noCache: true
        }
      },
      {
        path: "accessObjManage/:sourceId/:sourceName",
        component: () => import("@/views/accessObjManage/index"),
        name: "accessObjManage",
        meta: {
          title: "dashboard",
          icon: "dashboard",
          noCache: true
        }
      },
      {
        path: "accessObjInfo/:sourceId/:sourceName/:objId/:objName",
        component: () => import("@/views/accessObjInfo/index"),
        name: "accessObjInfo",
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
      // {
      //   path:"test/:sourceId/:sourceName/:objId/:objName",
      //   component: () => import("@/views/dataAccess/index"),
      //   name: "test",
      //   meta: {
      //     title: "test",
      //     icon: "dashboard",
      //     noCache: true
      //   },
      //   children:[
      //     {
      //       path:"testManage/:sourceId/:sourceName",
      //       component: () => import("@/views/dataAccess/accessObjManage/index"),
      //       name: "test",
      //       meta: {
      //         title: "test",
      //         icon: "dashboard",
      //         noCache: true
      //       }
      //     }
      //   ]
      // }
    ]
  }
];

export default new Router({
  mode: "history", // require service support
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
