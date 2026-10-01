import { createRouter, createWebHistory } from 'vue-router';
import FormLogin from '@/views/form/FormLogin.vue';
import ForgotPassword from '@/views/form/ForgotPassword.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: FormLogin,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
