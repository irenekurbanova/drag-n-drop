import { createRouter, createWebHistory } from 'vue-router'
import GamePage from '../views/GamePage.vue'
import WinPage from '../views/WinPage.vue'

const routes = [
  { path: '/', component: GamePage },
  { path: '/win', component: WinPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
