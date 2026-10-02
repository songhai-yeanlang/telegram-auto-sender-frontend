<template>
  x<div class="login-page container-fluid min-vh-100 d-flex align-items-center justify-content-center py-4">
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

        <!-- Subtitle Information -->
        <div class="text-center text-secondary small mb-4">
          Enter the 6-digit code sent to <span class="fw-semibold text-dark">{{ email }}</span>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleVerifyOtp">
          <!-- OTP Boxes -->
          <div class="d-flex justify-content-between gap-2 mb-3">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :id="`otp-digit-${index}`"
              v-model="otpDigits[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="form-control text-center otp-box fw-bold shadow-none"
              :class="{ 'is-invalid-border': hasError, 'filled': digit }"
              @input="onOtpInput(index, $event)"
              @keydown="onOtpKeydown(index, $event)"
              @paste="onOtpPaste($event)"
            />
          </div>

          <!-- Options Row: Change Email & Resend Code -->
          <div class="d-flex align-items-center justify-content-between my-3 flex-wrap gap-2">
            <button
              type="button"
              class="btn btn-link p-0 small text-decoration-none forgot-password-link"
              @click="handleChangeEmail"
            >
              Change Email
            </button>

            <button
              type="button"
              class="btn btn-link p-0 small text-decoration-none forgot-password-link fw-semibold"
              :disabled="countdown > 0 || isResending"
              @click="handleResendOtp"
            >
              <span v-if="isResending" class="spinner-border spinner-border-sm me-1"></span>
              <span v-if="countdown > 0">Resend ({{ countdown }}s)</span>
              <span v-else>Resend Code</span>
            </button>
          </div>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            :loading="isLoading"
            variant="primary"
            :block="true"
            :disabled="!isOtpComplete"
          >
            Verify Code
          </BaseButton>

          <!-- Resend Success Notification -->
          <div v-if="resendSuccessMessage" class="text-success text-center small mt-3 fw-semibold">
            {{ resendSuccessMessage }}
          </div>

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
            <span class="text-secondary">Need help? Contact Me by </span>
            <a
              href="https://t.me/songhai_yeanlang"
              target="_blank"
              rel="noopener noreferrer"
              class="signup-link text-decoration-none fw-semibold"
            >
              Telegram
            </a>
            
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/api';
import BaseButton from '@/components/base/BaseButton.vue';
import logoTelegram from '@/assets/images/logoTelegram.png';

const router = useRouter();

const email = ref('');
const otpDigits = reactive(['', '', '', '', '', '']);
const countdown = ref(0);
let timer = null;

const isLoading = ref(false);
const isResending = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const resendSuccessMessage = ref('');

const isOtpComplete = computed(() => {
  return otpDigits.every((d) => d && d.trim().length === 1);
});

function updateRemaining() {
  const expiresAt = parseInt(sessionStorage.getItem('otp_expires_at') || '0', 10);
  const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
  countdown.value = remaining;

  if (remaining <= 0) {
    if (timer) clearInterval(timer);
    timer = null;
    sessionStorage.removeItem('otp_expires_at');
  }
}

function startCountdown(seconds) {
  if (timer) clearInterval(timer);
  const expiresAt = Date.now() + seconds * 1000;
  sessionStorage.setItem('otp_expires_at', expiresAt.toString());
  updateRemaining();
  timer = setInterval(updateRemaining, 1000);
}

function initCountdown() {
  const savedExpiresAt = sessionStorage.getItem('otp_expires_at');
  if (savedExpiresAt) {
    const remaining = Math.ceil((parseInt(savedExpiresAt, 10) - Date.now()) / 1000);
    if (remaining > 0) {
      updateRemaining();
      timer = setInterval(updateRemaining, 1000);
      return;
    }
  }
  startCountdown(60);
}

onMounted(() => {
  const savedEmail = sessionStorage.getItem('reset_email');
  if (!savedEmail) {
    router.replace('/verify-email');
    return;
  }
  email.value = savedEmail;
  initCountdown();
  nextTick(() => {
    focusOtpBox(0);
  });
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function clearError() {
  if (hasError.value) {
    hasError.value = false;
    errorMessage.value = '';
  }
}

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

async function handleResendOtp() {
  if (countdown.value > 0 || isResending.value) return;

  isResending.value = true;
  resendSuccessMessage.value = '';
  clearError();

  try {
    await api.post('/auth/forgot-password', {
      email: email.value.trim()
    });
    resendSuccessMessage.value = 'A new 6-digit code has been sent!';
    startCountdown(60);
    setTimeout(() => {
      resendSuccessMessage.value = '';
    }, 4000);
  } catch (err) {
    hasError.value = true;
    errorMessage.value =
      err.response?.data?.message || 'Failed to resend code. Please try again.';
  } finally {
    isResending.value = false;
  }
}

async function handleVerifyOtp() {
  const otp = otpDigits.join('');
  if (otp.length !== 6) return;

  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';

  try {
    const response = await api.post('/auth/verify-otp', {
      email: email.value.trim(),
      otp: otp
    });

    if (response.data && response.data.resetToken) {
      sessionStorage.removeItem('otp_expires_at');
      sessionStorage.setItem('reset_token', response.data.resetToken);
      router.push('/reset-password');
    } else {
      hasError.value = true;
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

function handleChangeEmail() {
  sessionStorage.removeItem('otp_expires_at');
  router.push('/verify-email');
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

/* OTP Boxes matching BaseInput style */
.otp-box {
  height: 52px;
  font-size: 1.25rem;
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

.forgot-password-link {
  color: #24a1de;
  transition: color 0.2s ease;
}

.forgot-password-link:hover {
  color: #1a8cc4;
  text-decoration: underline !important;
}

.forgot-password-link:disabled {
  color: #94a3b8;
  cursor: not-allowed;
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
