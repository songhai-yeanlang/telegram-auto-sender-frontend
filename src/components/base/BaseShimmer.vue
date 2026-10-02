<template>
  <!-- If not loading and default slot is provided, show actual content -->
  <slot v-if="!loading && $slots.default" />

  <!-- Otherwise, show the shimmer skeleton -->
  <div
    v-else
    class="shimmer-wrapper"
    :class="[
      `shimmer-dir-${direction}`,
      customClass
    ]"
    :style="wrapperStyle"
    role="status"
    aria-label="Loading..."
  >
    <div
      v-for="index in count"
      :key="index"
      class="shimmer-item"
      :class="[
        `shimmer-${resolvedType}`,
        { 'shimmer-animated': animated }
      ]"
      :style="getItemStyle(index)"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /**
   * Whether the shimmer is active. If false and slot content is provided, slot is rendered.
   */
  loading: {
    type: Boolean,
    default: true
  },
  /**
   * Predefined shape/type: 'text', 'avatar', 'circle', 'button', 'card', 'rect'
   */
  type: {
    type: String,
    default: 'rect',
    validator: (val) => ['text', 'avatar', 'circle', 'button', 'card', 'rect'].includes(val)
  },
  /**
   * Width of the shimmer item (e.g. '100%', '80px', 80)
   */
  width: {
    type: [String, Number],
    default: null
  },
  /**
   * Height of the shimmer item (e.g. '16px', '48px', 48)
   */
  height: {
    type: [String, Number],
    default: null
  },
  /**
   * Border radius (e.g. '8px', '50%', 8)
   */
  borderRadius: {
    type: [String, Number],
    default: null
  },
  /**
   * Number of shimmer items to render
   */
  count: {
    type: Number,
    default: 1
  },
  /**
   * Spacing between items if count > 1
   */
  gap: {
    type: [String, Number],
    default: '10px'
  },
  /**
   * Direction of items if count > 1 ('column' or 'row')
   */
  direction: {
    type: String,
    default: 'column',
    validator: (val) => ['column', 'row'].includes(val)
  },
  /**
   * Width for the last item when type === 'text' and count > 1 (e.g. '65%')
   */
  lastLineWidth: {
    type: [String, Number],
    default: '65%'
  },
  /**
   * Whether to display the shimmering light wave animation
   */
  animated: {
    type: Boolean,
    default: true
  },
  /**
   * Wave animation speed/duration (e.g. '1.6s', '2s')
   */
  duration: {
    type: String,
    default: '1.6s'
  },
  /**
   * Base background color
   */
  bgColor: {
    type: String,
    default: '#edf2f7'
  },
  /**
   * Wave highlight color
   */
  highlightColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.65)'
  },
  /**
   * Custom CSS class applied to wrapper
   */
  customClass: {
    type: String,
    default: ''
  }
});

function formatUnit(val) {
  if (val === undefined || val === null || val === '') return undefined;
  return typeof val === 'number' ? `${val}px` : String(val);
}

const resolvedType = computed(() => {
  if (props.type === 'avatar') return 'circle';
  return props.type;
});

const defaultDimensions = computed(() => {
  switch (resolvedType.value) {
    case 'circle':
      return { width: '44px', height: '44px', borderRadius: '50%' };
    case 'avatar':
      return { width: '44px', height: '44px', borderRadius: '50%' };
    case 'button':
      return { width: '120px', height: '42px', borderRadius: '10px' };
    case 'card':
      return { width: '100%', height: '160px', borderRadius: '16px' };
    case 'text':
      return { width: '100%', height: '14px', borderRadius: '6px' };
    case 'rect':
    default:
      return { width: '100%', height: '20px', borderRadius: '8px' };
  }
});

const wrapperStyle = computed(() => {
  return {
    gap: formatUnit(props.gap)
  };
});

function getItemStyle(index) {
  const isLast = index === props.count && props.count > 1;
  const isText = resolvedType.value === 'text';

  let itemWidth = props.width
    ? formatUnit(props.width)
    : defaultDimensions.value.width;

  if (isText && isLast && !props.width) {
    itemWidth = formatUnit(props.lastLineWidth);
  }

  const itemHeight = props.height
    ? formatUnit(props.height)
    : defaultDimensions.value.height;

  const itemRadius = props.borderRadius !== null
    ? formatUnit(props.borderRadius)
    : defaultDimensions.value.borderRadius;

  return {
    width: itemWidth,
    height: itemHeight,
    borderRadius: itemRadius,
    backgroundColor: props.bgColor,
    '--shimmer-duration': props.duration,
    '--shimmer-highlight': props.highlightColor
  };
}
</script>

<style scoped>
.shimmer-wrapper {
  display: flex;
  width: 100%;
}

.shimmer-dir-column {
  flex-direction: column;
}

.shimmer-dir-row {
  flex-direction: row;
  align-items: center;
}

.shimmer-item {
  position: relative;
  overflow: hidden;
  display: block;
  flex-shrink: 0;
  background-color: #edf2f7;
  transition: opacity 0.2s ease;
}

/* Preset specific adjustments */
.shimmer-circle {
  flex-shrink: 0;
}

/* GPU Accelerated sweep wave animation */
.shimmer-animated::after {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    var(--shimmer-highlight, rgba(255, 255, 255, 0.45)) 35%,
    var(--shimmer-highlight, rgba(255, 255, 255, 0.75)) 50%,
    var(--shimmer-highlight, rgba(255, 255, 255, 0.45)) 65%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer-sweep var(--shimmer-duration, 1.6s) infinite cubic-bezier(0.4, 0, 0.2, 1);
  content: '';
  pointer-events: none;
}

@keyframes shimmer-sweep {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
