<template>
  <a
    v-if="checkPermission()"
    class="btn btn-small btn-action"
    :class="btnClass"
  >
    <span class="tooltip top">
      {{ label }}
    </span>

    <Icon
      v-for="(icon, index) in icons"
      :key="index"
      v-show="icon.status"
      :icon="icon.icon"
    />
  </a>
</template>

<script setup>
  import { computed, inject } from "vue";
  import Icon from "./Icon.vue";

  const webrtc = inject('webrtc');
  const props = defineProps({
    class: {
      type: [Object, String],
      default: {}
    },
    icons: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'default',
    },
    setSwitch: {
      type: Boolean,
      default: false,
    },
    isCreator: {
      type: Boolean,
      default: false,
    },
    isFirefox: {
      type: Boolean,
      default: false,
    },
    disableOnFirefox: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
    disableOnPhone: {
      type: Boolean,
      default: false,
    },
  });

  const btnClass = computed(() => {
    return [
      props.class,
      `btn-${props.variant}`,
      { 'disabled': props.setSwitch },
    ];
  });

  const checkPermission = () => {
    if (props.isCreator && !webrtc.userSettings.isCreator)
      return false;

    if (props.isFirefox && !webrtc.isFirefox())
      return false;

    if (props.disableOnFirefox && webrtc.isFirefox())
      return false;

    if (props.isMobile && !webrtc.isMobileDevice())
      return false;

    if (props.disableOnPhone && webrtc.isMobileDevice())
      return false;

    return true;
  };
</script>
