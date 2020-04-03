import Vue from 'vue'
import VueRouter from 'vue-router'
import HalouCao from '@/views/HalouCao'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HalouCao',
    component: HalouCao
  }, {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/login.vue"),
    meta: {
      title: "登陆",
      keepAlive: true
    }
  }, {
    path: '/dependency',
    name: 'MainPage',
    component: () => import("@/views/MainPage.vue"),
    meta: {
      title: "登陆",
      keepAlive: true
    }

  }, {
    path: '/admin',
    name: 'Admin',
    component: () => import("@/views/Admin.vue"),
    meta: {
      title: "管理员",
      keepAlive: true
    }

  }, {
    path: '/try',
    name: 'Try',
    component: () => import("@/views/try.vue"),
    meta: {
      title: "测试",
      keepAlive: true
    }

  }, {
    path: '/404',
    name: 'faid',
    component: () => import('@/views/404.vue'),
    meta: {
      title: "404",
      keepAlive: true
    }
  }, {
    path: '*',
    redirect: "/404"
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
