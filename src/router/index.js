import { createRouter, createWebHistory } from 'vue-router';
import FormLogin from '@/views/form/FormLogin.vue';
import VerifyEmail from '@/views/form/VerifyEmail.vue';
import VerifyOpt from '@/views/form/VerifyOpt.vue';
import ResetPassword from '@/views/form/ResetPassword.vue';
import ContactPage from '@/views/contacts/ContactPage.vue';
import Page404 from '@/views/Page404.vue';

const routes = [
  {
    path: '/',
    redirect: '/contacts',
  },
  {
    path: '/dashboard',
    redirect: '/contacts',
  },
  {
    path: '/login',
    name: 'Login',
    component: FormLogin,
  },
  {
    path: '/forgot-password',
    redirect: '/verify-email',
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail,
  },
  {
    path: '/verify-otp',
    name: 'VerifyOpt',
    component: VerifyOpt,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: ContactPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: Page404,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/contacts');
  } else {
    next();
  }
});

export default router;
