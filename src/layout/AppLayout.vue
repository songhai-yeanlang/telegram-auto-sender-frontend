<template>
  <div class="app-container d-flex min-vh-100">
    <!-- Left Sidebar -->
    <aside class="sidebar d-flex flex-column flex-shrink-0" :class="{ 'sidebar-open': isMobileSidebarOpen }">
      <!-- Sidebar Brand -->
      <div class="sidebar-brand d-flex align-items-center px-4 py-4">
        <div class="brand-icon-box d-flex align-items-center justify-content-center me-3">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
        </div>
        <span class="brand-name fw-bold fs-5 text-white">TG Sender</span>
      </div>

      <!-- Sidebar Navigation Menu -->
      <nav class="sidebar-nav flex-grow-1 px-3 py-2">
        <ul class="nav flex-column gap-1">
          <!-- Contacts -->
          <li class="nav-item">
            <router-link
              to="/contacts"
              class="nav-link d-flex align-items-center"
              :class="{ active: activeRoute === 'contacts' }"
              @click="closeMobileSidebar"
            >
              <div v-if="activeRoute === 'contacts'" class="active-indicator"></div>
              <svg class="nav-icon me-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Contacts</span>
            </router-link>
          </li>

          <!-- Broadcast -->
          <li class="nav-item">
            <router-link
              to="/broadcast"
              class="nav-link d-flex align-items-center"
              :class="{ active: activeRoute === 'broadcast' }"
              @click="closeMobileSidebar"
            >
              <div v-if="activeRoute === 'broadcast'" class="active-indicator"></div>
              <svg class="nav-icon me-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Broadcast</span>
            </router-link>
          </li>

          <!-- Settings -->
          <li class="nav-item">
            <router-link
              to="/settings"
              class="nav-link d-flex align-items-center"
              :class="{ active: activeRoute === 'settings' }"
              @click="closeMobileSidebar"
            >
              <div v-if="activeRoute === 'settings'" class="active-indicator"></div>
              <svg class="nav-icon me-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Settings</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Mobile Overlay Backdrop -->
    <div
      v-if="isMobileSidebarOpen"
      class="sidebar-backdrop"
      @click="closeMobileSidebar"
    ></div>

    <!-- Main Content Area -->
    <div class="main-wrapper d-flex flex-column flex-grow-1">
      <!-- Top Header Navbar -->
      <header class="top-header bg-white d-flex align-items-center justify-content-between px-4 px-lg-5">
        <!-- Left: Mobile Menu Toggle & Breadcrumbs -->
        <div class="d-flex align-items-center">
          <button
            class="btn btn-link p-0 me-3 text-secondary d-lg-none"
            type="button"
            @click="toggleMobileSidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 align-items-center small">
              <li class="breadcrumb-item text-secondary">SaaS Console</li>
              <li class="breadcrumb-separator mx-2 text-muted">/</li>
              <li class="breadcrumb-item active text-dark fw-semibold" aria-current="page">
                {{ breadcrumbTitle }}
              </li>
            </ol>
          </nav>
        </div>

        <!-- Right: Admin Profile & Logout -->
        <div class="d-flex align-items-center">
          <!-- User Avatar & Username (Navigates to Settings) -->
          <router-link
            to="/settings"
            class="user-pill d-flex align-items-center me-3 text-decoration-none"
            title="User Profile & Settings"
          >
            <div class="avatar-badge d-flex align-items-center justify-content-center me-2">
              {{ userInitial }}
            </div>
            <span class="user-name text-dark fw-semibold small">{{ userName }}</span>
          </router-link>

          <!-- Divider -->
          <div class="header-divider me-3"></div>

          <!-- Logout Button -->
          <button
            type="button"
            class="logout-btn btn btn-link p-0 text-decoration-none d-flex align-items-center small text-secondary"
            @click="openLogoutModal"
          >
            <svg class="logout-icon me-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <!-- Page Main Content Slot -->
      <main class="page-content flex-grow-1 p-4 p-lg-5">
        <slot />
      </main>
    </div>

    <!-- ─── Logout Confirmation Modal ─── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showLogoutModal"
          class="logout-modal-overlay"
          @click.self="closeLogoutModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <Transition name="modal-slide">
            <div v-if="showLogoutModal" class="logout-modal-box">
              <!-- Modal Icon -->
              <div class="modal-icon-ring mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>

              <!-- Modal Text -->
              <h2 class="modal-title" id="logout-modal-title">Sign out of account?</h2>
              <p class="modal-subtitle">
                You will be redirected to the login page. Any unsaved changes will be lost.
              </p>

           

              <!-- Action Buttons -->
              <div class="modal-actions d-flex gap-3">
                <button
                  type="button"
                  class="modal-btn-cancel flex-grow-1"
                  @click="closeLogoutModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="modal-btn-confirm flex-grow-1"
                  @click="confirmLogout"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
  activeRoute: {
    type: String,
    default: 'contacts'
  },
  breadcrumbTitle: {
    type: String,
    default: 'Contacts'
  }
});

const router = useRouter();
const authStore = useAuthStore();
const isMobileSidebarOpen = ref(false);
const showLogoutModal = ref(false);

const userName = computed(() => {
  return authStore.user?.username || 'Admin';
});

const userEmail = computed(() => {
  return authStore.user?.email || '';
});

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase();
});

function toggleMobileSidebar() {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
}

function closeMobileSidebar() {
  isMobileSidebarOpen.value = false;
}

function openLogoutModal() {
  showLogoutModal.value = true;
}

function closeLogoutModal() {
  showLogoutModal.value = false;
}

function confirmLogout() {
  showLogoutModal.value = false;
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.app-container {
  background-color: #f8fafc;
  height: 100vh;
  overflow: hidden;  /* Prevent outer scroll */
}

/* Main wrapper scrolls, sidebar stays fixed */
.main-wrapper {
  overflow-y: auto;
  height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background-color: #0b1329;
  z-index: 1040;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-icon-box {
  width: 34px;
  height: 34px;
  background: #24a1de;
  border-radius: 9px;
  color: #ffffff;
}

.brand-icon {
  width: 22px;
  height: 22px;
}

.brand-name {
  letter-spacing: -0.2px;
}

/* Sidebar Nav Items */
.nav-link {
  position: relative;
  color: #94a3b8;
  font-size: 14.5px;
  font-weight: 500;
  padding: 10px 14px;
  border-radius: 9px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #f1f5f9;
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
  color: #ffffff;
  background-color: #1e293b;
  font-weight: 600;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3.5px;
  border-radius: 0 4px 4px 0;
  background-color: #24a1de;
}

.nav-icon {
  width: 19px;
  height: 19px;
}

/* Top Header Navbar */
.top-header {
  height: 64px;
  min-height: 64px;
  max-height: 64px;
  flex-shrink: 0;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #ffffff !important;
}

.breadcrumb-separator {
  user-select: none;
}

.user-pill {
  padding: 4px 8px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.user-pill:hover {
  background-color: #f1f5f9;
}

.avatar-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #24a1de;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(36, 161, 222, 0.3);
}

.header-divider {
  width: 1px;
  height: 20px;
  background-color: #cbd5e1;
}

.logout-icon {
  width: 16px;
  height: 16px;
}

.logout-btn:hover {
  color: #ef4444 !important;
}

/* Mobile responsive handling */
@media (max-width: 991.98px) {
  .app-container {
    height: auto;
    overflow: visible;
  }

  .main-wrapper {
    height: auto;
    overflow-y: visible;
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(15, 23, 42, 0.6);
    z-index: 1030;
    backdrop-filter: blur(2px);
  }
}

/* ─── Logout Confirmation Modal ─── */
.logout-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 19, 41, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.logout-modal-box {
  background: #ffffff;
  border-radius: 22px;
  padding: 36px 32px 28px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.18),
    0 4px 16px rgba(0, 0, 0, 0.08);
}

.modal-icon-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.08);
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.3px;
  margin-bottom: 8px;
}

.modal-subtitle {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* User session info row */
.modal-session-info {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px 16px;
  margin-bottom: 24px;
}

.modal-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #24a1de, #0284c7);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(36, 161, 222, 0.3);
}

.modal-user-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.modal-user-email {
  font-size: 12px;
  color: #64748b;
  word-break: break-all;
}

/* Action Buttons */
.modal-actions {
  margin-top: 4px;
}

.modal-btn-cancel {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn-cancel:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #0f172a;
}

.modal-btn-confirm {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-btn-confirm:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  transform: translateY(-1px);
}

/* ─── Modal Transitions ─── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.modal-slide-enter-from {
  opacity: 0;
  transform: scale(0.88) translateY(20px);
}

.modal-slide-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>
