import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TempView from '@/views/TempView.vue'
import AddTransactionView from '@/views/AddTransactionView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import checkUserExists from '@/composables/checkUserExists'
import DashboardView from '@/views/DashboardView.vue'
import UpdateTransactionView from '@/views/UpdateTransactionView.vue'
import checkTransactionExists from '@/composables/checkTransactionExists'
import ProfileView from '@/views/ProfileView.vue'


const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/temp',
    name: 'TempView',
    component: TempView
  },
  {
    path: '/:userId/addtransaction',
    name: 'AddTransactionView',
    component: AddTransactionView,
    props: true,
    beforeEnter: async(to,from,next)=>{
      const userId = to.params.userId;
      const userExists = await checkUserExists(userId);
      if(!userExists){
        next({name:'HomeView'});
      }else{
        next();
      }
    }
  },
  {
    path: '/:tidToUpdate/updateTransaction',
    name: 'UpdateTransactionView',
    component: UpdateTransactionView,
    props: true,
    beforeEnter: async(to,from,next)=>{
      const tidToUpdate = to.params.tidToUpdate;
      const transactionExists = await checkTransactionExists(tidToUpdate);
      if(!transactionExists){
        next({name:'HomeView'});
      }else{
        next();
      }
    }
  },
  {
    path: '/:userId/dashboard',
    name: 'DashboardView',
    component: DashboardView,
    props: true,
    beforeEnter: async(to,from,next)=>{
      const userId = to.params.userId;
      const userExists = await checkUserExists(userId);
      if(!userExists){
        next({name:'HomeView'});
      }else{
        next();
      }
    }
  },
  {
    path: '/:userId/profile',
    name: 'ProfleView',
    component: ProfileView,
    props: true,
    beforeEnter: async(to,from,next)=>{
      const userId = to.params.userId;
      const userExists = await checkUserExists(userId);
      if(!userExists){
        next({name:'HomeView'});
      }else{
        next();
      }
    }
  },
  {
    path: '/404',
    name: 'NotFoundView',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
