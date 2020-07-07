import Vue from 'vue'
import VueRouter from 'vue-router'
//import HalouCao from '@/views/HalouCao'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'HalouCao',
    // component: HalouCao
    redirect: "/login"
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
    path: '/team',
    name: 'Team',
    component: () => import("@/views/Team.vue"),
    meta: {
      title: "小组",
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
    path: '/invite',
    name: 'invite',
    component: () => import("@/views/Invite.vue"),
    meta: {
      title: "invite",
      keepAlive: true
    }

  }, {
    path: '/project',
    name: 'Project',
    component: () => import("@/views/Project.vue"),
    meta: {
      title: "测试",
      keepAlive: true
    }
  }, {
    path: '/adminLogin',
    name: 'AdminLogin',
    component: () => import("@/views/AdminLogin.vue"),
    meta: {
      title: "管理员登录",
      keepAlive: true
    }
  }, {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/Chat.vue')
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
  routes
})

export default router
