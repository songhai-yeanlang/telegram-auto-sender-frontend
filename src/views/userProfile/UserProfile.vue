<template>
  <AppLayout active-route="settings" breadcrumb-title="Settings">
    <!-- Floating Toast Notification -->
    <BaseToast
      v-model="isToastVisible"
      :message="toastMessage"
      :type="toastType"
      :duration="4000"
      position="bottom-right"
    />

    <div class="settings-wrap">

      <!-- ─── FULL-WIDTH PROFILE BANNER HERO ─── -->
      <div class="profile-hero mb-5">
        <!-- Background gradient canvas -->
        <div class="hero-canvas"></div>
        <div class="hero-canvas-layer2"></div>

        <div class="hero-inner d-flex flex-column flex-md-row align-items-center align-items-md-end justify-content-between gap-4">
          <!-- Left: Avatar + Identity -->
          <div class="d-flex flex-column flex-sm-row align-items-center align-items-sm-end gap-4 text-center text-sm-start">
            <div class="hero-avatar-ring position-relative">
              <div class="hero-avatar d-flex align-items-center justify-content-center">
                {{ userInitial }}
              </div>
              <span class="hero-online-dot"></span>
            </div>
            <div class="pb-1">
              <p class="text-white-50 small mb-1 fw-medium" style="letter-spacing: .5px; font-size: 12px; text-transform: uppercase;">Administrator Account</p>
              <h1 class="hero-name text-white fw-bold mb-1">{{ userName }}</h1>
              <p class="text-white-50 small mb-0">{{ userEmail }}</p>
            </div>
          </div>

          <!-- Right: Meta Pills -->
   
        </div>
      </div>

      <!-- ─── PAGE TITLE (below hero) ─── -->
      <div class="mb-4">
        <h2 class="section-title fw-bold text-dark mb-1">Settings</h2>
        <p class="text-secondary mb-0" style="font-size: 14.5px;">Manage your account details and authentication preferences.</p>
      </div>

      <!-- ─── TWO-COLUMN BENTO GRID ─── -->
      <div class="bento-grid">



        <!-- Row 2: Change Password (wide) + Security Status (narrow) -->
        <div class="bento-row bento-row-main gap-3">

          <!-- Change Password Card (wide) -->
          <div class="bento-tile bento-tile-wide">
            <!-- Card section title -->
            <div class="d-flex align-items-center gap-2 mb-4">
              <div class="section-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h2 class="section-heading mb-0">Change Password</h2>
                <p class="section-subtext mb-0">Update your authentication credentials.</p>
              </div>
            </div>

            <form @submit.prevent="handleChangePassword">
              <!-- Current Password -->
              <div class="mb-3">
                <label class="field-label">Current Password</label>
                <div class="field-wrap" :class="{ 'field-error': hasPasswordError && passwordForm.oldPassword }">
                  <span class="field-prefix">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    :type="showOldPassword ? 'text' : 'password'"
                    class="field-input"
                    placeholder="Enter current password"
                    v-model="passwordForm.oldPassword"
                    autocomplete="current-password"
                    @input="clearPasswordError"
                  />
                  <button type="button" class="field-eye" @click="showOldPassword = !showOldPassword" tabindex="-1">
                    <svg v-if="!showOldPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                      <line x1="2" x2="22" y1="2" y2="22"/>
                    </svg>
                    <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- New + Confirm side by side -->
              <div class="row g-3 mb-3">
                <div class="col-sm-6">
                  <label class="field-label">New Password</label>
                  <div class="field-wrap">
                    <span class="field-prefix">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      :type="showNewPassword ? 'text' : 'password'"
                      class="field-input"
                      placeholder="Min. 6 characters"
                      v-model="passwordForm.newPassword"
                      autocomplete="new-password"
                      @input="clearPasswordError"
                    />
                    <button type="button" class="field-eye" @click="showNewPassword = !showNewPassword" tabindex="-1">
                      <svg v-if="!showNewPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                        <line x1="2" x2="22" y1="2" y2="22"/>
                      </svg>
                      <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="col-sm-6">
                  <label class="field-label">Confirm Password</label>
                  <div class="field-wrap" :class="{ 'field-error': passwordForm.confirmPassword && !passwordsMatch }">
                    <span class="field-prefix">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </span>
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="field-input"
                      placeholder="Repeat new password"
                      v-model="passwordForm.confirmPassword"
                      autocomplete="new-password"
                      @input="clearPasswordError"
                    />
                    <button type="button" class="field-eye" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                      <svg v-if="!showConfirmPassword" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                        <line x1="2" x2="22" y1="2" y2="22"/>
                      </svg>
                      <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Strength Bar -->
              <div v-if="passwordForm.newPassword" class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="x-small text-secondary">Password strength</span>
                  <span class="x-small fw-bold" :style="{ color: strength.color }">{{ strength.label }}</span>
                </div>
                <div class="strength-track">
                  <div class="strength-fill" :class="strength.cls" :style="{ width: strength.pct + '%' }"></div>
                </div>
              </div>

           

              <!-- Error -->
              <div v-if="errorMessage" class="error-banner mb-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ errorMessage }}
              </div>

              <!-- Submit Row -->
              <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pt-3" style="">
                <div class="d-flex align-items-center gap-2 text-secondary" style="font-size: 12.5px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Encrypted & securely stored
                </div>
                <button type="submit" class="btn-save" :disabled="!canSubmit || isUpdating">
                  <span v-if="isUpdating" class="spinner-border spinner-border-sm me-1"></span>
                  <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Update Password
                </button>
              </div>
            </form>
          </div>

          <!-- Right Stack: Security + System Tiles -->
   
        </div>

      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import api from '@/api/api';
import { useAuthStore } from '@/stores/authStore';
import AppLayout from '@/layout/AppLayout.vue';
import BaseToast from '@/components/base/BaseToast.vue';

const authStore = useAuthStore();

const userName = computed(() => authStore.user?.username || 'Yeanlang');
const userEmail = computed(() => authStore.user?.email || 'langofficial19@gmail.com');
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

const passwordForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' });
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isUpdating = ref(false);
const hasPasswordError = ref(false);
const errorMessage = ref('');
const copiedField = ref('');
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

function showToast(msg, type = 'success') {
  toastMessage.value = msg; toastType.value = type; isToastVisible.value = true;
}

async function copyToClipboard(text, field) {
  try {
    await navigator.clipboard.writeText(text);
    copiedField.value = field;
    showToast(`Copied ${field} to clipboard!`, 'success');
    setTimeout(() => { if (copiedField.value === field) copiedField.value = ''; }, 2000);
  } catch { showToast('Failed to copy', 'error'); }
}

const isMinLength = computed(() => passwordForm.newPassword.length >= 6);
const hasUpperLower = computed(() => /[A-Z]/.test(passwordForm.newPassword) && /[a-z]/.test(passwordForm.newPassword));
const passwordsMatch = computed(() => passwordForm.newPassword.length > 0 && passwordForm.newPassword === passwordForm.confirmPassword);
const canSubmit = computed(() => passwordForm.oldPassword.length > 0 && isMinLength.value && passwordsMatch.value);

const strength = computed(() => {
  const p = passwordForm.newPassword;
  if (!p) return { label: '', pct: 0, color: '#e2e8f0', cls: '' };
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) s++;
  if (s === 1) return { label: 'Weak', pct: 25, color: '#ef4444', cls: 'sfill-weak' };
  if (s === 2) return { label: 'Fair', pct: 50, color: '#f59e0b', cls: 'sfill-fair' };
  if (s === 3) return { label: 'Good', pct: 75, color: '#0ea5e9', cls: 'sfill-good' };
  return { label: 'Strong', pct: 100, color: '#10b981', cls: 'sfill-strong' };
});

function clearPasswordError() {
  if (hasPasswordError.value) { hasPasswordError.value = false; errorMessage.value = ''; }
}

async function handleChangePassword() {
  if (!canSubmit.value) return;
  isUpdating.value = true; hasPasswordError.value = false; errorMessage.value = '';
  try {
    const res = await api.post('/auth/change-password', {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });
    if (res.data?.success) {
      showToast('Password updated successfully!', 'success');
      passwordForm.oldPassword = ''; passwordForm.newPassword = ''; passwordForm.confirmPassword = '';
    } else {
      hasPasswordError.value = true;
      errorMessage.value = res.data?.message || 'Failed to update password';
    }
  } catch (err) {
    hasPasswordError.value = true;
    errorMessage.value = err.response?.data?.message || 'Incorrect current password or invalid input';
  } finally {
    isUpdating.value = false;
  }
}
</script>

<style scoped>
/* ─── Page Wrapper ─── */
.settings-wrap {
  max-width: 1100px;
  margin: 0 auto;
}

.section-title {
  font-size: 22px;
  letter-spacing: -0.4px;
  color: #0f172a;
}

.x-small { font-size: 11.5px; }

/* ─── Profile Hero Banner ─── */
.profile-hero {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
}

.hero-canvas {
  position: absolute;
  inset: 0;
  background: linear-gradient(140deg, #0b1329 0%, #0f2044 40%, #0369a1 100%);
}

.hero-canvas-layer2 {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(ellipse at 90% 10%, rgba(36, 161, 222, 0.5) 0%, transparent 55%),
    radial-gradient(ellipse at 5% 90%, rgba(99, 102, 241, 0.3) 0%, transparent 45%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  padding: 36px 40px 32px;
}

.hero-avatar-ring {
  width: 88px;
  height: 88px;
  flex-shrink: 0;
}

.hero-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #24a1de, #0284c7);
  color: #fff;
  font-size: 34px;
  font-weight: 800;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  letter-spacing: -1px;
}

.hero-online-dot {
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 3px solid #0b1329;
  border-radius: 50%;
  position: absolute;
  bottom: 3px;
  right: 3px;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
  animation: hero-pulse 2.5s infinite;
}

@keyframes hero-pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(16,185,129,0.4); }
  50% { box-shadow: 0 0 0 5px rgba(16,185,129,0.1); }
}

.hero-name {
  font-size: 26px;
  letter-spacing: -0.5px;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  padding: 5px 13px;
  font-size: 12.5px;
  font-weight: 500;
}

.hero-pill-dot {
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
  animation: hero-pulse 2s infinite;
}

/* ─── Bento Grid ─── */
.bento-grid { display: flex; flex-direction: column; }

.bento-row {
  display: flex;
  flex-wrap: wrap;
}

.bento-row-2col > * { flex: 1 1 calc(50% - 8px); min-width: 220px; }

.bento-row-main {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}

.bento-tile-wide {
  flex: 1 1 580px;
  min-width: 0;
}

.bento-tile-stack {
  flex: 1 1 280px;
  min-width: 220px;
  max-width: 340px;
}

/* ─── Base Tile ─── */
.bento-tile {
  background: #ffffff;
  border: 1.5px solid #edf2f7;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s ease;
}

.bento-tile:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

/* Accent + Dark tile variants */
.bento-tile-accent {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.bento-tile-dark {
  background: #0b1329;
  border-color: transparent;
}

/* ─── Tile internals ─── */
.tile-label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tile-value {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
  word-break: break-all;
}

.tile-icon-sm {
  width: 28px;
  height: 28px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  flex-shrink: 0;
}

.btn-inline-copy {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-inline-copy:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #334155;
}

.btn-inline-copy.copied {
  background: #ecfdf5;
  border-color: #10b981;
  color: #059669;
}

.tag-chip {
  display: inline-block;
  background: #e0f2fe;
  color: #0284c7;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 11.5px;
  font-weight: 600;
}

.tag-chip-green {
  background: #ecfdf5;
  color: #059669;
}

/* ─── Section heading ─── */
.section-icon-box {
  width: 38px;
  height: 38px;
  background: #e0f2fe;
  color: #0ea5e9;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-heading {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.section-subtext {
  font-size: 12.5px;
  color: #64748b;
}

/* ─── Custom Password Fields ─── */
.field-label {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 7px;
}

.field-wrap {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  height: 48px;
  transition: all 0.2s ease;
}

.field-wrap:focus-within {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.14);
}

.field-wrap.field-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
}

.field-prefix {
  padding: 0 10px 0 14px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.field-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #0f172a;
  padding: 0;
  outline: none;
  box-shadow: none;
  min-width: 0;
}

.field-input::placeholder { color: #94a3b8; }

.field-eye {
  background: transparent;
  border: none;
  padding: 0 14px;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.15s ease;
  flex-shrink: 0;
}

.field-eye:hover { color: #475569; }

/* ─── Strength Bar ─── */
.strength-track {
  background: #f1f5f9;
  border-radius: 10px;
  height: 5px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.35s ease;
}

.sfill-weak { background: #ef4444; }
.sfill-fair { background: #f59e0b; }
.sfill-good { background: #0ea5e9; }
.sfill-strong { background: #10b981; }

/* ─── Requirement Badges ─── */
.req-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f8fafc;
  color: #94a3b8;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 11px;
  transition: all 0.2s ease;
}

.req-ok {
  background: #ecfdf5;
  color: #059669;
  border-color: #a7f3d0;
}

/* ─── Error Banner ─── */
.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13.5px;
  font-weight: 500;
}

/* ─── Save Button ─── */
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: #ffffff;
  border: none;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 22px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
  transform: translateY(-1px);
}

.btn-save:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

/* ─── Side Cards ─── */
.accent-icon {
  width: 32px;
  height: 32px;
  background: #e0f2fe;
  color: #0ea5e9;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dark-icon {
  width: 32px;
  height: 32px;
  background: rgba(36, 161, 222, 0.15);
  color: #38bdf8;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.live-dot {
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}

/* ─── Responsive ─── */
@media (max-width: 767px) {
  .hero-inner { padding: 24px 20px 20px; }
  .hero-avatar, .hero-avatar-ring { width: 68px; height: 68px; font-size: 26px; }
  .hero-online-dot { width: 13px; height: 13px; }
  .bento-tile-stack { max-width: 100%; }
  .bento-row-main { flex-direction: column; }
}
</style>
