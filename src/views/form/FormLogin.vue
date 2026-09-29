<template>
  <div class="login-page container-fluid min-vh-100 d-flex align-items-center justify-content-center py-4">
    <!-- Bootstrap Card -->
    <div class="card border-0 shadow-sm mx-auto login-card" style="max-width: 500px; width: 100%;">
      <div class="card-body p-4 p-sm-5">
        <!-- Brand Logo & Header -->
        <div class="brand-header text-center mb-4">
          <img
            :src="logoTelegram"
            alt="Telegram Logo"
            class="brand-logo mx-auto mb-3"
          />
          <h1 class="brand-title h4 fw-bold mb-0">Telegram Auto Sender</h1>
        </div>

        <!-- Login Form (Native HTML required validation enabled) -->
        <form @submit.prevent="handleLogin">
          <!-- Email Input -->
          <BaseInput
            id="identifier"
            v-model="form.identifier"
            label="EMAIL"
            placeholder="admin@telegram.autosender"
            autocomplete="username"
            required
            :has-error="hasLoginError"
            @input="onInputChange"
          >
            <template #prefix>
              <!-- Mail Icon -->
              <svg
                class="field-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </template>
          </BaseInput>

          <!-- Password Input -->
          <BaseInput
            id="password"
            v-model="form.password"
            type="password"
            label="PASSWORD"
            placeholder="••••••••••••"
            is-password
            autocomplete="current-password"
            required
            :has-error="hasLoginError"
            @input="onInputChange"
          >
            <template #prefix>
              <!-- Lock Icon -->
              <svg
                class="field-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </template>
          </BaseInput>

          <!-- Options: Bootstrap Checkbox & Forgot Password -->
          <div class="d-flex align-items-center justify-content-between my-3 flex-wrap gap-2">
            <div class="form-check d-inline-flex align-items-center mb-0">
              <input
                id="remember-device"
                v-model="form.rememberMe"
                type="checkbox"
                class="form-check-input mt-0 me-2"
              />
              <label for="remember-device" class="form-check-label user-select-none text-secondary small">
                Remember
              </label>
            </div>
            <a href="#" class="forgot-password-link text-decoration-none small" @click.prevent="handleForgotPassword">
              Forgot Password?
            </a>
          </div>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            :loading="isLoading"
            variant="primary"
            :block="true"
          >
            Sign In to Dashboard
          </BaseButton>

          <!-- Single Error Message under Submit Button -->
          <div v-if="errorMessage" class="error-message-text text-danger text-center small mt-3 fw-semibold">
            {{ errorMessage }}
          </div>

          <!-- Footer Link -->
          <div class="text-center mt-4 small">
            <span class="text-secondary">Contact Me by </span>
            <a href="#" class="signup-link text-decoration-none fw-semibold" @click.prevent="handleSignUp">
              Telegram
            </a>
            <span class="text-secondary ms-1">if you have problems</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/api/api';

import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import logoTelegram from '@/assets/images/logoTelegram.png';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  identifier: '',
  password: '',
  rememberMe: true
});

const isLoading = ref(false);
const hasLoginError = ref(false);
const errorMessage = ref('');

function onInputChange() {
  if (hasLoginError.value) {
    hasLoginError.value = false;
    errorMessage.value = '';
  }
}

async function handleLogin() {
  isLoading.value = true;
  hasLoginError.value = false;
  errorMessage.value = '';

  try {
    const response = await api.post('/auth/login', {
      identifier: form.identifier.trim(),
      password: form.password
    });

    if (response.data && response.data.data) {
      const { token, admin } = response.data.data;
      authStore.setToken(token);
      authStore.setUser(admin);

      if (form.rememberMe) {
        localStorage.setItem('remembered_identifier', form.identifier.trim());
      } else {
        localStorage.removeItem('remembered_identifier');
      }

      router.push('/dashboard');
    }
  } catch (err) {
    hasLoginError.value = true;
    if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value = 'Invalid email or password';
    }
  } finally {
    isLoading.value = false;
  }
}

function handleForgotPassword() {
  router.push('/forgot-password').catch(() => {
    console.log('Navigate to forgot password');
  });
}

function handleSignUp() {
  router.push('/register').catch(() => {
    console.log('Navigate to register');
  });
}
</script>

<style scoped>
.login-page {
  background-color: #f7f9fc;
}

.login-card {
  border-radius: 26px;
  background-color: #ffffff;
  box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03) !important;
}

@media (max-width: 576px) {
  .login-card {
    border-radius: 20px;
  }
}

/* Brand Logo */
.brand-logo {
  width: 68px;
  height: 68px;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 8px 18px rgba(36, 161, 222, 0.35));
}

.brand-title {
  color: #1e293b;
  letter-spacing: -0.2px;
}

/* Icons in Input fields */
.field-icon {
  width: 18px;
  height: 18px;
}

.forgot-password-link {
  color: #24a1de;
  transition: color 0.2s ease;
}

.forgot-password-link:hover {
  color: #1a8cc4;
  text-decoration: underline !important;
}

.signup-link {
  color: #24a1de;
  transition: color 0.2s ease;
}

.signup-link:hover {
  color: #1a8cc4;
  text-decoration: underline !important;
}

.error-message-text {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>