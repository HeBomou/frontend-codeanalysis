import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
        path: '/login',
        name: 'Login', 
        component: () => import("@/views/login.vue"),
        meta:{
            title:"登陆",
            keepAlive: true
        }
    }, {
      path: '/404',
      name: 'faid',
      component: () => import('@/views/404.vue'),
      meta:{
          title:"404",
          keepAlive: true
      }
    }, {
      path: '*',
      redirect: "/404"
    }
  ]
})
