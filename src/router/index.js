import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/views/layout/Layout";
//import NoLeftLayout from "@/views/layout/NoLeftLayout";

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
          title: "数据接入",
          icon: "dashboard",
          noCache: true
        }
      },
      {
        path: "accessObjManage/:sourceId/:sourceName/:type",
        component: () => import("@/views/accessObjManage/index"),
        name: "accessObjManage",
        meta: {
          title: "接入源管理",
          icon: "dashboard",
          noCache: true
        }
      },
      {
        path: "accessObjInfo/:sourceId/:sourceName/:objId/:objName/:type",
        component: () => import("@/views/accessObjInfo/index"),
        name: "accessObjInfo",
        meta: {
          title: "数据对象详情",
          icon: "dashboard",
          noCache: true
        }
      },
      {
        path: "recyclingBins",
        component: () => import("@/views/recyclingBins/index"),
        name: "recyclingBins",
        meta: {
          title: "回收箱",
          icon: "dashboard",
          noCache: true
        }
      },
      {
        path: "setting",
        component: () => import("@/views/setting/index"),
        name: "setting",
        meta: {
          title: "设置",
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
      },
      {
        path: "task",
        component: () => import("@/views/task/Task"),
        name: "task",
        meta: {
          title: "汇聚任务",
          icon: "task",
          noCache: true
        }
      },
      {
        path: "kettleTask",
        component: () => import("@/views/kettleTask/kettleTask"),
        name: "kettleTask",
        meta: {
          title: "kettle任务",
          icon: "kettleTask",
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
