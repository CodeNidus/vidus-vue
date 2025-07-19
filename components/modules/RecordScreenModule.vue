<template>
  <div id="recording-screen" ref=recordingScreen>
    <div id="screen-record-control">
      <div class="recording-icon"></div>
      <div class="recording-text hide" ref="recordingText">Recording</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  webrtc: {
    type: Object,
    required: true
  }
})

const recordingScreen = ref();
const recordingText = ref();

const setActionEventListener = () => {
  window.addEventListener('onScreenRecordModule', screenRecordModuleAction);
}

const clearListener = () => {
  window.removeEventListener('onScreenRecordModule', screenRecordModuleAction);
}

const open = async (room) => {
  if (!props.webrtc.userSettings.record) {
    if (!props.webrtc.userSettings.isCreator) {
      props.webrtc.notify('Screen Record', 'Only room creator can record meeting.')
      return
    }


    props.webrtc.Media.screenRecord.startRecord().catch(error => {

    })

  } else {
    props.webrtc.Media.screenRecord.stopRecord()
  }
}

const screenRecordModuleAction = (event) => {
  if (recordingScreen) {
    recordingScreen.value.style.display = event.detail?.status? 'block' : 'none';

    if (event.detail?.status) {
      setTimeout(() => {
        recordingText.value.classList.remove('hide')
      }, 100)

      setTimeout(() => {
        recordingText.value.classList.add('hide')
      }, 5000)
    }
  }
}

const screenIsRecording = () => {
  if (props.webrtc.Media.screenRecord.isRecordingScreen() && recordingScreen) {
    recordingScreen.value.style.display = 'block'
  }
}

onMounted(() => {
  setActionEventListener()
  screenIsRecording()
})

onUnmounted(() => {
  clearListener()
})

defineExpose({
  open,
})
</script>

<style lang="scss">
#recording-screen {
  display: none;
  position: relative!important;
  animation: pulse 4s infinite;

  #screen-record-control {
    position: relative;
    display: flex;
    padding: 0 15px;
    gap: 5px;
    align-items: center;

    .recording-icon {
      width: 10px;
      height: 10px;
      background: red;
      border: 5px solid red;
      border-radius: 50%;
    }

    .recording-text {
      width: 100px;
      font-weight: bold;
      overflow: hidden;
      transition: width 0.4s cubic-bezier(0.65, 0, 0.35, 1);

      &.hide {
        width: 0;
      }
    }

    &:hover {
      .recording-text {
        width: 100px!important;
      }
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }

}
</style>
