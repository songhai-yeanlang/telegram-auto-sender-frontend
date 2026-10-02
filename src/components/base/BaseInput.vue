<template>
  <div class="mb-3 base-input-group" :class="{ 'is-focused': isFocused, 'has-error': isInvalid }">
    <!-- Form Label -->
    <label v-if="label" :for="id" class="form-label base-input-label fw-bold mb-1 d-block text-uppercase">
      {{ label }}
    </label>
    <!-- Bootstrap Input Group -->
    <div
      class="input-group base-input-wrapper align-items-center"
      :class="{ 'border-primary-focus': isFocused, 'is-invalid-border': isInvalid }"
    >
      <!-- Prefix Slot / Leading Icon -->
      <span v-if="$slots.prefix" class="input-group-text bg-transparent border-0 pe-1 text-muted prefix-container">
        <slot name="prefix" />
      </span>

      <!-- Main Input Field -->
      <input
        :id="id"
        :name="name"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        class="form-control border-0 bg-transparent base-input-field shadow-none ps-2"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Password Visibility Toggle with Bootstrap vr divider -->
      <span
        v-if="isPassword || type === 'password'"
        class="input-group-text bg-transparent border-0 ps-1 pe-3 d-flex align-items-center"
      >
        <span class="vr my-1 me-2 text-secondary opacity-50"></span>
        <button
          type="button"
          class="btn btn-link p-0 text-muted shadow-none border-0 d-flex align-items-center password-toggle-btn"
          :title="showPassword ? 'Hide password' : 'Show password'"
          @click="togglePasswordVisibility"
          tabindex="-1"
        >
          <!-- Eye Open Icon -->
          <svg
            v-if="!showPassword"
            class="eye-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <!-- Eye Closed / Off Icon -->
          <svg
            v-else
            class="eye-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" x2="22" y1="2" y2="22" />
          </svg>
        </button>
      </span>

      <!-- Custom Suffix Slot -->
      <span v-else-if="$slots.suffix" class="input-group-text bg-transparent border-0 ps-1 pe-3">
        <slot name="suffix" />
      </span>
    </div>

    <!-- Optional Custom Error Text -->
    <div v-if="typeof error === 'string' && error.trim()" class="invalid-feedback d-block mt-1 small">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substring(2, 9)}`
  },
  name: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: [String, Boolean],
    default: ''
  },
  hasError: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  isPassword: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

const isFocused = ref(false);
const showPassword = ref(false);

const isInvalid = computed(() => {
  return props.hasError || Boolean(props.error);
});

const computedType = computed(() => {
  if (props.isPassword || props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function handleFocus(event) {
  isFocused.value = true;
  emit('focus', event);
}

function handleBlur(event) {
  isFocused.value = false;
  emit('blur', event);
}
</script>

<style scoped>
.base-input-label {
  font-size: 11px;
  letter-spacing: 0.6px;
  color: #64748b;
  transition: color 0.2s ease;
  user-select: none;
}

.is-focused .base-input-label {
  color: #24a1de !important;
}

.has-error .base-input-label {
  color: #dc3545 !important;
}

.base-input-wrapper {
  background-color: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  min-height: 48px;
  transition: all 0.2s ease-in-out;
}

.base-input-wrapper:hover {
  border-color: #cbd5e1;
}

.border-primary-focus {
  border-color: #24a1de !important;
  box-shadow: 0 0 0 3px rgba(36, 161, 222, 0.15) !important;
}

.is-invalid-border {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15) !important;
}

.prefix-container {
  color: #94a3b8;
  transition: color 0.2s ease;
}

.is-focused .prefix-container {
  color: #24a1de !important;
}

.has-error .prefix-container {
  color: #dc3545 !important;
}

.base-input-field {
  font-size: 14px;
  color: #1e293b;
}

.base-input-field::placeholder {
  color: #94a3b8;
  font-size: 14px;
}

.password-toggle-btn {
  color: #94a3b8;
  border-radius: 6px;
  transition: color 0.2s ease;
}

.password-toggle-btn:hover {
  color: #64748b;
}

.eye-icon {
  width: 18px;
  height: 18px;
}
</style>
