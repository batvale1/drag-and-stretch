import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "@/pages/Home";
import Cards from "@/pages/Cards";
import WebSockets from "@/pages/WebSockets";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/websockets',
    name: 'WebSockets',
    component: WebSockets,
  },
  {
    path: '/cards',
    name: 'Cards',
    component: Cards,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
