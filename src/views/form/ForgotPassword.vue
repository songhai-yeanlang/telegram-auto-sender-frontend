<template>
  <div class="forgot-page container-fluid min-vh-100 d-flex align-items-center justify-content-center py-4">
    <!-- Main Card Container -->
    <div class="card border-0 shadow-sm mx-auto forgot-card" style="max-width: 500px; width: 100%;">
      <div class="card-body p-4 p-sm-5">

        <!-- Brand Logo & Header -->
        <div class="brand-header text-center mb-4">
          <img
            :src="logoTelegram"
            alt="Telegram Logo"
            class="brand-logo mx-auto mb-3"
          />
          <h1 class="brand-title h4 fw-bold mb-1">Telegram Auto Sender</h1>
          <p class="text-secondary small mb-0">{{ headerSubtitle }}</p>
        </div>

        <!-- ==============================================
             STEP 1: Request Reset Code (Email Form)
             ============================================== -->
        <div v-if="currentStep === 1">
          <form @submit.prevent="handleSendOtp">
            <BaseInput
              id="email"
              v-model="email"
              type="email"
              label="REGISTERED EMAIL"
              placeholder="admin@telegram.autosender"
              autocomplete="email"
              required
              :has-error="hasError"
              @input="clearError"
            >
              <template #prefix>
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

            <BaseButton
              type="submit"
              :loading="isLoading"
              variant="primary"
              :block="true"
              class="mt-2"
            >
              Send Reset Code
            </BaseButton>

            <!-- Error Message -->
            <div v-if="errorMessage" class="error-message-text text-danger text-center small mt-3 fw-semibold">
              {{ errorMessage }}
            </div>

            <!-- Back to Sign In -->
            <div class="text-center mt-4">
              <router-link
                to="/login"
                class="back-link d-inline-flex align-items-center small fw-semibold text-decoration-none"
              >
                <svg
                  class="me-1"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Sign In
              </router-link>
            </div>
          </form>
        </div>

        <!-- ==============================================
             STEP 2: Enter & Verify 6-digit OTP
             ============================================== -->
        <div v-else-if="currentStep === 2">
          <p class="text-center text-secondary small mb-3">
            Enter the 6-digit code sent to <strong class="text-dark">{{ email }}</strong>
          </p>

          <form @submit.prevent="handleVerifyOtp">
            <!-- 6-digit OTP Inputs -->
            <div class="otp-inputs-wrapper d-flex justify-content-between gap-2 mb-3">
              <input
                v-for="(digit, index) in otpDigits"
                :key="index"
                :id="`otp-digit-${index}`"
                v-model="otpDigits[index]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="form-control text-center otp-box fw-bold fs-5 shadow-none"
                :class="{ 'is-invalid-border': hasError, 'filled': digit }"
                @input="onOtpInput(index, $event)"
                @keydown="onOtpKeydown(index, $event)"
                @paste="onOtpPaste($event)"
              />
            </div>

            <!-- Resend Code & Change Email Row -->
            <div class="d-flex justify-content-between align-items-center mb-4 small">
              <button
                type="button"
                class="btn btn-link p-0 small text-decoration-none action-link"
                @click="goToStep(1)"
              >
                Change Email
              </button>

              <button
                type="button"
                class="btn btn-link p-0 small text-decoration-none action-link fw-semibold"
                :disabled="countdown > 0 || isResending"
                @click="handleResendOtp"
              >
                <span v-if="isResending" class="spinner-border spinner-border-sm me-1"></span>
                <span v-if="countdown > 0">Resend in {{ countdown }}s</span>
                <span v-else>Resend Code</span>
              </button>
            </div>

            <BaseButton
              type="submit"
              :loading="isLoading"
              variant="primary"
              :block="true"
              :disabled="!isOtpComplete"
            >
              Verify Code
            </BaseButton>

            <!-- Success notification for Resend -->
            <div v-if="resendSuccessMessage" class="text-success text-center small mt-3 fw-semibold">
              {{ resendSuccessMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="error-message-text text-danger text-center small mt-3 fw-semibold">
              {{ errorMessage }}
            </div>
          </form>
        </div>

        <!-- ==============================================
             STEP 3: Set New Password
             ============================================== -->
        <div v-else-if="currentStep === 3">
          <form @submit.prevent="handleResetPassword">
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
                <svg
                  class="field-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </template>
            </BaseInput>

            <BaseButton
              type="submit"
              :loading="isLoading"
              variant="primary"
              :block="true"
              class="mt-2"
              :disabled="!canSubmitNewPassword"
            >
              Reset Password
            </BaseButton>

            <!-- Error Message -->
            <div v-if="errorMessage" class="error-message-text text-danger text-center small mt-3 fw-semibold">
              {{ errorMessage }}
            </div>
          </form>
        </div>

        <!-- ==============================================
             STEP 4: Success Screen
             ============================================== -->
        <div v-else-if="currentStep === 4" class="text-center py-2">
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
        </div>

        <!-- Footer Contact Link -->
        <div class="text-center mt-4 small">
          <span class="text-secondary">Contact Me by </span>
          <a
            href="https://t.me/songhai_yeanlang"
            target="_blank"
            rel="noopener noreferrer"
            class="action-link text-decoration-none fw-semibold"
          >
            Telegram
          </a>
          <span class="text-secondary ms-1">if you have problems</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/api';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import logoTelegram from '@/assets/images/logoTelegram.png';

const router = useRouter();

// Wizard Step: 1 (Email), 2 (OTP), 3 (New Password), 4 (Success)
const currentStep = ref(1);

// Step 1: Email
const email = ref('');

// Step 2: OTP
const otpDigits = reactive(['', '', '', '', '', '']);
const resetToken = ref('');
const countdown = ref(0);
let timer = null;
const isResending = ref(false);
const resendSuccessMessage = ref('');

// Step 3: New Password
const passwords = reactive({
  newPassword: '',
  confirmPassword: ''
});

// UI states
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');

// Subtitle in Header based on current step
const headerSubtitle = computed(() => {
  switch (currentStep.value) {
    case 1:
      return 'Reset your password';
    case 2:
      return 'Verify code';
    case 3:
      return 'Create new password';
    case 4:
      return 'All done';
    default:
      return 'Reset your password';
  }
});

// Validation computed properties
const isOtpComplete = computed(() => {
  return otpDigits.every((d) => d && d.trim().length === 1);
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

const canSubmitNewPassword = computed(() => {
  return isMinLength.value && passwordsMatch.value;
});

function goToStep(step) {
  currentStep.value = step;
  clearError();
}

function clearError() {
  hasError.value = false;
  errorMessage.value = '';
}

// ─────────────────────────────────────────────────────────────
// Step 1: Send OTP to Email
// ─────────────────────────────────────────────────────────────
async function handleSendOtp() {
  if (!email.value) return;

  isLoading.value = true;
  clearError();

  try {
    const response = await api.post('/auth/forgot-password', {
      email: email.value.trim()
    });

    if (response.data && response.data.success) {
      currentStep.value = 2;
      startCountdown(60);
      nextTick(() => {
        focusOtpBox(0);
      });
    } else {
      errorMessage.value = response.data?.message || 'Failed to send OTP code.';
    }
  } catch (err) {
    hasError.value = true;
    errorMessage.value =
      err.response?.data?.message || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// Step 2: OTP Handlers
// ─────────────────────────────────────────────────────────────
function focusOtpBox(index) {
  const el = document.getElementById(`otp-digit-${index}`);
  if (el) el.focus();
}

function onOtpInput(index, event) {
  clearError();
  const value = event.target.value.replace(/[^0-9]/g, '');
  otpDigits[index] = value ? value.slice(-1) : '';

  if (value && index < 5) {
    focusOtpBox(index + 1);
  }
}

function onOtpKeydown(index, event) {
  if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
    focusOtpBox(index - 1);
  }
}

function onOtpPaste(event) {
  event.preventDefault();
  clearError();
  const pasteData = (event.clipboardData || window.clipboardData)
    .getData('text')
    .replace(/[^0-9]/g, '')
    .slice(0, 6);

  if (!pasteData) return;

  for (let i = 0; i < 6; i++) {
    otpDigits[i] = pasteData[i] || '';
  }

  const nextFocusIndex = Math.min(pasteData.length, 5);
  focusOtpBox(nextFocusIndex);
}

function startCountdown(seconds) {
  clearInterval(timer);
  countdown.value = seconds;
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
}

async function handleResendOtp() {
  if (countdown.value > 0 || isResending.value) return;

  isResending.value = true;
  resendSuccessMessage.value = '';
  clearError();

  try {
    await api.post('/auth/forgot-password', {
      email: email.value.trim()
    });
    resendSuccessMessage.value = 'New code sent to your email!';
    startCountdown(60);
    setTimeout(() => {
      resendSuccessMessage.value = '';
    }, 4000);
  } catch (err) {
    hasError.value = true;
    errorMessage.value =
      err.response?.data?.message || 'Failed to resend code.';
  } finally {
    isResending.value = false;
  }
}

async function handleVerifyOtp() {
  const otp = otpDigits.join('');
  if (otp.length !== 6) return;

  isLoading.value = true;
  clearError();

  try {
    const response = await api.post('/auth/verify-otp', {
      email: email.value.trim(),
      otp: otp
    });

    if (response.data && response.data.resetToken) {
      resetToken.value = response.data.resetToken;
      currentStep.value = 3;
    } else {
      errorMessage.value = response.data?.message || 'Failed to verify code.';
    }
  } catch (err) {
    hasError.value = true;
    errorMessage.value =
      err.response?.data?.message || 'Invalid or expired OTP code.';
  } finally {
    isLoading.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// Step 3: Reset Password
// ─────────────────────────────────────────────────────────────
async function handleResetPassword() {
  if (!canSubmitNewPassword.value) return;

  isLoading.value = true;
  clearError();

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
      currentStep.value = 4;
    } else {
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

// ─────────────────────────────────────────────────────────────
// Step 4: Back to Login
// ─────────────────────────────────────────────────────────────
function goToLogin() {
  router.push('/login');
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.forgot-page {
  background-color: #f7f9fc;
}

.forgot-card {
  border-radius: 26px;
  background-color: #ffffff;
  box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03) !important;
}

@media (max-width: 576px) {
  .forgot-card {
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

/* Field Icons */
.field-icon {
  width: 18px;
  height: 18px;
}

/* OTP Boxes */
.otp-box {
  height: 52px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background-color: #f8fafc;
  color: #0f172a;
  transition: all 0.2s ease;
}

.otp-box:focus {
  border-color: #24a1de;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(36, 161, 222, 0.15) !important;
}

.otp-box.filled {
  border-color: #cbd5e1;
  background-color: #ffffff;
}

.otp-box.is-invalid-border {
  border-color: #ef4444 !important;
  background-color: #fef2f2;
}

/* Action & Back Links */
.action-link,
.back-link {
  color: #24a1de;
  transition: color 0.2s ease;
}

.action-link:hover,
.back-link:hover {
  color: #1a8cc4;
  text-decoration: underline !important;
}

.action-link:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

/* Success Checkmark */
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