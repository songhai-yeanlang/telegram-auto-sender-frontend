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

        <!-- Form View (Before Success) -->
        <div v-if="!isSuccess">
          <form @submit.prevent="handleResetPassword">
            <!-- New Password Input -->
            <BaseInput
              id="newPassword"
              v-model="passwords.newPassword"
              type="password"
              label="NEW PASSWORD"
              placeholder="••••••••••••"
              is-password
              autocomplete="new-password"
              required
              :has-error="hasError"
              @input="clearError"
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

            <!-- Confirm Password Input -->
            <BaseInput
              id="confirmPassword"
              v-model="passwords.confirmPassword"
              type="password"
              label="CONFIRM NEW PASSWORD"
              placeholder="••••••••••••"
              is-password
              autocomplete="new-password"
              required
              :has-error="hasError || (passwords.confirmPassword && !passwordsMatch)"
              @input="clearError"
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

            <!-- Submit Button -->
            <BaseButton
              type="submit"
              :loading="isLoading"
              variant="primary"
              :block="true"
              class="mt-2"
              :disabled="!canSubmit"
            >
              Reset Password
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

        <!-- Success View (After Successful Reset) -->
        <div v-else class="text-center py-2">
          <!-- Clean Checkmark Icon -->
          <div class="success-icon-wrapper mx-auto mb-3 d-flex align-items-center justify-content-center">
            <svg
              class="checkmark-svg"
              viewBox="0 0 52 52"
              fill="none"
              stroke="#24a1de"
              stroke-width="3.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="26" cy="26" r="23" stroke="#24a1de" stroke-width="2" />
              <path d="M15 27l7 7 15-15" />
            </svg>
          </div>

          <h2 class="h5 fw-bold text-dark mb-2">Password Reset Successful!</h2>
          <p class="text-secondary small mb-4">
            Your password has been securely updated. You can now sign in with your new credentials.
          </p>

          <BaseButton
            type="button"
            variant="primary"
            :block="true"
            @click="goToLogin"
          >
            Sign In to Dashboard
          </BaseButton>

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
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/api';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import logoTelegram from '@/assets/images/logoTelegram.png';

const router = useRouter();

const resetToken = ref('');
const passwords = reactive({
  newPassword: '',
  confirmPassword: ''
});

const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const isSuccess = ref(false);

onMounted(() => {
  // Retrieve reset_token from sessionStorage so page refresh preserves it!
  const savedToken = sessionStorage.getItem('reset_token');
  if (!savedToken) {
    router.replace('/verify-email');
    return;
  }
  resetToken.value = savedToken;
});

const isMinLength = computed(() => {
  return passwords.newPassword.length >= 6;
});

const passwordsMatch = computed(() => {
  return (
    passwords.newPassword.length > 0 &&
    passwords.newPassword === passwords.confirmPassword
  );
});

const canSubmit = computed(() => {
  return isMinLength.value && passwordsMatch.value;
});

function clearError() {
  if (hasError.value) {
    hasError.value = false;
    errorMessage.value = '';
  }
}

async function handleResetPassword() {
  if (!canSubmit.value) return;

  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';

  try {
    const response = await api.post(
      '/auth/reset-password',
      {
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
        token: resetToken.value,
        resetToken: resetToken.value
      },
      {
        headers: {
          Authorization: `Bearer ${resetToken.value}`
        }
      }
    );

    if (response.data && response.data.success) {
      sessionStorage.removeItem('reset_token');
      sessionStorage.removeItem('reset_email');
      sessionStorage.removeItem('otp_expires_at');
      isSuccess.value = true;
    } else {
      hasError.value = true;
      errorMessage.value = response.data?.message || 'Failed to reset password.';
    }
  } catch (err) {
    hasError.value = true;
    errorMessage.value =
      err.response?.data?.message || 'Failed to reset password. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function goToLogin() {
  router.push('/login');
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

.success-icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(36, 161, 222, 0.1);
}

.checkmark-svg {
  width: 44px;
  height: 44px;
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
