import Vue from 'vue'
import VueRouter from 'vue-router'
import AdvertisementList from '../views/AdvertisementList.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/advertisements',
    name: 'AdvertisementList',
    component: AdvertisementList
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
