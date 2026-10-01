<template>
  <div class="page-404-container container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5">
    <div class="card border-0 shadow-sm mx-auto error-card text-center" style="max-width: 520px; width: 100%;">
      <div class="card-body p-4 p-sm-5">
        
        <!-- Brand Logo -->
        <div class="brand-header mb-3">
          <img
            :src="logoTelegram"
            alt="Telegram Logo"
            class="brand-logo mx-auto mb-2"
          />
          <span class="brand-title fw-bold text-dark fs-6">Telegram Auto Sender</span>
        </div>

        <!-- 404 Large Gradient Number -->
        <div class="error-code-wrapper my-2">
          <h1 class="error-code display-1 fw-bolder mb-0">404</h1>
        </div>

        <!-- Error Heading & Description -->
        <h2 class="error-title h4 fw-bold text-dark mb-2">Page Not Found</h2>
        <p class="error-desc text-secondary small mb-4">
          Oops! The page you are looking for doesn't exist, has been removed, or the link might be broken.
        </p>

        <!-- Action Buttons -->
        <div class="d-flex flex-column flex-sm-row justify-content-center gap-2 mb-4">
          <!-- Back to Previous Page -->
          <button
            type="button"
            class="btn btn-outline-secondary d-inline-flex align-items-center justify-content-center fw-semibold px-4 py-2 action-btn"
            @click="goBack"
          >
            <svg class="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Go Back
          </button>

          <!-- Back to Dashboard / Login -->
          <button
            type="button"
            class="btn btn-primary d-inline-flex align-items-center justify-content-center fw-semibold px-4 py-2 action-btn primary-btn"
            @click="goHome"
          >
            <svg class="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {{ isAuthenticated ? 'Go to Dashboard' : 'Back to Sign In' }}
          </button>
        </div>

        <!-- Footer Contact Link -->
        <div class="pt-3 border-top text-center small text-secondary">
          <span>Need help? Contact Me by </span>
          <a
            href="https://t.me/songhai_yeanlang"
            target="_blank"
            rel="noopener noreferrer"
            class="support-link text-decoration-none fw-semibold"
          >
            Telegram
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import logoTelegram from '@/assets/images/logoTelegram.png';

const router = useRouter();

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token');
});

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    goHome();
  }
}

function goHome() {
  if (isAuthenticated.value) {
    router.push('/contacts');
  } else {
    router.push('/login');
  }
}
</script>

<style scoped>
.page-404-container {
  background-color: #f7f9fc;
}

.error-card {
  border-radius: 26px;
  background-color: #ffffff;
  box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03) !important;
  animation: cardFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 576px) {
  .error-card {
    border-radius: 20px;
  }
}

/* Brand Logo */
.brand-logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 8px 16px rgba(36, 161, 222, 0.35));
}

.brand-title {
  letter-spacing: -0.2px;
}

/* 404 Large Gradient Text */
.error-code {
  font-size: 88px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -3px;
  background: linear-gradient(135deg, #24a1de 0%, #0284c7 60%, #0369a1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  user-select: none;
}

@media (max-width: 576px) {
  .error-code {
    font-size: 72px;
  }
}

.error-title {
  letter-spacing: -0.3px;
}

.error-desc {
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

/* Action Buttons */
.action-btn {
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14.5px;
  transition: all 0.2s ease;
}

.primary-btn {
  background-color: #24a1de;
  border-color: #24a1de;
  box-shadow: 0 4px 14px rgba(36, 161, 222, 0.25);
}

.primary-btn:hover {
  background-color: #1a8cc4;
  border-color: #1a8cc4;
  box-shadow: 0 6px 18px rgba(36, 161, 222, 0.35);
  transform: translateY(-1px);
}

/* Support Link */
.support-link {
  color: #24a1de;
  transition: color 0.2s ease;
}

.support-link:hover {
  color: #1a8cc4;
  text-decoration: underline !important;
}
</style>
