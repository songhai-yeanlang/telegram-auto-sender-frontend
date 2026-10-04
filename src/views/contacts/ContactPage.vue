<template>
  <AppLayout active-route="contacts" breadcrumb-title="Contacts">
    <!-- Page Header & Action Buttons -->
    <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="page-title h3 fw-bold text-dark mb-1">Contacts</h1>
        <p class="text-secondary small mb-0">Manage your contact list and broadcast deliverability</p>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex align-items-center gap-2 flex-wrap mt-2 mt-sm-0">
        <!-- Hidden file input for quick upload -->
        <input ref="fileInputRef" type="file" class="d-none" accept=".xlsx,.xls,.csv,.txt" @change="onFileSelected" />

        <!-- Upload File Button -->
        <button type="button"
          class="btn btn-outline-primary upload-btn d-inline-flex align-items-center fw-semibold px-3 py-2 flex-grow-1 justify-content-center flex-sm-grow-0"
          @click="openUploadModal">
          <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
          </svg>
          Upload File
        </button>

        <!-- Add Contact Button -->
        <button type="button" class="btn btn-primary add-btn d-inline-flex align-items-center fw-semibold px-3 py-2 flex-grow-1 justify-content-center flex-sm-grow-0"
          @click="openAddModal">
          <svg class="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Contact
        </button>
      </div>
    </div>

    <!-- Floating Toast Notification -->
    <BaseToast
      v-model="isToastVisible"
      :message="toastMessage"
      :type="toastType"
      :duration="3500"
      position="bottom-right"
    />

    <!-- Contacts Table Card -->
    <div class="card border-0 shadow-sm table-card">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0 custom-table">
          <thead>
            <tr>
              <th scope="col" class="th-id ps-4">ID</th>
              <th scope="col" class="th-chatid">Telegrams</th>
              <th scope="col" class="th-name">Name</th>
              <th scope="col" class="th-status text-center">Status</th>
              <th scope="col" class="th-error">Error Message</th>
              <th scope="col" class="th-actions text-end pe-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading Shimmer Skeleton Rows -->
            <template v-if="isLoading">
              <tr v-for="n in 6" :key="`shimmer-${n}`" class="align-middle">
                <!-- ID -->
                <td class="ps-4 py-3">
                  <BaseShimmer width="22px" height="14px" border-radius="4px" />
                </td>
                <!-- Phone Number / Chat ID -->
                <td class="py-3">
                  <BaseShimmer width="130px" height="15px" border-radius="6px" />
                </td>
                <!-- Name -->
                <td class="py-3">
                  <BaseShimmer width="160px" height="15px" border-radius="6px" />
                </td>
                <!-- Status Badge -->
                <td class="text-center py-3">
                  <BaseShimmer width="70px" height="22px" border-radius="20px" class="mx-auto" />
                </td>
                <!-- Error Message -->
                <td class="py-3">
                  <BaseShimmer width="130px" height="14px" border-radius="6px" />
                </td>
                <!-- Actions -->
                <td class="text-end pe-4 py-3">
                  <div class="d-inline-flex align-items-center gap-2">
                    <BaseShimmer width="28px" height="28px" border-radius="6px" />
                    <BaseShimmer width="28px" height="28px" border-radius="6px" />
                  </div>
                </td>
              </tr>
            </template>

            <!-- Empty State -->
            <tr v-else-if="paginatedContacts.length === 0">
              <td colspan="6" class="text-center py-5">
                <div class="empty-icon-box mx-auto mb-2 d-flex align-items-center justify-content-center text-muted">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <p class="text-secondary small mb-1 fw-semibold">No contacts found</p>
                <p class="text-muted small mb-0">Click "Add Contact" or "Upload File" to import contacts.</p>
              </td>
            </tr>

            <!-- Contact Data Rows -->
            <tr v-for="(contact, index) in paginatedContacts" :key="contact.id">
              <!-- ID -->
              <td class="ps-4 text-secondary small">
                {{ (currentPage - 1) * pageSize + index + 1 }}
              </td>

              <!-- Chat ID -->
              <td class="fw-semibold text-dark chat-id-text">
                {{ contact.chat_id }}
              </td>

              <!-- Name -->
              <td class="text-secondary name-text">
                {{ (contact.name && contact.name !== 'none') ? contact.name : '—' }}
              </td>

              <!-- Status Badge -->
              <td class="text-center">
                <span class="badge status-badge" :class="`status-${contact.status}`">
                  {{ contact.status }}
                </span>
              </td>

              <!-- Error Message -->
              <td class="small">
                <span v-if="contact.error_message" class="text-danger error-text">
                  {{ contact.error_message }}
                </span>
                <span v-else class="text-muted opacity-50">—</span>
              </td>

              <!-- Actions -->
              <td class="text-end pe-4">
                <div class="d-inline-flex align-items-center gap-2">
                  <!-- Edit Button -->
                  <button type="button" class="btn btn-action-icon p-1 text-secondary" title="Edit Contact"
                    @click="openEditModal(contact)">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"
                      stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>

                  <!-- Delete Button -->
                  <button type="button" class="btn btn-action-icon p-1 text-secondary delete-icon"
                    title="Delete Contact" @click="openDeleteModal(contact)">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"
                      stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer / Pagination -->
      <div
        class="card-footer bg-white border-top d-flex align-items-center justify-content-between px-4 py-3 flex-wrap gap-2">
        <div class="text-secondary small">
          Showing <span class="fw-semibold text-dark">{{ contacts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0
            }}</span>
          to <span class="fw-semibold text-dark">{{ Math.min(currentPage * pageSize, contacts.length) }}</span>
          of <span class="fw-semibold text-dark">{{ contacts.length }}</span> contacts
        </div>

        <!-- Pagination Controls -->
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm px-3 pagination-btn"
            :disabled="currentPage <= 1" @click="currentPage--">
            Previous
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm px-3 pagination-btn"
            :disabled="currentPage >= totalPages" @click="currentPage++">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================
         MODAL: Add Contact
         ======================================================== -->
    <div v-if="isAddModalOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow modal-card" style="max-width: 480px; width: 100%;">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="fw-bold mb-0">Add New Contact</h5>
            <button type="button" class="btn-close" @click="isAddModalOpen = false"></button>
          </div>

          <form @submit.prevent="submitAddContact">
            <div class="mb-3">
              <label class="form-label small fw-bold  text-secondary">Nunber Phone</label>
              <input v-model="addForm.chatId" type="text" class="form-control" placeholder="e.g. +8856188388"
                required />
             
            </div>

            <div class="mb-4">
              <label class="form-label small fw-bold  text-secondary">Contact Name</label>
              <input v-model="addForm.name" type="text" class="form-control" placeholder="e.g. Keo Samnang" />
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-light px-3" @click="isAddModalOpen = false">Cancel</button>
              <button type="submit" class="btn btn-primary px-3" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                Save Contact
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- ========================================================
         MODAL: Edit Contact
         ======================================================== -->
    <div v-if="isEditModalOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow modal-card" style="max-width: 480px; width: 100%;">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="fw-bold mb-0">Edit Contact</h5>
            <button type="button" class="btn-close" @click="isEditModalOpen = false"></button>
          </div>

          <form @submit.prevent="submitEditContact">
            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase text-secondary">Chat ID</label>
              <input v-model="editForm.chatId" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase text-secondary">Name</label>
              <input v-model="editForm.name" type="text" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase text-secondary">Status</label>
              <select v-model="editForm.status" class="form-select">
                <option value="pending">pending</option>
                <option value="sent">sent</option>
                <option value="failed">failed</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="form-label small fw-bold text-uppercase text-secondary">Error Message</label>
              <input v-model="editForm.errorMessage" type="text" class="form-control" placeholder="None" />
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-light px-3" @click="isEditModalOpen = false">Cancel</button>
              <button type="submit" class="btn btn-primary px-3" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- ========================================================
         MODAL: Upload Contacts File
         ======================================================== -->
    <div v-if="isUploadModalOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow modal-card" style="max-width: 520px; width: 100%;">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="fw-bold mb-0">Upload Contacts File</h5>
            <button type="button" class="btn-close" @click="isUploadModalOpen = false"></button>
          </div>

          <p class="text-secondary small mb-3">
            Supported formats: <strong>.xlsx, .xls, .csv, .txt</strong>. <br />
            First column: <strong>Chat ID / Phone number</strong>, Second column: <strong>Name</strong>.
          </p>

          <div class="upload-dropzone p-4 text-center rounded-3 mb-3" @click="triggerFileInput">
            <div class="cloud-icon-box mx-auto mb-2 text-primary">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m16 16-4-4-4 4" />
              </svg>
            </div>
            <div v-if="selectedFile" class="fw-semibold text-dark">
              Selected: <span class="text-primary">{{ selectedFile.name }}</span>
            </div>
            <div v-else>
              <span class="fw-semibold text-primary">Click to select file</span>
              <span class="text-secondary small d-block">Excel, CSV, or Text file</span>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-light px-3" @click="isUploadModalOpen = false">Cancel</button>
            <button type="button" class="btn btn-primary px-3" :disabled="!selectedFile || isSubmitting"
              @click="submitUploadFile">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              Upload & Import
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================
         MODAL: Delete Confirmation
         ======================================================== -->
    <div v-if="isDeleteModalOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow modal-card" style="max-width: 440px; width: 100%;">
        <div class="card-body p-4 text-center">
          <div class="trash-icon-box mx-auto mb-3 text-danger d-flex align-items-center justify-content-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>

          <h5 class="fw-bold text-dark mb-2">Delete Contact</h5>
          <p class="text-secondary small mb-4">
            Are you sure you want to delete <strong class="text-dark">{{ contactToDelete?.chat_id }}</strong>? This
            action cannot be undone.
          </p>

          <div class="d-flex justify-content-center gap-2">
            <button type="button" class="btn btn-light px-4" @click="isDeleteModalOpen = false">Cancel</button>
            <button type="button" class="btn btn-danger px-4" :disabled="isSubmitting" @click="confirmDeleteContact">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '@/api/api';
import AppLayout from '@/layout/AppLayout.vue';
import BaseToast from '@/components/base/BaseToast.vue';
import BaseShimmer from '@/components/base/BaseShimmer.vue';

// Contacts Data & State
const contacts = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const toastMessage = ref('');
const toastType = ref('success');
const isToastVisible = ref(false);

// Pagination State
const currentPage = ref(1);
const pageSize = 10;

const totalPages = computed(() => {
  return Math.ceil(contacts.value.length / pageSize) || 1;
});

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return contacts.value.slice(start, start + pageSize);
});

// Modals State
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isUploadModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const contactToDelete = ref(null);

const fileInputRef = ref(null);
const selectedFile = ref(null);

const addForm = reactive({
  chatId: '',
  name: ''
});

const editForm = reactive({
  id: null,
  chatId: '',
  name: '',
  status: 'pending',
  errorMessage: ''
});

function showToast(message, type = 'success') {
  toastMessage.value = message;
  toastType.value = type;
  isToastVisible.value = true;
}

// ─────────────────────────────────────────────────────────────
// 1. Fetch All Contacts
// ─────────────────────────────────────────────────────────────
async function fetchContacts() {
  isLoading.value = true;
  try {
    const response = await api.get('/contacts/getAll');
    if (response.data && response.data.success) {
      contacts.value = response.data.data || [];
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Failed to load contacts', 'danger');
  } finally {
    isLoading.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Add Contact
// ─────────────────────────────────────────────────────────────
function openAddModal() {
  addForm.chatId = '';
  addForm.name = '';
  isAddModalOpen.value = true;
}

async function submitAddContact() {
  if (!addForm.chatId) return;

  isSubmitting.value = true;
  try {
    const response = await api.post('/contacts/add', {
      chatId: addForm.chatId.trim(),
      name: addForm.name.trim() || 'none'
    });

    if (response.data && response.data.success) {
      showToast('Contact added successfully!', 'success');
      isAddModalOpen.value = false;
      await fetchContacts();
    } else {
      showToast(response.data?.message || 'Failed to add contact', 'danger');
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Error adding contact', 'danger');
  } finally {
    isSubmitting.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// 3. Edit Contact
// ─────────────────────────────────────────────────────────────
function openEditModal(contact) {
  editForm.id = contact.id;
  editForm.chatId = contact.chat_id;
  editForm.name = contact.name && contact.name !== 'none' ? contact.name : '';
  editForm.status = contact.status || 'pending';
  editForm.errorMessage = contact.error_message || '';
  isEditModalOpen.value = true;
}

async function submitEditContact() {
  if (!editForm.id) return;

  isSubmitting.value = true;
  try {
    const response = await api.put(`/contacts/update/${editForm.id}`, {
      id: editForm.id,
      chatId: editForm.chatId.trim(),
      name: editForm.name.trim(),
      status: editForm.status,
      errorMessage: editForm.errorMessage.trim() || null
    });

    if (response.data && response.data.success) {
      showToast('Contact updated successfully!', 'success');
      isEditModalOpen.value = false;
      await fetchContacts();
    } else {
      showToast(response.data?.message || 'Failed to update contact', 'danger');
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Error updating contact', 'danger');
  } finally {
    isSubmitting.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// 4. Delete Contact
// ─────────────────────────────────────────────────────────────
function openDeleteModal(contact) {
  contactToDelete.value = contact;
  isDeleteModalOpen.value = true;
}

async function confirmDeleteContact() {
  if (!contactToDelete.value) return;

  isSubmitting.value = true;
  try {
    const response = await api.delete(`/contacts/delete/${contactToDelete.value.id}`);
    if (response.data && response.data.success) {
      showToast('Contact deleted successfully!', 'success');
      isDeleteModalOpen.value = false;
      contactToDelete.value = null;
      await fetchContacts();
    } else {
      showToast(response.data?.message || 'Failed to delete contact', 'danger');
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Error deleting contact', 'danger');
  } finally {
    isSubmitting.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// 5. Upload File
// ─────────────────────────────────────────────────────────────
function openUploadModal() {
  selectedFile.value = null;
  isUploadModalOpen.value = true;
}

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

function onFileSelected(event) {
  const file = event.target.files?.[0];
  if (file) {
    selectedFile.value = file;
  }
}

async function submitUploadFile() {
  if (!selectedFile.value) return;

  isSubmitting.value = true;
  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const response = await api.post('/contacts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data && response.data.success) {
      showToast(response.data.message || 'Contacts file uploaded successfully!', 'success');
      isUploadModalOpen.value = false;
      selectedFile.value = null;
      await fetchContacts();
    } else {
      showToast(response.data?.message || 'Failed to upload file', 'danger');
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Error uploading file', 'danger');
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  const pendingToast = sessionStorage.getItem('pending_toast');
  if (pendingToast) {
    try {
      const parsed = JSON.parse(pendingToast);
      showToast(parsed.message || 'Password reset successfully!', parsed.type || 'success');
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

/* Upload & Add Buttons */
.upload-btn {
  border-color: #24a1de;
  color: #24a1de;
  border-radius: 9px;
  background-color: transparent;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  background-color: rgba(36, 161, 222, 0.08);
  border-color: #24a1de;
  color: #24a1de;
}

.add-btn {
  border-radius: 9px;
  background-color: #24a1de;
  border-color: #24a1de;
  box-shadow: 0 2px 6px rgba(36, 161, 222, 0.25);
  transition: all 0.2s ease;
}

.add-btn:hover {
  background-color: #1a8cc4;
  border-color: #1a8cc4;
  transform: translateY(-1px);
}

/* Table Card */
.table-card {
  border-radius: 14px;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.custom-table thead tr th {
  background-color: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #64748b;
  border-bottom: 1px solid #f1f5f9;
  padding-top: 14px;
  padding-bottom: 14px;
}

.custom-table tbody tr {
  transition: background-color 0.15s ease;
}

.custom-table tbody tr:hover {
  background-color: #f8fafc;
}

.custom-table tbody tr td {
  padding-top: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f8fafc;
}

.chat-id-text {
  font-size: 14px;
  color: #1e293b;
}

.name-text {
  font-size: 14px;
  color: #334155;
}

/* Status Badges */
.status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 50rem;
  display: inline-block;
  text-transform: lowercase;
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

.error-text {
  font-size: 13px;
}

/* Action Icons */
.btn-action-icon {
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #64748b;
  transition: all 0.15s ease;
}

.btn-action-icon:hover {
  background-color: #f1f5f9;
  color: #24a1de;
}

.btn-action-icon.delete-icon:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

/* Pagination Buttons */
.pagination-btn {
  border-radius: 8px;
  border-color: #e2e8f0;
  color: #475569;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Backdrops & Cards */
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

.upload-dropzone {
  border: 2px dashed #cbd5e1;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-dropzone:hover {
  border-color: #24a1de;
  background-color: rgba(36, 161, 222, 0.04);
}

.trash-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #fee2e2;
}

.empty-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #f1f5f9;
}
</style>