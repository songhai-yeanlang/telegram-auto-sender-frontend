<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="base-toast-container"
        :class="positionClass"
      >
        <div
          class="base-toast d-inline-flex align-items-center text-white"
          :class="`toast-${type}`"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          @mouseenter="pauseTimer"
          @mouseleave="resumeTimer"
        >
          <!-- Toast Icon (Left) -->
          <span class="toast-icon d-inline-flex align-items-center justify-content-center me-2">
            <!-- Success Icon (check inside circle) -->
            <svg
              v-if="type === 'success' || type === 'primary' || type === 'telegram'"
              class="icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>

            <!-- Danger / Error Icon -->
            <svg
              v-else-if="type === 'danger' || type === 'error'"
              class="icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>

            <!-- Warning Icon -->
            <svg
              v-else-if="type === 'warning'"
              class="icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>

            <!-- Info / Dark Icon -->
            <svg
              v-else
              class="icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>

          <!-- Toast Message Text -->
          <div class="toast-message fw-semibold">
            <slot>{{ message }}</slot>
          </div>

          <!-- Close 'x' Button (Right) -->
          <button
            type="button"
            class="toast-close-btn btn btn-link p-0 text-white d-inline-flex align-items-center justify-content-center ms-3"
            aria-label="Close"
            @click="close"
          >
            <svg
              class="close-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'success', // 'success' (Telegram Blue), 'danger' | 'error', 'warning', 'info', 'dark'
    validator: (val) => [
      'success',
      'primary',
      'telegram',
      'danger',
      'error',
      'warning',
      'info',
      'dark'
    ].includes(val)
  },
  duration: {
    type: Number,
    default: 3500 // Auto-hide time in ms (0 = permanent until closed)
  },
  position: {
    type: String,
    default: 'bottom-right', // Default to bottom-right as requested
    validator: (val) => [
      'bottom-right',
      'bottom-center',
      'bottom-left',
      'top-right',
      'top-center',
      'top-left'
    ].includes(val)
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const visible = ref(props.modelValue);
let timer = null;
let remainingTime = props.duration;
let startTime = 0;

const positionClass = computed(() => `pos-${props.position}`);

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
    if (val) {
      remainingTime = props.duration;
      startAutoClose();
    } else {
      clearTimer();
    }
  }
);

onMounted(() => {
  if (visible.value) {
    startAutoClose();
  }
});

onUnmounted(() => {
  clearTimer();
});

function startAutoClose() {
  clearTimer();
  if (props.duration > 0) {
    startTime = Date.now();
    timer = setTimeout(() => {
      close();
    }, remainingTime);
  }
}

function pauseTimer() {
  if (props.duration > 0 && timer) {
    clearTimeout(timer);
    timer = null;
    remainingTime -= Date.now() - startTime;
  }
}

function resumeTimer() {
  if (props.duration > 0 && remainingTime > 0) {
    startAutoClose();
  }
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function close() {
  clearTimer();
  visible.value = false;
  emit('update:modelValue', false);
  emit('close');
}

defineExpose({
  close
});
</script>

<style scoped>
/* Container Positioning */
.base-toast-container {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  display: flex;
}

/* Bottom Positions */
.pos-bottom-right {
  bottom: 28px;
  right: 28px;
  justify-content: flex-end;
}

.pos-bottom-center {
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
}

.pos-bottom-left {
  bottom: 28px;
  left: 28px;
  justify-content: flex-start;
}

/* Top Positions */
.pos-top-right {
  top: 24px;
  right: 24px;
  justify-content: flex-end;
}

.pos-top-center {
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
}

.pos-top-left {
  top: 24px;
  left: 24px;
  justify-content: flex-start;
}

/* Toast Body */
.base-toast {
  pointer-events: auto;
  min-height: 48px;
  padding: 12px 20px;
  border-radius: 14px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  user-select: none;
  max-width: 90vw;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* ─────────────────────────────────────────────────────────────
   Color Themes (Matched with Website Palette: Telegram Blue & Slate)
   ───────────────────────────────────────────────────────────── */

/* Success / Primary: Signature Telegram Blue */
.toast-success,
.toast-primary,
.toast-telegram {
  background: linear-gradient(135deg, #24a1de 0%, #1a8cc4 100%);
  box-shadow: 0 10px 25px -4px rgba(36, 161, 222, 0.45), 0 6px 12px -3px rgba(36, 161, 222, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Dark Theme: Matching the Sidebar Deep Navy (#0b1329) with Blue Accent */
.toast-dark {
  background-color: #0b1329;
  border: 1px solid rgba(36, 161, 222, 0.35);
  box-shadow: 0 10px 25px -4px rgba(11, 19, 41, 0.6), 0 0 15px rgba(36, 161, 222, 0.15);
}

/* Danger / Error: Vibrant Red */
.toast-danger,
.toast-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 10px 25px -4px rgba(239, 68, 68, 0.35), 0 6px 12px -3px rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Warning: Warm Amber */
.toast-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 10px 25px -4px rgba(245, 158, 11, 0.35), 0 6px 12px -3px rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Info: Clean Cyan / Blue */
.toast-info {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  box-shadow: 0 10px 25px -4px rgba(2, 132, 199, 0.35), 0 6px 12px -3px rgba(2, 132, 199, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Icon Styles */
.toast-icon {
  flex-shrink: 0;
}

.icon-svg {
  width: 19px;
  height: 19px;
  stroke: #ffffff;
}

/* Message */
.toast-message {
  letter-spacing: -0.1px;
}

/* Close Button */
.toast-close-btn {
  opacity: 0.85;
  transition: opacity 0.15s ease, transform 0.15s ease;
  cursor: pointer;
  border: none;
  background: transparent;
  flex-shrink: 0;
}

.toast-close-btn:hover {
  opacity: 1;
  transform: scale(1.15);
}

.close-svg {
  width: 17px;
  height: 17px;
  stroke: #ffffff;
}

/* ─────────────────────────────────────────────────────────────
   Animations (Smooth Slide-Up for Bottom & Slide-Down for Top)
   ───────────────────────────────────────────────────────────── */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Bottom animations (Slide up from bottom) */
.pos-bottom-right.toast-enter-from,
.pos-bottom-right.toast-leave-to,
.pos-bottom-center.toast-enter-from,
.pos-bottom-center.toast-leave-to,
.pos-bottom-left.toast-enter-from,
.pos-bottom-left.toast-leave-to {
  opacity: 0;
  transform: translateY(22px) scale(0.96);
}

/* Top animations (Slide down from top) */
.pos-top-right.toast-enter-from,
.pos-top-right.toast-leave-to,
.pos-top-center.toast-enter-from,
.pos-top-center.toast-leave-to,
.pos-top-left.toast-enter-from,
.pos-top-left.toast-leave-to {
  opacity: 0;
  transform: translateY(-22px) scale(0.96);
}
</style>