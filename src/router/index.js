import Vue from 'vue'
import VueRouter from 'vue-router'
import AdvertisementList from '../views/AdvertisementList.vue'
import Advertisement from '../views/Advertisement.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: { name: 'AdvertisementList' }
  },
  {
    path: '/advertisements',
    name: 'AdvertisementList',
    component: AdvertisementList,
    children: [
      {
        path: ':id',
        component: Advertisement
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
