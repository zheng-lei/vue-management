import Vue from 'vue'
import VueRouter from 'vue-router'

//解决重复点击菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },{
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login')
  },{
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/Home'),
    children: [{
      path: 'users',
      name: 'Users',
      component: () => import('@/views/user/Users')
    },{
      path: 'roles',
      name: 'Roles',
      component: () => import('@/views/role/Roles')
    },{
      path: 'groups',
      name: 'Groups',
      component: () => import('@/views/group/Groups')
    },{
      path: 'projects',
      name: 'Projects',
      component: () => import('@/views/project/Projects')
    },{
      path: 'logs',
      name: 'Logs',
      children: [{
        path: 'system',
        name: 'System',
        component: () => import('@/views/log/System'),
      },{
        path: 'requests',
        name: 'Requests',
        component: () => import('@/views/log/Requests'),
      }]
    },{
      path: 'storages',
      name: 'Storages',
      component: () => import('@/views/storage/Storages')
    }]
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
