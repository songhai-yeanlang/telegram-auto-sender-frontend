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

        <!-- Form -->
        <form @submit.prevent="handleSendOtp">
          <!-- Email Input -->
          <BaseInput
            id="email"
            v-model="email"
            type="email"
            label="EMAIL"
            placeholder="admin@telegram.autosender"
            autocomplete="email"
            required
            :has-error="hasError"
            @input="clearError"
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

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            :loading="isLoading"
            variant="primary"
            :block="true"
            class="mt-2"
          >
            Send Verification Code
          </BaseButton>

          <!-- Single Error Message -->
          <div v-if="errorMessage" class="error-message-text text-danger text-center small mt-3 fw-semibold">
            {{ errorMessage }}
          </div>

          <!-- Back to Sign In Link -->
          <div class="text-center mt-3">
            <router-link
              to="/login"
              class="forgot-password-link text-decoration-none small"
            >
              Back to Sign In
            </router-link>
          </div>

          <!-- Footer Link -->
          <div class="text-center mt-4 small">
            <span class="text-secondary">Contact Me by </span>
            <a
              href="https://t.me/songhai_yeanlang"
              target="_blank"
              rel="noopener noreferrer"
              class="signup-link text-decoration-none fw-semibold"
            >
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/api';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import logoTelegram from '@/assets/images/logoTelegram.png';

const router = useRouter();

const email = ref(sessionStorage.getItem('reset_email') || '');
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');

function clearError() {
  if (hasError.value) {
    hasError.value = false;
    errorMessage.value = '';
  }
}

async function handleSendOtp() {
  if (!email.value) return;

  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';

  try {
    const trimmedEmail = email.value.trim();
    const response = await api.post('/auth/forgot-password', {
      email: trimmedEmail
    });

    if (response.data && response.data.success) {
      sessionStorage.setItem('reset_email', trimmedEmail);
      sessionStorage.setItem('otp_expires_at', (Date.now() + 60 * 1000).toString());
      router.push('/verify-otp');
    } else {
      hasError.value = true;
      errorMessage.value = response.data?.message || 'Failed to send verification code.';
    }
  } catch (err) {
    hasError.value = true;
    errorMessage.value =
      err.response?.data?.message || 'An error occurred. Please check your email and try again.';
  } finally {
    isLoading.value = false;
  }
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
