import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JourneyView from '../views/JourneyView.vue'
import PageNotFoundView from '../views/PageNotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/journey', name: 'journey', component: JourneyView },
    { path: '/:pathMatch(.*)', component: PageNotFoundView }
  ]
})

export default router
