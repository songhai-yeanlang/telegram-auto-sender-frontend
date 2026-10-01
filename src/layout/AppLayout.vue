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
          <!-- Contacts (Active) -->
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
          <!-- User Avatar & Username -->
          <div class="user-pill d-flex align-items-center me-3">
            <div class="avatar-badge d-flex align-items-center justify-content-center me-2">
              {{ userInitial }}
            </div>
            <span class="user-name text-dark fw-semibold small">{{ userName }}</span>
          </div>

          <!-- Divider -->
          <div class="header-divider me-3"></div>

          <!-- Logout Button -->
          <button
            type="button"
            class="logout-btn btn btn-link p-0 text-decoration-none d-flex align-items-center small text-secondary"
            @click="handleLogout"
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

const userName = computed(() => {
  return authStore.user?.username || 'Admin';
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

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.app-container {
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background-color: #0b1329;
  z-index: 1040;
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
  border-bottom: 1px solid #e2e8f0;
}

.breadcrumb-separator {
  user-select: none;
}

.avatar-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #24a1de;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
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
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
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
</style>
