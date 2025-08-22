import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue'),
    },
    {
      path: '/new-test',
      name: 'new-test',
      component: () => import('../views/NewTestView.vue'),
    },
    {
      path: '/product-input',
      name: 'product-input',
      component: () => import('../views/ProductInput.vue'),
    },
    {
      path: '/business-payment/:id',
      name: 'business-payment',
      component: () => import('../views/BusinessPayment.vue'),
    },
    {
      path: '/business-transactions',
      name: 'business-transactions',
      component: () => import('../views/BusinessTransactions.vue'),
    },

  ],
})

export default router
