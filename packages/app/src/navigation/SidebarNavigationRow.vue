<template>
  <Tooltip
    placement="right"
    :disabled="isNavBarExpanded"
    :distance="8"
  >
    <div
      :class="active
        ? 'before:(bg-indigo-300 scale-x-100 transition-colors) cursor-default'
        : 'before:(scale-x-0 transition-transform bg-gray-300)'"
      class="rounded-md flex
        h-40px
        my-16px
        w-full
        min-w-40px
        relative
        items-center
        group
        focus-visible:outline-none
        before:(rounded-r-md h-40px mr-4px text-transparent transform origin-left w-4px duration-300 content-open-square) hover:before:scale-x-100 "
      :data-selected="active"
    >
      <component
        :is="icon"
        v-if="active"
        size="24"
        stroke-color="indigo-300"
        fill-color="indigo-700"
        class="flex-shrink-0 h-24px m-12px w-24px children:transition children:duration-300"
      />
      <component
        :is="icon"
        v-else
        size="24"
        stroke-color="gray-500"
        fill-color="gray-900"
        hover-stroke-color="gray-300"
        hover-fill-color="gray-800"
        focus-stroke-color="gray-300"
        focus-fill-color="gray-800"
        interactive-colors-on-group
        class="flex-shrink-0 h-24px m-12px w-24px children:transition children:duration-300"
      />
      <span
        :class="[active ? 'text-indigo-300' : 'text-gray-500 group-hocus:text-gray-300']"
        class="ml-8px transition-colors duration-300 truncate"
      >
        {{ name }}
      </span>
      <span
        v-if="badge && !showDot"
        :aria-label="badge.label"
        class="rounded-md font-medium text-white p-4px transition-opacity z-1"
        :class="[badgeVariant, badgeColorStyles[badge.status], {'opacity-0': transitioning}]"
      >
        {{ badge.value }}
      </span>
      <div
        v-else-if="badge && showDot"
        :class="[{'opacity-0': transitioning}, dotClass]"
        :aria-label="badge.label"
        data-cy="debug-badge-dot"
      />
    </div>
    <template #popper>
      {{ name }}
    </template>
  </Tooltip>
</template>

<script lang="ts" setup>
import { computed, FunctionalComponent, SVGAttributes, watch, ref } from 'vue'
import Tooltip from '@packages/frontend-shared/src/components/Tooltip.vue'
import { promiseTimeout } from '@vueuse/core'
import { useI18n } from '@cy/i18n'
import { useRoute } from 'vue-router'

export type Badge = { value: string, status: 'success' | 'failed' | 'error', label: string }

const { t } = useI18n()
const route = useRoute()

const props = withDefaults(defineProps <{
  icon: FunctionalComponent<SVGAttributes>
  name: string
  // Currently active row (generally the current route)
  active?: boolean
  isNavBarExpanded: boolean
  badge?: Badge
}>(), {
  active: false,
  badge: undefined,
})

const badgeVariant = computed(() => {
  const classes: string[] = []

  if (props.isNavBarExpanded) {
    classes.push('ml-16px', 'h-20px', 'text-sm', 'leading-3')
  } else {
    classes.push('absolute', 'outline-gray-1000', 'outline-2px', 'outline', 'bottom-0', 'text-xs', 'h-16px', 'leading-2')

    // Keep failure count from overflowing sidebar (#25662)
    if ((props.badge.status === 'failed' || props.badge.status === 'error') && props.badge.value.length >= 3) {
      classes.push('right-4px')
    } else {
      // Anything else should left-align and overflow sidebar if needed
      classes.push('left-36px')
    }
  }

  return classes
})

const badgeColorStyles = {
  'success': 'bg-jade-500',
  'failed': 'bg-error-500',
  'error': 'bg-warning-500',
}

const showDot = computed(() => {
  return props.badge.value === t('sidebar.debug.new') && !props.isNavBarExpanded
})

const dotClass = computed(() => {
  const dotColor = route.name === 'SpecRunner' ? 'bg-gray-800' : 'bg-jade-500'

  return `${dotColor}
  w-10px 
  h-10px 
  relative 
  -bottom-7px 
  -left-30px 
  flex-shrink-0
  z-1 
  border-2px 
  border-gray-1000 
  rounded-full`
})

const transitioning = ref(false)

// Badge is either absolutely positioned or relative. Since the navbar expands with an animation,
// the badge needs to animate as well, otherwise it pops into place before the sidebar is finished animating
watch(() => props.isNavBarExpanded, async () => {
  if (props.badge) {
    transitioning.value = true
    await promiseTimeout(125)
    transitioning.value = false
  }
})

</script>
