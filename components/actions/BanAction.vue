<template></template>

<script setup>
const props = defineProps({
  webrtc: {
    type: Object,
    required: true
  }
});

const run = (data) => {
  const action = props.webrtc.getAction('ban');

  action.setAsModeratorAction();
  action.setAttributes({
    ban: {
      name: data.name,
      peerJsId: data.peerJsId
    }
  })

  action.request();
};

defineExpose({
  run
});
</script>