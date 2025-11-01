<template></template>

<script setup>
const props = defineProps({
  webrtc: {
    type: Object,
    required: true
  }
});

const run = (room, status, data) => {
  const action = props.webrtc.getAction('admit');

  action.setAsModeratorAction();
  action.setAttributes({
    status: data.status,
    roomId: room.id,
    peerJsId: data.peerJsId,
  });
  action.setUsers({
    peerJsId: data.peerJsId,
    status: 'waiting'
  });

  action.request();
};

defineExpose({
  run
});
</script>