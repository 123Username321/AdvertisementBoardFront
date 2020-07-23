import Vue from 'vue'
import VueRouter from 'vue-router'
import AdvertisementRoot from '../views/AdvertisementRoot.vue'
import AdvertisementList from '../views/AdvertisementList.vue'
import Advertisement from '../views/Advertisement.vue'

export const RouteName = {
  ADVERTISEMENT_LIST: 'advertisementList',
  ADVERTISEMENT: 'advertisement'
}

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: { name: RouteName.ADVERTISEMENT_LIST }
  },
  {
    path: '/advertisements',
    component: AdvertisementRoot,
    children: [
      {
        path: '',
        redirect: { name: RouteName.ADVERTISEMENT_LIST }
      },
      {
        path: 'list',
        name: RouteName.ADVERTISEMENT_LIST,
        component: AdvertisementList
      },
      {
        path: ':id',
        name: RouteName.ADVERTISEMENT,
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
