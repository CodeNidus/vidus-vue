<template>
  <div class="command-deck">
    <div class="deck-btn">
      <DeckBtn
        label="Left the room"
        :icons="[{ icon: 'phone', status: true }]"
        variant="danger"
        @click.prevent="leftRoom"
      />

      <DeckBtn
        label="Terminate"
        :icons="[{ icon: 'power', status: true }]"
        variant="danger"
        is-creator
        @click.prevent="terminate"
      />

      <DeckBtn
        :label="!props.userSettings.camDisable? 'Turn on camera' : 'Turn off camera'"
        :icons="[
          { icon: 'video', status: !props.userSettings.camDisable },
          { icon: 'video-off', status: props.userSettings.camDisable },
          ]"
        :set-switch="props.userSettings.camDisable"
        @click.prevent="muteDevice('camera')"
      />

      <DeckBtn
        :label="!props.userSettings.micDisable? 'Turn on microphone' : 'Turn off microphone'"
        :icons="[
          { icon: 'microphone', status: !props.userSettings.micDisable },
          { icon: 'microphone-off', status: props.userSettings.micDisable },
          ]"
        :set-switch="props.userSettings.micDisable"
        @click.prevent="muteDevice('microphone')"
      />

      <DeckBtn
        label="Chat"
        :class="{ notify: props.userSettings.newMessage }"
        :icons="[{ icon: 'chat-processing', status: true }]"
        @click.prevent="openModule('chat')"
      />

      <DeckBtn
        label="People"
        :class="{ notify: props.userSettings.newAdmitRequest }"
        :icons="[{ icon: 'account-multiple', status: true }]"
        @click.prevent="openModule('people')"
      />

      <DeckBtn
        v-if="webrtc.configs.development.canvas.enable"
        label="Canvas"
        :icons="[{ icon: 'file-document', status: true }]"
        :set-switch="switcher?.canvas"
        is-creator
        @click.prevent="openModule('canvas')"
      />

      <DeckBtn
        :label="!props.userSettings.share? 'Enable screen share' : 'Disable screen share'"
        :icons="[{ icon: 'monitor-share', status: true }]"
        :set-switch="props.userSettings.share"
        disable-on-phone
        @click.prevent="openModule('screen')"
      />

      <DeckBtn
        :label="!props.userSettings.record? 'Start record' : 'Stop record'"
        :icons="[
          { icon: 'record-circle', status: !props.userSettings.record },
          { icon: 'stop', status: props.userSettings.record },
          ]"
        variant="danger"
        is-creator
        disable-on-firefox
        @click.prevent="openModule('record')"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import DeckBtn from "../helpers/DeckBtn.vue";

const emit = defineEmits([
  'onRoomLeft',
  'onOpenModule'
]);

const webrtc = inject('webrtc');

const props = defineProps({
  userSettings: {
    type: Object,
    required: true
  }
});

const switcher = ref({});

const muteDevice = (device) => {
  if(device === 'camera') {
    webrtc.Media.muteCamera()
  } else {
    webrtc.Media.muteMicrophone()
  }
};

const terminate = () => {
  const action = webrtc.getAction('terminate');

  action.setAsModeratorAction();
  action.run();
};

const openModule = (module) => {
  switcher.value[module] = !switcher.value[module];
  emit('onOpenModule', module);
};

const leftRoom = () => {
  emit('onRoomLeft');
};
</script>

<style scoped lang="scss">
@import '../../assets/scss/Colors';

.command-deck {
  display: flex;
  position: fixed;
  z-index: 999;
  left: 0;
  bottom: 0;
  width: 100%;
  justify-content: center;
  background: $color-neutral-800;

  .deck-btn {
    padding: 10px;

    .btn {
      border: 0;

      &.btn-action {
        padding: 8px 12px;

        @media screen and (max-width: 480px) {
          padding: 8px 8px;

          svg {
            display: flex;
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    .btn-danger {
      background: $color-red-500;
    }

    .btn-default {
      color: #464546;
      background: #cccccc;

      &:hover {
        color: #161616;
      }

      &.disabled,
      &:disabled {
        color: #cccccc;
        background: #3c4043;
      }
    }
  }
}
</style>

