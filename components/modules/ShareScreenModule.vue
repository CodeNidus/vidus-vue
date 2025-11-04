<template>
  <div
    v-show="dialog"
    id="screen-sharing"
    ref="shareScreen"
  >
    <div id="screen-sharing-area">
      <div
        class="screen-share-full-screen"
        @click="fullscreen"
      >
        <Icon
          width="48"
          height="48"
          icon="fullscreen"
        />
        <div class="screen-share-full-screen-background"></div>
      </div>
      <video
        ref="video"
        id="screen-sharing-video"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Icon from "../helpers/Icon.vue";

const props = defineProps({
  webrtc: {
    type: Object,
    required: true
  }
});

const video = ref();
const dialog = ref();
const shareScreen = ref();

const open = async (room) => {
  if (!props.webrtc.userSettings.share) {
    const shareStatus = props.webrtc.People.findOne('share', true);

    if (shareStatus) {
      props.webrtc.notify('Screen Share', 'Some one use this feature now.');
      return;
    }

    props.webrtc.Media.screenShare.startShareScreen();
  } else {
    props.webrtc.Media.screenShare.stopShareScreen();
  }
};

const fullscreen  = () => {
  video.value.requestFullscreen();
}

const setActionEventListener = () => {
  document.addEventListener('onScreenShareDisplay', shareScreenDisplayToggle);
}

const clearListener = () => {
  document.removeEventListener('onScreenShareDisplay', shareScreenDisplayToggle);
};

const shareScreenDisplayToggle = (event) => {
  if (shareScreen) {
    dialog.value = event.detail?.status;
  }
};

onMounted(() => {
  setActionEventListener();
  shareScreenDisplayToggle({detail: { status: false }});
});

onUnmounted(() => {
  clearListener();
});

defineExpose({
  open,
  fullscreen,
});
</script>

<style lang="scss">
#screen-sharing {
  position: relative!important;

  #screen-sharing-area {
    position: relative;
    height: 100%;
    padding: 0 15px;

    .screen-share-full-screen {
      display: none;
    }

    &:hover {
      .screen-share-full-screen {
        display: flex;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        color: #fff;
        justify-content: center;
        align-items: center;
        font-size: 3em;
        cursor: pointer;

        svg {
          z-index: 2;
        }

        .screen-share-full-screen-background {
          position: absolute;
          z-index: 1;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: #000;
          opacity: 0.3;
        }
      }
    }

    video {
      width: 100%;
    }
  }
}
</style>
