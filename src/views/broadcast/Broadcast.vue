<template>
  <AppLayout active-route="broadcast" breadcrumb-title="Broadcast">
    <!-- Page Header & Action Info -->
    <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="page-title h3 fw-bold text-dark mb-1">Broadcast</h1>
        <p class="text-secondary small mb-0">
          Compose and dispatch auto-messages to targeted contacts with safe delay protection.
        </p>
      </div>


    </div>

    <!-- Floating Toast Notification -->
    <BaseToast v-model="isToastVisible" :message="toastMessage" :type="toastType" :duration="4000"
      position="bottom-right" />

    <!-- Main Content Grid -->
    <div class="row g-4">
      <!-- Left Column: Message Composer & Live Preview -->
      <div class="col-lg-7 col-xl-7 d-flex flex-column gap-4">
        <!-- Card 1: Compose Message -->
        <div class="card border-0 shadow-sm composer-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <label for="broadcastMessage" class="form-label fw-bold text-uppercase small text-secondary mb-0">
                MESSAGE CONTENT
              </label>
              <span class="text-muted small">
                {{ messageText.length }} characters
              </span>
            </div>

            <!-- Image Upload -->
            <div class="mb-3">
            
              <div class="position-relative">
                <input type="file" id="imageUploadInput" 
                  class="form-control file-input-clean shadow-none" 
                  :class="{'pe-5': imagePreview}"
                  accept="image/jpeg, image/png, image/webp, image/gif" 
                  @change="handleImageUpload" />
                
                <button v-if="imagePreview" type="button"
                  class="btn btn-sm text-danger position-absolute p-0 d-flex align-items-center justify-content-center" 
                  style="top: 50%; right: 8px; transform: translateY(-50%); z-index: 5; border-radius: 50%; width: 24px; height: 24px; background-color: #fee2e2; border: 1px solid #fca5a5; transition: all 0.2s;"
                  @mouseover="$event.currentTarget.style.backgroundColor='#fecaca'"
                  @mouseout="$event.currentTarget.style.backgroundColor='#fee2e2'"
                  @click="clearImage" title="Remove Image">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Message Textarea -->
            <div class="textarea-wrapper mb-3">
              <textarea id="broadcastMessage" v-model="messageText" rows="7"
                class="form-control message-textarea shadow-none"
                placeholder="Type your broadcast message here... E.g. Hello! We have an exciting special update for you today."
                required></textarea>
            </div>

            <!-- Quick Template Insert Tags -->
            <div class="d-flex align-items-center flex-wrap gap-2 mb-4">


              <button type="button" class="btn btn-sm btn-link text-decoration-none small text-danger ms-auto p-0"
                :disabled="!messageText && !imageFile" @click="messageText = ''; clearImage()">
                Clear all
              </button>
            </div>



            <!-- Start Broadcast Action Button -->
            <button type="button"
              class="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center fw-semibold send-btn"
              :disabled="!canSendBroadcast || isSending" @click="openConfirmModal">
              <span v-if="isSending" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <svg v-else class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>
                {{ isSending ? 'Broadcasting...' : `Send to ${selectedContactIds.length} Selected
                Contact${selectedContactIds.length === 1 ? '' : 's'}` }}
              </span>
            </button>
          </div>
        </div>

        <!-- Card 2: Live Telegram Message Preview -->
        <div class="card border-0 shadow-sm preview-card">
          <div class="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between">
            <span class="small fw-bold text-uppercase text-secondary">TELEGRAM PREVIEW</span>
            <span class="badge bg-light text-secondary rounded-pill small">Client View</span>
          </div>
          <div class="card-body p-4 pt-2">
            <!-- Simulated Telegram Chat Canvas -->
            <div class="telegram-chat-canvas p-4 rounded-4 d-flex flex-column justify-content-end">
              <div class="telegram-bubble align-self-end text-white shadow-sm p-3 rounded-4">
                <div class="bubble-sender fw-semibold small text-white-50 mb-1">Your Account</div>
                <div class="bubble-text" style="white-space: pre-wrap; word-break: break-word;">
                  <img v-if="imagePreview" :src="imagePreview" class="img-fluid rounded mb-2"
                    style="max-height: 250px; width: 100%; object-fit: cover;" alt="Image preview" />
                  {{ messageText || 'Your message preview will appear here in real time...' }}
                </div>
                <div class="bubble-meta d-flex align-items-center justify-content-end gap-1 mt-1">
                  <span class="bubble-time small text-white-50">{{ currentTime }}</span>
                  <!-- Telegram double checkmarks -->
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round" class="text-white-50">
                    <polyline points="18 6 7 17 2 12" />
                    <polyline points="22 10 15 17 12 14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Target Contact Selection -->
      <div class="col-lg-5 col-xl-5">
        <div class="card border-0 shadow-sm target-card d-flex flex-column h-100">
          <div class="card-header bg-white border-bottom p-4 pb-3">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <h5 class="fw-bold text-dark mb-0 fs-6">Select Recipients</h5>
              <span
                class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1 small fw-semibold">
                {{ selectedContactIds.length }} / {{ filteredContacts.length }} Selected
              </span>
            </div>

            <!-- Search Field -->
            <div class="search-input-box mb-3">
              <input v-model="searchQuery" type="text" class="form-control form-control-sm search-input"
                placeholder="Search by name or chat ID..." />
            </div>

            <!-- Filter Pills Row -->
            <div class="d-flex align-items-center gap-1 flex-wrap">
              <button type="button" class="btn btn-filter btn-sm rounded-pill px-3 py-1"
                :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'">
                All ({{ contacts.length }})
              </button>
              <button type="button" class="btn btn-filter btn-sm rounded-pill px-3 py-1"
                :class="{ active: statusFilter === 'pending' }" @click="statusFilter = 'pending'">
                Pending ({{ countByStatus('pending') }})
              </button>
              <button type="button" class="btn btn-filter btn-sm rounded-pill px-3 py-1"
                :class="{ active: statusFilter === 'failed' }" @click="statusFilter = 'failed'">
                Failed ({{ countByStatus('failed') }})
              </button>
              <button type="button" class="btn btn-filter btn-sm rounded-pill px-3 py-1"
                :class="{ active: statusFilter === 'sent' }" @click="statusFilter = 'sent'">
                Sent ({{ countByStatus('sent') }})
              </button>
            </div>
          </div>

          <!-- Master Select All Bar -->
          <div class="px-4 py-2 bg-light border-bottom d-flex align-items-center justify-content-between small">
            <div class="form-check d-flex align-items-center mb-0">
              <input id="selectAllContacts" type="checkbox" class="form-check-input mt-0 me-2"
                :checked="isAllSelected && filteredContacts.length > 0" :indeterminate="isIndeterminate"
                @change="toggleSelectAll" />
              <label for="selectAllContacts" class="form-check-label user-select-none text-secondary fw-semibold">
                Select All Filtered
              </label>
            </div>

            <button v-if="selectedContactIds.length > 0" type="button"
              class="btn btn-link p-0 small text-decoration-none text-secondary" @click="selectedContactIds = []">
              Clear selection
            </button>
          </div>

          <!-- Contact List Scrollable Body -->
          <div class="card-body p-0 contact-list-body flex-grow-1">
            <!-- Loading -->
            <div v-if="isLoadingContacts" class="text-center py-5">
              <div class="spinner-border text-primary spinner-border-sm me-2"></div>
              <span class="text-secondary small">Loading contacts...</span>
            </div>

            <!-- Empty List -->
            <div v-else-if="filteredContacts.length === 0" class="text-center py-5 px-3">
              <p class="text-secondary small mb-2 fw-semibold">No contacts found</p>
              <router-link to="/contacts" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                Go to Contacts
              </router-link>
            </div>

            <!-- Scrollable Contacts Checklist -->
            <ul v-else class="list-group list-group-flush mb-0">
              <li v-for="contact in filteredContacts" :key="contact.id"
                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between px-4 py-3 contact-row"
                @click="toggleContactSelection(contact.id)">
                <div class="d-flex align-items-center me-2">
                  <input type="checkbox" class="form-check-input mt-0 me-3 flex-shrink-0" :value="contact.id"
                    :checked="selectedContactIds.includes(contact.id)" @click.stop
                    @change="toggleContactSelection(contact.id)" />
                  <div>
                    <div class="fw-semibold text-dark text-truncate contact-chatid">
                      {{ contact.chat_id }}
                    </div>
                    <div class="text-secondary small contact-name">
                      {{ (contact.name && contact.name !== 'none') ? contact.name : 'No name' }}
                    </div>
                  </div>
                </div>

                <!-- Status Badge -->
                <span class="badge status-pill text-capitalize" :class="`status-${contact.status}`">
                  {{ contact.status }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================
         CONFIRMATION MODAL: Launch Broadcast
         ======================================================== -->
    <div v-if="isConfirmModalOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow modal-card" style="max-width: 480px; width: 100%;">
        <div class="card-body p-4 text-center">
          <div class="broadcast-icon-box mx-auto mb-3 text-primary d-flex align-items-center justify-content-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>

          <h5 class="fw-bold text-dark mb-2">Ready to Start Broadcast?</h5>
          <p class="text-secondary small mb-4">
            You are about to queue messages for <strong class="text-dark">{{ selectedContactIds.length }}</strong>
            selected contacts.
            The backend will process them in sequence with anti-spam safe intervals.
          </p>

          <div class="alert bg-light border text-start small mb-4 p-3 rounded-3">
            <div class="d-flex justify-content-between mb-1">
              <span class="text-secondary">Total Recipients:</span>
              <strong class="text-dark">{{ selectedContactIds.length }} contacts</strong>
            </div>
            <div class="d-flex justify-content-between mb-1">
              <span class="text-secondary">Estimated Duration:</span>
              <strong class="text-dark">~{{ estimatedTime }} minutes</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-secondary">Interval per contact:</span>
              <strong class="text-dark">10 – 25 seconds</strong>
            </div>
          </div>

          <div class="d-flex justify-content-center gap-2">
            <button type="button" class="btn btn-light px-4" :disabled="isSending" @click="isConfirmModalOpen = false">
              Cancel
            </button>
            <button type="button" class="btn btn-primary px-4 fw-semibold" :disabled="isSending"
              @click="executeBroadcast">
              <span v-if="isSending" class="spinner-border spinner-border-sm me-1"></span>
              Confirm & Start
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/api';
import AppLayout from '@/layout/AppLayout.vue';
import BaseToast from '@/components/base/BaseToast.vue';

// State
const messageText = ref('');
const imageFile = ref(null);
const imagePreview = ref(null);
const contacts = ref([]);
const selectedContactIds = ref([]);
const searchQuery = ref('');
const statusFilter = ref('all');

const isLoadingContacts = ref(false);
const isSending = ref(false);
const isConfirmModalOpen = ref(false);

// Toast
const toastMessage = ref('');
const toastType = ref('success');
const isToastVisible = ref(false);

function showToast(message, type = 'success') {
  toastMessage.value = message;
  toastType.value = type;
  isToastVisible.value = true;
}

// Format current time for Telegram bubble
const currentTime = computed(() => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

// Estimated duration in minutes based on ~17.5s average delay
const estimatedTime = computed(() => {
  const seconds = selectedContactIds.value.length * 17.5;
  const mins = Math.ceil(seconds / 60);
  return mins > 0 ? mins : 1;
});

// Filter Contacts based on search and status
const filteredContacts = computed(() => {
  return contacts.value.filter((contact) => {
    // Status filter
    if (statusFilter.value !== 'all' && contact.status !== statusFilter.value) {
      return false;
    }
    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      const matchChatId = contact.chat_id?.toLowerCase().includes(q);
      const matchName = contact.name?.toLowerCase().includes(q);
      return matchChatId || matchName;
    }
    return true;
  });
});

function countByStatus(status) {
  return contacts.value.filter((c) => c.status === status).length;
}

// Master Checkbox
const isAllSelected = computed(() => {
  if (filteredContacts.value.length === 0) return false;
  return filteredContacts.value.every((c) => selectedContactIds.value.includes(c.id));
});

const isIndeterminate = computed(() => {
  const count = filteredContacts.value.filter((c) => selectedContactIds.value.includes(c.id)).length;
  return count > 0 && count < filteredContacts.value.length;
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    // Deselect filtered
    const filteredIds = filteredContacts.value.map((c) => c.id);
    selectedContactIds.value = selectedContactIds.value.filter((id) => !filteredIds.includes(id));
  } else {
    // Select all filtered
    const set = new Set(selectedContactIds.value);
    filteredContacts.value.forEach((c) => set.add(c.id));
    selectedContactIds.value = Array.from(set);
  }
}

function toggleContactSelection(id) {
  const idx = selectedContactIds.value.indexOf(id);
  if (idx > -1) {
    selectedContactIds.value.splice(idx, 1);
  } else {
    selectedContactIds.value.push(id);
  }
}

function insertTag(tag) {
  messageText.value += ` ${tag} `;
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

function clearImage() {
  imageFile.value = null;
  imagePreview.value = null;
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = '';
}

const canSendBroadcast = computed(() => {
  return (messageText.value.trim().length > 0 || imageFile.value !== null) && selectedContactIds.value.length > 0;
});

// ─────────────────────────────────────────────────────────────
// Fetch Contacts on Mount
// ─────────────────────────────────────────────────────────────
async function fetchContacts() {
  isLoadingContacts.value = true;
  try {
    const response = await api.get('/contacts/getAll');
    if (response.data && response.data.success) {
      contacts.value = response.data.data || [];
      // Auto-select pending contacts by default if available
      const pendingIds = contacts.value.filter((c) => c.status === 'pending').map((c) => c.id);
      if (pendingIds.length > 0) {
        selectedContactIds.value = pendingIds;
      }
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Failed to load contacts', 'danger');
  } finally {
    isLoadingContacts.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// Broadcast Execution
// ─────────────────────────────────────────────────────────────
function openConfirmModal() {
  if (!canSendBroadcast.value) return;
  isConfirmModalOpen.value = true;
}

async function executeBroadcast() {
  isSending.value = true;

  try {
    const formData = new FormData();
    formData.append('message', messageText.value.trim());
    formData.append('contactIds', JSON.stringify(selectedContactIds.value));
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    const response = await api.post('/broadcast/start', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data && response.data.success) {
      isConfirmModalOpen.value = false;
      showToast(response.data.message || 'Broadcast started successfully!', 'success');

      messageText.value = '';
      clearImage();
      selectedContactIds.value = [];

      // Refresh contacts after a delay
      setTimeout(() => {
        fetchContacts();
      }, 2000);
    } else {
      showToast(response.data?.message || 'Failed to start broadcast', 'danger');
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Error triggering broadcast', 'danger');
  } finally {
    isSending.value = false;
  }
}

onMounted(() => {
  const pendingToast = sessionStorage.getItem('pending_toast');
  if (pendingToast) {
    try {
      const parsed = JSON.parse(pendingToast);
      showToast(parsed.message || 'Success!', parsed.type || 'success');
    } catch {
      showToast(pendingToast, 'success');
    }
    sessionStorage.removeItem('pending_toast');
  }
  fetchContacts();
});
</script>

<style scoped>
.page-title {
  color: #0f172a;
  letter-spacing: -0.3px;
}

/* Green dot in safety badge */
.safe-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

/* Composer Card */
.composer-card,
.preview-card,
.target-card {
  border-radius: 16px;
  background-color: #ffffff;
  overflow: hidden;
}

.message-textarea {
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  font-size: 14.5px;
  resize: vertical;
  background-color: #f8fafc;
  transition: all 0.2s ease;
}

.message-textarea:focus {
  background-color: #ffffff;
  border-color: #24a1de;
  box-shadow: 0 0 0 3px rgba(36, 161, 222, 0.15) !important;
}

.btn-tag {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-tag:hover {
  background-color: #24a1de;
  color: #ffffff;
  border-color: #24a1de;
}

.safety-box {
  background-color: #f0f9ff;
  border: 1px solid #e0f2fe;
}

.send-btn {
  border-radius: 12px;
  background-color: #24a1de;
  border-color: #24a1de;
  box-shadow: 0 4px 14px rgba(36, 161, 222, 0.25);
  font-size: 15px;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background-color: #1a8cc4;
  border-color: #1a8cc4;
  box-shadow: 0 6px 18px rgba(36, 161, 222, 0.35);
  transform: translateY(-1px);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Telegram Preview Canvas */
.telegram-chat-canvas {
  background-color: #8da1b1;
  background-image: radial-gradient(#9fb2c2 1px, transparent 1px);
  background-size: 16px 16px;
  min-height: 180px;
}

.telegram-bubble {
  max-width: 85%;
  background: #24a1de;
  font-size: 14px;
  line-height: 1.45;
  border-bottom-right-radius: 4px !important;
}

.bubble-sender {
  font-size: 11px;
}

.bubble-time {
  font-size: 11px;
}

/* Target Contacts Card */
.search-input {
  border-radius: 8px;
  border-color: #e2e8f0;
  padding: 7px 12px;
}

.search-input:focus {
  border-color: #24a1de;
  box-shadow: 0 0 0 2px rgba(36, 161, 222, 0.15);
}

.btn-filter {
  background-color: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-filter:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.btn-filter.active {
  background-color: #24a1de;
  color: #ffffff;
  border-color: #24a1de;
}

.contact-list-body {
  max-height: 480px;
  overflow-y: auto;
}

.contact-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.contact-row:hover {
  background-color: #f8fafc;
}

.contact-chatid {
  font-size: 13.5px;
  max-width: 170px;
}

.contact-name {
  font-size: 12px;
  max-width: 170px;
}

/* Status Pill */
.status-pill {
  font-size: 11.5px;
  padding: 3px 10px;
  border-radius: 50rem;
  font-weight: 600;
}

.status-sent {
  background-color: #dcfce7;
  color: #15803d;
}

.status-pending {
  background-color: #fef3c7;
  color: #b45309;
}

.status-failed {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Modal styles */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1060;
}

.modal-card {
  border-radius: 16px;
  animation: modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from {
    transform: scale(0.96);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.broadcast-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(36, 161, 222, 0.1);
}
/* Clean File Input */
.file-input-clean {
  background-color: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-input-clean:hover {
  border-color: #cbd5e1;
}

.file-input-clean::file-selector-button {
  background-color: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  color: #0f172a;
  padding: 6px 14px;
  margin-right: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-input-clean::file-selector-button:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}
</style>