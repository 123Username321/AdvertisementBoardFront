import Vue from 'vue'
import VueRouter from 'vue-router'
import AdvertisementRoot from '../views/AdvertisementRoot.vue'
import AdvertisementList from '../views/AdvertisementList.vue'
import Advertisement from '../views/Advertisement.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: { name: 'advertisements' }
  },
  {
    path: '/advertisements',
    component: AdvertisementRoot,
    children: [
      {
        path: '',
        name: 'advertisements',
        redirect: { name: 'advertisementList' }
      },
      {
        path: 'list',
        name: 'advertisementList',
        component: AdvertisementList
      },
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
