<template>
  <AppLayout active-route="broadcast" breadcrumb-title="Broadcast">
    <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="page-title h3 fw-bold text-dark mb-1">Broadcast</h1>
        <p class="text-secondary small mb-0">Compose and dispatch auto-messages to targeted contacts with safe delay
          protection.</p>
      </div>
    </div>

    <BaseToast v-model="isToastVisible" :message="toastMessage" :type="toastType" :duration="4000"
      position="bottom-right" />

    <div class="row g-4">
      <div class="col-lg-7 col-xl-7 d-flex flex-column gap-4">
        <div class="card border-0 shadow-sm composer-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <label for="broadcastMessage" class="form-label fw-bold text-uppercase small text-secondary mb-0">MESSAGE
                CONTENT</label>
              <span class="text-muted small">{{ messageText.length }} characters</span>
            </div>
            <div class="mb-3">
              <div class="position-relative">
                <input type="file" id="imageUploadInput" class="form-control file-input-clean shadow-none"
                  :class="{ 'pe-5': imagePreview }" accept="image/jpeg, image/png, image/webp, image/gif"
                  @change="handleImageUpload" />
                <button v-if="imagePreview" type="button"
                  class="btn btn-sm text-danger position-absolute p-0 d-flex align-items-center justify-content-center"
                  style="top: 50%; right: 8px; transform: translateY(-50%); z-index: 5; border-radius: 50%; width: 24px; height: 24px; background-color: #fee2e2; border: 1px solid #fca5a5;"
                  @click="clearImage" title="Remove Image">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div class="textarea-wrapper mb-3">
              <textarea id="broadcastMessage" v-model="messageText" rows="7"
                class="form-control message-textarea shadow-none"
                placeholder="Type your broadcast message here..."></textarea>
            </div>
            <div class="d-flex align-items-center flex-wrap gap-2 mb-4">
              <button type="button" class="btn btn-sm btn-link text-decoration-none small text-danger ms-auto p-0"
                :disabled="!messageText && !imageFile" @click="messageText = ''; clearImage()">Clear all</button>
            </div>

            <!-- Action Buttons Row with Date Icon on the Right -->
            <div class="d-flex align-items-stretch gap-2 position-relative">
              <!-- Backdrop to close popover when clicking outside -->
              <div v-if="isSchedulePopoverOpen" class="schedule-popover-backdrop" @click="isSchedulePopoverOpen = false"></div>

              <!-- Main Send Button -->
              <button type="button"
                class="btn btn-primary flex-grow-1 py-3 d-flex align-items-center justify-content-center fw-semibold send-btn"
                :disabled="!canSendBroadcast || isSending || isScheduling" @click="openConfirmModal">
                <span v-if="isSending" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <svg v-else class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>{{ isSending ? 'Broadcasting...' : 'Send Now' }}</span>
              </button>

              <!-- Single Date Icon Button on the Right -->
              <div class="position-relative d-flex align-items-stretch schedule-icon-wrapper">
                <button type="button"
                  class="btn btn-schedule-icon px-3 d-flex align-items-center justify-content-center"
                  :class="{ 'active': scheduledAt || isSchedulePopoverOpen }"
                  :title="scheduledAt ? `Scheduled: ${formatScheduledDisplay(scheduledAt)}` : 'Schedule Date & Time'"
                  @click="toggleSchedulePopover">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span v-if="scheduledAt" class="schedule-active-dot bg-danger" :title="`Scheduled: ${formatScheduledDisplay(scheduledAt)}`"></span>
                </button>

                <!-- Popover: Shows Date & Time to Send only when Date Icon is clicked -->
                <div v-if="isSchedulePopoverOpen" class="schedule-popover card border-0 shadow-lg p-3 rounded-4">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#24a1de" stroke-width="2.2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span class="fw-bold small text-dark">Schedule Broadcast</span>
                    </div>
                    <button type="button" class="btn-close" style="font-size: 10px;"
                      @click="isSchedulePopoverOpen = false" aria-label="Close"></button>
                  </div>

                  <p class="text-secondary small mb-2" style="font-size: 11.5px;">Choose date and time to send:</p>

                  <input v-model="scheduledAt" type="datetime-local" class="form-control form-control-sm schedule-popover-input shadow-none mb-2"
                    :min="minDateTime" />

                  <div v-if="scheduledAt" class="schedule-preview-box p-2 rounded-2 mb-3 d-flex align-items-center justify-content-between">
                    <div class="small text-telegram-blue" style="font-size: 11.5px;">
                      Will send on: <strong>{{ formatScheduledDisplay(scheduledAt) }}</strong>
                    </div>
                    <button type="button" class="btn btn-sm btn-link text-danger p-0 text-decoration-none small"
                      style="font-size: 11px;" @click="scheduledAt = ''">Clear</button>
                  </div>

                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-sm btn-light flex-grow-1"
                      @click="isSchedulePopoverOpen = false">Cancel</button>
                    <button type="button" class="btn btn-sm btn-schedule-popover flex-grow-1 fw-semibold"
                      :disabled="!canSendBroadcast || !scheduledAt || isScheduling"
                      @click="onPopoverScheduleConfirm">
                      <span v-if="isScheduling" class="spinner-border spinner-border-sm me-1"></span>
                      Schedule Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm preview-card">
          <div class="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between">
            <span class="small fw-bold text-uppercase text-secondary">TELEGRAM PREVIEW</span>
            <span class="badge bg-light text-secondary rounded-pill small">Client View</span>
          </div>
          <div class="card-body p-4 pt-2">
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

        <div class="card border-0 shadow-sm scheduled-card">
          <div class="card-header bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#24a1de" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span class="fw-bold small text-uppercase text-secondary" style="letter-spacing: 0.5px;">Scheduled
                Broadcasts</span>
              <span v-if="scheduledJobs.length > 0" class="badge rounded-pill"
                style="background-color: #e0f2fe; color: #0284c7; font-size: 11px;">{{ scheduledJobs.length }}</span>
            </div>
            <button type="button" class="btn btn-sm btn-link text-secondary text-decoration-none p-0"
              @click="fetchScheduledJobs" :disabled="isLoadingScheduled">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" :class="{ 'spin-icon': isLoadingScheduled }">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>
          </div>
          <div class="card-body p-0">
            <div v-if="isLoadingScheduled" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary me-2"></div>
              <span class="text-secondary small">Loading...</span>
            </div>
            <div v-else-if="scheduledJobs.length === 0" class="text-center py-4 px-3">
              <p class="text-secondary small mb-0">No scheduled broadcasts yet.</p>
            </div>
            <ul v-else class="list-group list-group-flush">
              <li v-for="job in scheduledJobs" :key="job.id"
                class="list-group-item px-4 py-3 d-flex align-items-start justify-content-between gap-3 scheduled-row">
                <div class="flex-grow-1 min-w-0">
                  <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <span class="scheduled-status-badge" :class="`sched-${job.status}`">{{ job.status }}</span>
                    <span class="text-secondary small">{{ formatJobTime(job.scheduled_at) }}</span>
                    <span class="text-secondary small">· {{ job.total_recipients }} recipient{{ job.total_recipients ===
                      1 ? '' : 's' }}</span>
                  </div>
                  <p class="mb-0 small text-dark text-truncate" style="max-width: 380px;">{{ job.message_text || '(Image only)' }}</p>
                </div>
                <button v-if="job.status !== 'processing'" type="button"
                  class="btn btn-sm btn-delete-schedule flex-shrink-0" :disabled="deletingJobId === job.id"
                  @click="deleteScheduledJob(job.id)" :title="job.status === 'pending' ? 'Cancel Schedule' : 'Delete'">
                  <span v-if="deletingJobId === job.id" class="spinner-border spinner-border-sm"></span>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-5 col-xl-5 d-flex flex-column">
        <div class="card border-0 shadow-sm target-card d-flex flex-column flex-grow-1 h-100">
          <div class="card-header bg-white border-bottom p-4 pb-3 flex-shrink-0">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <h5 class="fw-bold text-dark mb-0 fs-6">Select Recipients</h5>
              <span
                class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1 small fw-semibold">{{
                  selectedContactIds.length }} / {{ filteredContacts.length }} Selected</span>
            </div>
            <div class="search-input-box mb-3">
              <input v-model="searchQuery" type="text" class="form-control form-control-sm search-input"
                placeholder="Search by name or chat ID..." />
            </div>
            <div class="d-flex align-items-center gap-1 flex-wrap">
              <button type="button" class="btn btn-filter btn-sm rounded-pill px-3 py-1"
                :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'">All ({{ contacts.length
                }})</button>
              <button type="button" class="btn btn-filter btn-sm rounded-pill px-3 py-1"
                :class="{ active: statusFilter === 'pending' }" @click="statusFilter = 'pending'">Pending ({{
                  countByStatus('pending') }})</button>
              <button type="button" class="btn btn-filter btn-sm rounded-pill px-3 py-1"
                :class="{ active: statusFilter === 'failed' }" @click="statusFilter = 'failed'">Failed ({{
                  countByStatus('failed') }})</button>
              <button type="button" class="btn btn-filter btn-sm rounded-pill px-3 py-1"
                :class="{ active: statusFilter === 'sent' }" @click="statusFilter = 'sent'">Sent ({{
                  countByStatus('sent') }})</button>
            </div>
          </div>
          <div class="px-4 py-2 bg-light border-bottom d-flex align-items-center justify-content-between small flex-shrink-0">
            <div class="form-check d-flex align-items-center mb-0">
              <input id="selectAllContacts" type="checkbox" class="form-check-input mt-0 me-2"
                :checked="isAllSelected && filteredContacts.length > 0" :indeterminate="isIndeterminate"
                @change="toggleSelectAll" />
              <label for="selectAllContacts" class="form-check-label user-select-none text-secondary fw-semibold">Select
                All Filtered</label>
            </div>
            <button v-if="selectedContactIds.length > 0" type="button"
              class="btn btn-link p-0 small text-decoration-none text-secondary" @click="selectedContactIds = []">Clear
              selection</button>
          </div>
          <div class="card-body p-0 contact-list-body flex-grow-1">
            <div v-if="isLoadingContacts" class="text-center py-5">
              <div class="spinner-border text-primary spinner-border-sm me-2"></div>
              <span class="text-secondary small">Loading contacts...</span>
            </div>
            <div v-else-if="filteredContacts.length === 0" class="text-center py-5 px-3">
              <p class="text-secondary small mb-2 fw-semibold">No contacts found</p>
              <router-link to="/contacts" class="btn btn-sm btn-outline-primary rounded-pill px-3">Go to
                Contacts</router-link>
            </div>
            <ul v-else class="list-group list-group-flush mb-0">
              <li v-for="contact in filteredContacts" :key="contact.id"
                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between px-4 py-3 contact-row"
                @click="toggleContactSelection(contact.id)">
                <div class="d-flex align-items-center me-2">
                  <input type="checkbox" class="form-check-input mt-0 me-3 flex-shrink-0" :value="contact.id"
                    :checked="selectedContactIds.includes(contact.id)" @click.stop
                    @change="toggleContactSelection(contact.id)" />
                  <div>
                    <div class="fw-semibold text-dark text-truncate contact-chatid">{{ contact.chat_id }}</div>
                    <div class="text-secondary small contact-name">{{ (contact.name && contact.name !== 'none') ?
                      contact.name : 'No name' }}</div>
                  </div>
                </div>
                <span class="badge status-pill text-capitalize" :class="`status-${contact.status}`">{{ contact.status
                }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

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
          <p class="text-secondary small mb-4">Queue messages for <strong class="text-dark">{{ selectedContactIds.length
          }}</strong> contacts with anti-spam safe intervals.</p>
          <div class="alert bg-light border text-start small mb-4 p-3 rounded-3">
            <div class="d-flex justify-content-between mb-1"><span class="text-secondary">Total
                Recipients:</span><strong class="text-dark">{{ selectedContactIds.length }} contacts</strong></div>
            <div class="d-flex justify-content-between mb-1"><span class="text-secondary">Estimated
                Duration:</span><strong class="text-dark">~{{ estimatedTime }} minutes</strong></div>
            <div class="d-flex justify-content-between"><span class="text-secondary">Interval per contact:</span><strong
                class="text-dark">10 to 25 seconds</strong></div>
          </div>
          <div class="d-flex justify-content-center gap-2">
            <button type="button" class="btn btn-light px-4" :disabled="isSending"
              @click="isConfirmModalOpen = false">Cancel</button>
            <button type="button" class="btn btn-primary px-4 fw-semibold" :disabled="isSending"
              @click="executeBroadcast">
              <span v-if="isSending" class="spinner-border spinner-border-sm me-1"></span>
              Confirm and Start
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isScheduleConfirmModalOpen"
      class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow modal-card" style="max-width: 480px; width: 100%;">
        <div class="card-body p-4 text-center">
          <div class="schedule-icon-box mx-auto mb-3 d-flex align-items-center justify-content-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#24a1de" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h5 class="fw-bold text-dark mb-2">Confirm Schedule?</h5>
          <p class="text-secondary small mb-4">This broadcast will be automatically sent at the scheduled time.</p>
          <div class="alert border text-start small mb-4 p-3 rounded-3"
            style="background: #f0f9ff; border-color: #bae6fd !important;">
            <div class="d-flex justify-content-between mb-1"><span class="text-secondary">Total
                Recipients:</span><strong class="text-dark">{{ selectedContactIds.length }} contacts</strong></div>
            <div class="d-flex justify-content-between mb-1"><span class="text-secondary">Scheduled At:</span><strong
                class="text-dark">{{ formatScheduledDisplay(scheduledAt) }}</strong></div>
            <div class="d-flex justify-content-between"><span class="text-secondary">Content:</span><strong
                class="text-dark">{{ imageFile ? 'Image' : '' }}{{ imageFile && messageText ? ' + ' : '' }}{{
                  messageText ? 'Text' : '' }}</strong></div>
          </div>
          <div class="d-flex justify-content-center gap-2">
            <button type="button" class="btn btn-light px-4" :disabled="isScheduling"
              @click="isScheduleConfirmModalOpen = false">Cancel</button>
            <button type="button" class="btn px-4 fw-semibold btn-schedule-confirm" :disabled="isScheduling"
              @click="executeScheduleBroadcast">
              <span v-if="isScheduling" class="spinner-border spinner-border-sm me-1"></span>
              Confirm Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '@/api/api';
import AppLayout from '@/layout/AppLayout.vue';
import BaseToast from '@/components/base/BaseToast.vue';

const messageText = ref('');
const imageFile = ref(null);
const imagePreview = ref(null);
const contacts = ref([]);
const selectedContactIds = ref([]);
const searchQuery = ref('');
const statusFilter = ref('all');
const scheduledAt = ref('');
const isSchedulePopoverOpen = ref(false);

const isLoadingContacts = ref(false);
const isSending = ref(false);
const isScheduling = ref(false);
const isConfirmModalOpen = ref(false);
const isScheduleConfirmModalOpen = ref(false);

const scheduledJobs = ref([]);
const isLoadingScheduled = ref(false);
const deletingJobId = ref(null);

const toastMessage = ref('');
const toastType = ref('success');
const isToastVisible = ref(false);

function showToast(message, type = 'success') {
  toastMessage.value = message;
  toastType.value = type;
  isToastVisible.value = true;
}

const currentTime = computed(() => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

const estimatedTime = computed(() => {
  const seconds = selectedContactIds.value.length * 17.5;
  const mins = Math.ceil(seconds / 60);
  return mins > 0 ? mins : 1;
});

const minDateTime = computed(() => {
  const d = new Date(Date.now() + 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
});

const filteredContacts = computed(() => {
  return contacts.value.filter((contact) => {
    if (statusFilter.value !== 'all' && contact.status !== statusFilter.value) return false;
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      return contact.chat_id?.toLowerCase().includes(q) || contact.name?.toLowerCase().includes(q);
    }
    return true;
  });
});

function countByStatus(status) {
  return contacts.value.filter((c) => c.status === status).length;
}

const isAllSelected = computed(() => {
  if (filteredContacts.value.length === 0) return false;
  return filteredContacts.value.every((c) => selectedContactIds.value.includes(c.id));
});

const isIndeterminate = computed(() => {
  const count = filteredContacts.value.filter((c) => selectedContactIds.value.includes(c.id)).length;
  return count > 0 && count < filteredContacts.value.length;
});

const canSendBroadcast = computed(() => {
  return (messageText.value.trim().length > 0 || imageFile.value !== null) && selectedContactIds.value.length > 0;
});

function formatScheduledDisplay(dtString) {
  if (!dtString) return '';
  const d = new Date(dtString);
  return d.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatJobTime(dtString) {
  if (!dtString) return '';
  const d = new Date(dtString);
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function toggleSchedulePopover() {
  isSchedulePopoverOpen.value = !isSchedulePopoverOpen.value;
}

function onPopoverScheduleConfirm() {
  if (!canSendBroadcast.value) {
    showToast('Please enter a message or image, and select at least one contact.', 'danger');
    return;
  }
  if (!scheduledAt.value) {
    showToast('Please select a date and time to schedule.', 'danger');
    return;
  }
  if (new Date(scheduledAt.value) <= new Date()) {
    showToast('Scheduled time must be in the future.', 'danger');
    return;
  }
  isSchedulePopoverOpen.value = false;
  openScheduleConfirmModal();
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    const filteredIds = filteredContacts.value.map((c) => c.id);
    selectedContactIds.value = selectedContactIds.value.filter((id) => !filteredIds.includes(id));
  } else {
    const set = new Set(selectedContactIds.value);
    filteredContacts.value.forEach((c) => set.add(c.id));
    selectedContactIds.value = Array.from(set);
  }
}

function toggleContactSelection(id) {
  const idx = selectedContactIds.value.indexOf(id);
  if (idx > -1) { selectedContactIds.value.splice(idx, 1); } else { selectedContactIds.value.push(id); }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) { imageFile.value = file; imagePreview.value = URL.createObjectURL(file); }
}

function clearImage() {
  imageFile.value = null;
  imagePreview.value = null;
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = '';
}

let broadcastPollInterval = null;

function startBroadcastPolling() {
  stopBroadcastPolling();
  broadcastPollInterval = setInterval(async () => {
    try {
      const res = await api.get('/broadcast/status');
      await fetchContacts(false);
      if (!res.data?.isBroadcasting) {
        stopBroadcastPolling();
      }
    } catch {
      stopBroadcastPolling();
    }
  }, 4000);
}

function stopBroadcastPolling() {
  if (broadcastPollInterval) {
    clearInterval(broadcastPollInterval);
    broadcastPollInterval = null;
  }
}

async function fetchContacts(isInitialLoad = false) {
  isLoadingContacts.value = isInitialLoad;
  try {
    const response = await api.get('/contacts/getAll');
    if (response.data && response.data.success) {
      contacts.value = response.data.data || [];
      if (isInitialLoad && selectedContactIds.value.length === 0) {
        const pendingIds = contacts.value.filter((c) => c.status === 'pending').map((c) => c.id);
        if (pendingIds.length > 0) selectedContactIds.value = pendingIds;
      }
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Failed to load contacts', 'danger');
  } finally {
    isLoadingContacts.value = false;
  }
}

async function fetchScheduledJobs() {
  isLoadingScheduled.value = true;
  try {
    const response = await api.get('/broadcast/scheduled');
    if (response.data && response.data.success) {
      scheduledJobs.value = response.data.data || [];
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Failed to load scheduled broadcasts', 'danger');
  } finally {
    isLoadingScheduled.value = false;
  }
}

async function deleteScheduledJob(id) {
  deletingJobId.value = id;
  try {
    const response = await api.delete(`/broadcast/scheduled/${id}`);
    if (response.data && response.data.success) {
      showToast('Scheduled broadcast deleted successfully!', 'success');
      scheduledJobs.value = scheduledJobs.value.filter((j) => j.id !== id);
    } else {
      showToast(response.data?.message || 'Failed to delete schedule', 'danger');
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Error deleting schedule', 'danger');
  } finally {
    deletingJobId.value = null;
  }
}

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
    if (imageFile.value) formData.append('image', imageFile.value);
    const response = await api.post('/broadcast/start', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (response.data && response.data.success) {
      isConfirmModalOpen.value = false;
      showToast(response.data.message || 'Broadcast started!', 'success');
      messageText.value = '';
      clearImage();
      selectedContactIds.value = [];
      startBroadcastPolling();
    } else {
      showToast(response.data?.message || 'Failed to start broadcast', 'danger');
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Error triggering broadcast', 'danger');
  } finally {
    isSending.value = false;
  }
}

function openScheduleConfirmModal() {
  if (!canSendBroadcast.value || !scheduledAt.value) return;
  if (new Date(scheduledAt.value) <= new Date()) {
    showToast('Scheduled time must be in the future.', 'danger');
    return;
  }
  isScheduleConfirmModalOpen.value = true;
}

async function executeScheduleBroadcast() {
  isScheduling.value = true;
  try {
    const formData = new FormData();
    formData.append('message', messageText.value.trim());
    formData.append('contactIds', JSON.stringify(selectedContactIds.value));
    formData.append('scheduledAt', new Date(scheduledAt.value).toISOString());
    if (imageFile.value) formData.append('image', imageFile.value);
    const response = await api.post('/broadcast/schedule', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (response.data && response.data.success) {
      isScheduleConfirmModalOpen.value = false;
      showToast('Broadcast scheduled successfully!', 'success');
      messageText.value = '';
      clearImage();
      selectedContactIds.value = [];
      scheduledAt.value = '';
      await fetchScheduledJobs();
    } else {
      showToast(response.data?.message || 'Failed to schedule broadcast', 'danger');
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Error scheduling broadcast', 'danger');
  } finally {
    isScheduling.value = false;
  }
}

onMounted(() => {
  const pendingToast = sessionStorage.getItem('pending_toast');
  if (pendingToast) {
    try {
      const parsed = JSON.parse(pendingToast);
      showToast(parsed.message || 'Success!', parsed.type || 'success');
    } catch { showToast(pendingToast, 'success'); }
    sessionStorage.removeItem('pending_toast');
  }
  fetchContacts(true);
  fetchScheduledJobs();
});

onUnmounted(() => {
  stopBroadcastPolling();
});
</script>

<style scoped>
.page-title {
  color: #0f172a;
  letter-spacing: -0.3px;
}

.composer-card,
.preview-card,
.target-card,
.scheduled-card {
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

.text-telegram-blue {
  color: #0284c7;
}

.schedule-popover-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1040;
  background: transparent;
}

.schedule-icon-wrapper {
  position: relative;
}

.btn-schedule-icon {
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background-color: #f8fafc;
  color: #64748b;
  min-width: 52px;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1042;
}

.btn-schedule-icon:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #1e293b;
}

.btn-schedule-icon.active {
  background-color: #f0f9ff;
  border-color: #7dd3fc;
  color: #24a1de;
  box-shadow: 0 4px 12px rgba(36, 161, 222, 0.2);
}

.schedule-active-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #ffffff;
}

.schedule-popover {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0;
  width: 320px;
  max-width: calc(100vw - 32px);
  background-color: #ffffff;
  border: 1.5px solid #bae6fd !important;
  box-shadow: 0 14px 35px rgba(36, 161, 222, 0.16), 0 4px 12px rgba(0, 0, 0, 0.06) !important;
  z-index: 1050;
  animation: popoverFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.schedule-popover-input {
  border: 1.5px solid #bae6fd;
  border-radius: 8px;
  font-size: 13px;
  background-color: #ffffff;
  color: #0f172a;
}

.schedule-popover-input:focus {
  border-color: #24a1de;
  box-shadow: 0 0 0 3px rgba(36, 161, 222, 0.15) !important;
}

.schedule-preview-box {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
}

.btn-schedule-popover {
  background-color: #24a1de;
  border-color: #24a1de;
  color: #ffffff;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.btn-schedule-popover:hover:not(:disabled) {
  background-color: #1a8cc4;
  border-color: #1a8cc4;
  color: #ffffff;
}

.btn-schedule-popover:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes popoverFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.btn-schedule {
  border-radius: 12px;
  background-color: #24a1de;
  border-color: #24a1de;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(36, 161, 222, 0.25);
  font-size: 15px;
  transition: all 0.2s ease;
}

.btn-schedule:hover:not(:disabled) {
  background-color: #1a8cc4;
  border-color: #1a8cc4;
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(36, 161, 222, 0.35);
  transform: translateY(-1px);
}

.btn-schedule:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  color: #fff;
}

.btn-schedule-confirm {
  background-color: #24a1de;
  border-color: #24a1de;
  color: #ffffff;
}

.btn-schedule-confirm:hover:not(:disabled) {
  background-color: #1a8cc4;
  border-color: #1a8cc4;
  color: #ffffff;
}

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
  flex: 1 1 0;
  min-height: 380px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

@media (min-width: 992px) {
  .contact-list-body {
    min-height: 0;
    max-height: none;
  }
}

.contact-list-body::-webkit-scrollbar {
  width: 6px;
}

.contact-list-body::-webkit-scrollbar-track {
  background: transparent;
}

.contact-list-body::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}

.contact-list-body::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
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

.scheduled-row {
  transition: background-color 0.15s ease;
}

.scheduled-row:hover {
  background-color: #f0f9ff;
}

.scheduled-status-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 50rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.sched-pending {
  background-color: #e0f2fe;
  color: #0284c7;
}

.sched-processing {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.sched-completed {
  background-color: #dcfce7;
  color: #15803d;
}

.sched-failed {
  background-color: #fee2e2;
  color: #b91c1c;
}

.btn-delete-schedule {
  background-color: transparent;
  border: 1px solid #fecaca;
  color: #ef4444;
  border-radius: 8px;
  padding: 5px 10px;
  transition: all 0.15s ease;
}

.btn-delete-schedule:hover:not(:disabled) {
  background-color: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.spin-icon {
  animation: spin 0.8s linear infinite;
}

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

.schedule-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(36, 161, 222, 0.1);
}

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
