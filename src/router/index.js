import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },{
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login'),
  },{
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/Home')
  }
]

const router = new VueRouter({
  routes
})
//全局前置守卫
router.beforeEach((to, from, next) => {
  let token = window.sessionStorage.getItem("access_token");
  if(to.name === 'Login' || token) {
    next();
  }else {
    next({
      name: 'login',
      query: {
        redirect: to.path
      }
    });
  }
})

export default router
