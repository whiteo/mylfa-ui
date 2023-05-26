import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store'
import {validateToken} from '@/api/api';

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
        component: () => import('@/views/Currency.vue'),
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
        component: () => import('@/views/Currency.vue'),
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
        component: () => import('@/views/Currency.vue'),
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
  const isLoggedIn = store.state.isLoggedIn;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn) {
    next('/');
  } else {
    try {
      if (isLoggedIn) {
        await validateToken();
      }
      next();
    } catch (error) {
      store.commit('clearToken');
      next('/');
    }
  }
});

export default router
