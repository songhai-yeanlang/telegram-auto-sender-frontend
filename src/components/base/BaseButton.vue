<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="btn base-button d-inline-flex align-items-center justify-content-center fw-semibold"
    :class="[
      `btn-${variant}`,
      { 'w-100': block }
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Bootstrap Spinner Border -->
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm me-2"
      role="status"
      aria-hidden="true"
    ></span>

    <!-- Leading Icon Slot -->
    <span v-if="$slots.icon && !loading" class="btn-icon me-2 d-inline-flex align-items-center">
      <slot name="icon" />
    </span>

    <!-- Button Text / Content -->
    <span class="btn-content">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'submit'
  },
  variant: {
    type: String,
    default: 'primary' // 'primary', 'secondary', 'outline-primary', etc.
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: true
  }
});

defineEmits(['click']);
</script>

<style scoped>
.base-button {
  font-family: inherit;
  font-size: 14.5px;
  line-height: 1.4;
  padding: 13px 22px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
  box-shadow: 0 4px 14px rgba(36, 161, 222, 0.25);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 6px 18px rgba(36, 161, 222, 0.35);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.base-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}
</style>
