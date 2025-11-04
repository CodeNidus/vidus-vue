<template></template>

<script setup>
const props = defineProps({
  webrtc: {
    type: Object,
    required: true
  }
});

const run = (data) => {
  const action = props.webrtc.getAction('terminate');

  action.setAsModeratorAction();
  action.request();
};

defineExpose({
  run
});
</script>