import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
import Login from 'components/context/Login'
import Home from 'views/home/Home'
import Welcome from 'views/home/childComponents/Welcome'
import User from 'components/context/user/User'
import Rights from 'components/context/rights/Rights'
import Roles from 'components/context/rights/Roles'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}



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
      component: Home,
      children: [{
          path: '',
          redirect: '/welcome'
        },
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        }
      ]
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