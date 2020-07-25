import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入login 组件
import Login from 'components/context/Login'
import Home from 'views/Home'

Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  routes: [{
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }


  ]
})

// 导出之前，先设置一下路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenString = window.sessionStorage.getItem('token')
  if (!tokenString) return next('/login');
  next()
})

export default router