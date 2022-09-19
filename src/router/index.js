import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from "../layouts/MainLayout.vue";
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children:[
      {
        path: '/',
        name: 'home',
        component: HomeView
      },
      {
        path: 'banners',
        name: 'banners',
        component: function () {
          return import('../views/Banners.vue')
        }
      },
      {
        path: 'about',
        name: 'about',
        component: function () {
          return import('../views/AboutView.vue')
        }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
