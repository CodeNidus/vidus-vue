<template>
<div id="videoConferenceActions">

  <FaceApiAction
    :ref="(obj) => { setAction('face-api', obj) }"
    :room="room"
    :webrtc="webrtc"
    :userSettings="userSettings"
  />

  <MuteUserMicAction
    :ref="(obj) => { setAction('mute-user-mic', obj) }"
    class="action"
    :room="room"
    :webrtc="webrtc"
  />

  <AdmitAction
    :ref="(obj) => { setAction('admit', obj) }"
    class="action"
    :webrtc="webrtc"
  />

  <BanAction
    :ref="(obj) => { setAction('ban', obj) }"
    class="action"
    :webrtc="webrtc"
  />

  <TerminateAction
    :ref="(obj) => { setAction('terminate', obj) }"
    class="action"
    :webrtc="webrtc"
  />

  <component
    v-for="(action, index) in filteredActions"
    :key="index"
    :is="action.view"
    :ref="(obj) => { setAction(index, obj) }"
    class="action"
    :room="room"
    :webrtc="webrtc"
    :userSettings="userSettings"
  />

</div>
</template>

<script setup>
import { ref } from "vue";

import FaceApiAction from "./actions/FaceApiAction.vue";
import MuteUserMicAction from "./actions/MuteUserMicAction.vue";
import AdmitAction from "./actions/AdmitAction.vue";
import BanAction from "./actions/BanAction.vue";
import TerminateAction from "./actions/TerminateAction.vue";

const props = defineProps({
  webrtc: {
    type: Object,
    required: true
  },
  room: {
    type: Object,
    required: true
  },
  userSettings: {
    type: Object,
    required: true
  },
  connections: {
    type: Array,
    required: true
  },
});

const filteredActions = ref({});

for (const [key, value] of Object.entries(props.webrtc.actions)) {
  if (!value?.category?.includes(['canvas'])) {
    filteredActions.value[key] = value;
  }
};

const setAction = (name, object) => {
  props.webrtc.registerActionReference(name, object);
};
</script>

<style lang="scss">
#videoConferenceActions {
  width: 100%;

  .action {
    position: absolute;
    z-index: 999;
  }
}
</style>
