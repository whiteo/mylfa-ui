import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store'
import {validateToken} from "@/api/util";
import {getUser} from "@/api/user";

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
    ],
  },
  {
    path: '/account',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Account',
        component: () => import('@/views/Account.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/currency',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Currency',
        component: () => import('@/views/Currency.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/category',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Category',
        component: () => import('@/views/Category.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/income',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Income',
        component: () => import('@/views/Income.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/outlay',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Outlay',
        component: () => import('@/views/Outlay.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const storedToken = localStorage.getItem('token');
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !storedToken) {
    next('/');
  } else {
    try {
      if (storedToken) {
        await validateToken(storedToken);
        await getUserData(storedToken);
      }
      if (to.path === '/' && storedToken) {
        next('/dashboard');
      }
      next();
    } catch (error) {
      store.commit('clearToken');
      next('/');
    }
  }
});

async function getUserData(token: string) {
  const accountData = await getUser(token);
  store.commit('setLogIn');
  store.commit('setAccount', accountData.email);
  store.commit('setVerified', accountData.verified);
}

export default router
