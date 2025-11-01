<template>
  <svg
    :viewBox="viewBox"
    :width="size"
    :height="size"
    :fill="color"
    v-html="iconContent"
    v-if="iconContent"
  ></svg>
  <span v-else-if="loading"></span>
  <span v-else></span>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue';

  const props = defineProps({
    icon: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    viewBox: {
      type: String,
      default: '0 0 24 24'
    }
  });

  const iconContent = ref('');
  const loading = ref(false);

  const loadIcon = async () => {
    loading.value = true;
    iconContent.value = '';

    try {
      // Dynamic import from @mdi/svg
      const iconModule = await import(`@mdi/svg/svg/${props.icon}.svg`);
      const response = await fetch(iconModule.default);
      const svgContent = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const pathElement = doc.querySelector('path');

      if (pathElement) {
        iconContent.value = pathElement.outerHTML;
      } else {
        console.warn(`No path found in icon ${props.icon}`);
      }
    } catch (error) {
      console.error('Error loading icon:', error);
    } finally {
      loading.value = false;
    }
  };

  watch(() => props.icon, loadIcon);
  onMounted(loadIcon);
</script>