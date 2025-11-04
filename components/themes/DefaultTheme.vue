<template>
  <div>
    <slot name="actions"></slot>
    <div id="video-meeting">
      <div
        id="video-conference-room"
        :class="{
          'with-canvas': canvasEnabled,
          'with-screen-share': screenShareEnabled
        }"
      >
        <button
            v-if="isPortrait && canvasEnabled && screenShareEnabled"
            id="area-switcher"
            @click="toggleArea"
        >
          Switch
        </button>
        <div id="modules-area" ref="modulesArea">
          <slot name="canvas"></slot>
          <slot name="screenShare"></slot>
        </div>
        <div id="users-area">
          <div id="video-conference-users" ref="usersArea">
            <div
                class="user-item current-user"
                :class="{ 'room-creator': props.userSettings.isCreator , 'room-user': !props.userSettings.isCreator}"
            >
              <div v-if="props.userSettings.micDisable" class="microphone-mute">
                <Icon icon="microphone-off" />
              </div>
              <div class="user-footer-actions">
                <div
                  v-if="canEnableFaceDetect"
                  class="action-item face-detector-btn"
                  @click="faceDetector(props.userSettings, $event)"
                >
                  <Icon icon="magic-staff" />
                </div>
                <div @click="blurUserMediaBackground(!blur)" class="action-item">
                  <div v-if="!blur">
                    <Icon icon="water" />
                  </div>
                  <div v-else>
                    <Icon icon="water-off" />
                  </div>
                </div>
              </div>
              <div class="user-video">
                <div v-if="props.userSettings.camDisable" class="camera-mute">
                  <p>Camera off</p>
                </div>
                <video
                    id="video-item"
                    class="video-content video-item"
                    :data-peerId="props.userSettings.peerJsId"
                ></video>
              </div>
            </div>

            <div
                v-for="(connection, index) in connections"
                :key="'connection_' + index"
                class="user-item"
                :class="{ 'room-creator': connection.isCreator , 'room-user': !connection.isCreator }"
            >
                <div class="user-name">
                  <span>{{ connection.name }}</span>
                </div>
                <div v-if="connection.micMute" class="microphone-mute">
                  <Icon icon="microphone-off" />
                </div>
                <div class="user-footer-actions">
                  <div
                    v-if="canEnableFaceDetect"
                    class="action-item"
                    @click="faceDetector(connection, $event)"
                  >
                    <Icon icon="magic-staff" />
                  </div>
                  <div
                    v-if="props.userSettings.isCreator && !connection.micMute"
                    class="action-item microphone-unmute"
                    @click="muteUserMic(connection)"
                  >
                    [mute]
                  </div>
                </div>
                <div class="user-video">
                  <div v-if="connection.camMute" class="camera-mute">
                    <p>Camera off</p>
                  </div>
                  <video
                      v-show="connection.active"
                      :id="'remote-video-' + connection.id"
                      class="peer-content video-item"
                      :class="'peer-content-' + connection.id"
                      :data-peerid="connection.id"
                  />
                  <audio
                    autoplay
                    :id="'remote-audio-' + connection.id"
                    :data-peerid="connection.id"
                  />
                </div>
            </div>

          </div>
        </div>
      </div>
      <slot name="commandsDeck"></slot>
    </div>
    <slot name="modules"></slot>
  </div>
</template>

<script setup>
import {ref, inject, onMounted, onUnmounted, watch, computed } from "vue";
import Icon from "../helpers/Icon.vue";

const webrtc = inject('webrtc');

const props = defineProps({
  connections: {
    type: Array,
    required: true
  },
  run: {

  },
  userSettings: {
    type: Object,
    required: true
  }
});

const blur = ref(false);

const isPortrait = computed(() => {
  return window.innerHeight > window.innerWidth
});

const canEnableFaceDetect = computed(() => {
  return props.userSettings.isCreator && webrtc.can('customEmojis');
});

const blurUserMediaBackground = (status) => {
  blur.value = status
  webrtc.Media.blurBackground(status)
};

const muteUserMic = (connection) => {
  const action = webrtc.getAction('mute-user-mic');
  action.run(connection);
};

const faceDetector = (user, event) => {
  const action = webrtc.getAction('face-api');
  action.run(user, event.target);
};

const toggleArea = () => {
  if (enabledArea.value === 'modules') {
    enabledArea.value = 'users'
    modulesArea.value.style.display = 'none'
    usersArea.value.style.display = 'flex'
  } else {
    enabledArea.value = 'modules'
    modulesArea.value.style.display = 'flex'
    usersArea.value.style.display = 'none'
  }
};

const enableAreaSwitcher = () => {
  enabledArea.value = 'modules'
  usersArea.value.style.display = 'none'
};

const disableAreaSwitcher = () => {
  usersArea.value.style.display = 'flex'
};

const enabledArea = ref('modules');
const modulesArea = ref();
const usersArea = ref();
const margin = ref(10);
const ratio = ref(3 / 4); /* ratios 4:3 16:9 1:1 1:2 */
const width = ref(0);
const height = ref(0);
const canvasEnabled = ref(false);
const screenShareEnabled = ref(false);

watch([
    () => usersArea,
    () => props.connections,
    () => canvasEnabled,
    () => screenShareEnabled
  ],
  () => { resize(); },
  { deep: true }
);

const resize = () => {
  setTimeout(() => {
    if (isPortrait.value) {
      if (screenShareEnabled.value  && canvasEnabled.value) {
        enableAreaSwitcher();
      } else {
        disableAreaSwitcher();
      }
    }

    width.value = usersArea.value.offsetWidth - (margin.value * 2);
    height.value = usersArea.value.offsetHeight - (margin.value * 2);

    let i = 1;
    let max = 0;
    let minWidth = (window.innerWidth <= 600)? 240 : 360;
    let maxWidth = window.innerWidth / ((window.innerWidth <= 600)? 1.4 : 2.2);
    let phoneMinWidth = window.innerWidth / 2.6;
    let minWidthWithMargin = minWidth + (margin.value * 2);

    if (canvasEnabled.value || screenShareEnabled.value) {
      minWidth = phoneMinWidth;
    }

    while (i < window.innerWidth) {
      let area = calculateArea(i);

      if (area === false) {
        max =  (i < minWidthWithMargin)? minWidth : i - 1;
        max = (max > maxWidth)? maxWidth : max;
        break;
      }

      i++;
    }

    resizer(max);
  }, 100);
};

const calculateArea = (increment) => {
  let i = 0;
  let w = 0;
  let h = increment * ratio.value + (margin.value * 2);
  let count = usersArea.value.childElementCount;

  while (i < count) {
    if ((w + increment) > width.value) {
      w = 0;
      h = h + (increment * ratio.value) + (margin.value * 2);
    }

    w = w + increment + (margin.value * 2);
    i++;
  }

  return (h > height.value || increment > width.value)? false : increment;
};

const resizer = (_width) => {
  let count = usersArea.value.childElementCount;

  for (let i = 0; i < count; i++) {
    let element = usersArea.value.children[i];
    element.style.margin = margin.value + "px";
    element.style.width = _width + "px";
    element.style.height = (_width * ratio.value) + "px";
  }
};

const reSetCanvasAttributes = () => {
  if (!webrtc.configs.development.canvas.enable) return;

  const canvas = document.getElementById('canvas-module-canvas');
  canvas.setAttribute('height', window.innerHeight / 4);
}

const setCanvasActionEventListener = () => {
  document.addEventListener('onCanvasDisplay', receivedCanvasAction);
}
const setScreenShareEventListener = () => {
  document.addEventListener('onScreenShareDisplay', receivedScreenShareModuleEvent);
}

const receivedCanvasAction = (e) => {
  canvasEnabled.value = (e.detail.show);
}

const receivedScreenShareModuleEvent = (e) => {
  screenShareEnabled.value = (e.detail.status);
}

onMounted(() => {
  resize();
  setCanvasActionEventListener();
  setScreenShareEventListener();
  reSetCanvasAttributes();

  window.addEventListener("resize", resize);
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
});
</script>

<style lang="scss">
#video-meeting {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 60px 20px;
  gap: 20px;

  #video-conference-room {
    position: relative;
    display: flex;
    flex: 1;
    border-radius: 10px;
    gap: 20px;
    max-height: 100%;
    max-width: 100%;

    @media only screen and (max-width: 600px) {
      flex-direction: column;
    }

    #area-switcher {
      position: absolute;
      z-index: 1000;
      bottom: 25px;
      right: 0;
    }

    &.with-canvas:not(.with-screen-share) {
      #modules-area {
      //  height: 33%;
      }

    }

    &.with-canvas,
    &.with-screen-share {
      #modules-area {
        display: flex;
      }

      #users-area {
        @media only screen and (max-width: 600px) {
          align-items: flex-start!important;
        }

        #video-conference-users {
          align-content: flex-start!important;

          @media only screen and (max-width: 600px) {
            flex-wrap: nowrap!important;
            justify-content: flex-start!important;
          }
        }
      }
    }

    &.with-canvas.with-screen-share {
      #users-area {
        #video-conference-users {
          align-content: flex-start!important;

          @media only screen and (max-width: 600px) {
            flex-wrap: wrap!important;
            justify-content: flex-start!important;
          }
        }
      }
    }

    #modules-area {
      width: auto;
      flex-direction: column;

      @media only screen and (max-width: 600px) {
        width: unset;
      }

      #screen-sharing {
        flex: 2;
        width: 60vw;
        background: #000;
        opacity: 0.8;
        border-radius: 10px;
        margin-bottom: 15px;

        @media only screen and (max-width: 600px) {
          width: unset;
        }

        video {
          padding: 15px 0;
        }
      }

      #canvas-module {
        width: 60vw;
        background: #E2E8F0;
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 10px;
        font-size: 16px;

        @media only screen and (max-width: 600px) {
          width: unset;
        }

        canvas {
          width: 100%;
        }
      }
    }

    #users-area {
      display: flex;
      flex: 1;
      width: 33vw;

      @media only screen and (max-width: 600px) {
        width: unset;
        overflow: scroll;
      }

      #video-conference-users {
        overflow: scroll;
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: center;
        align-items: center;
        vertical-align: middle;

        @media only screen and (max-width: 960px) {
          align-content: flex-start!important;
        }

        @media only screen and (max-width: 600px) {
          //flex-wrap: wrap !important;
          //justify-content: center !important;
        }

        .user-item {
          position: relative;
          vertical-align: middle;
          align-self: center;
          border-radius: 10px;
          overflow: hidden;
          display: inline-block;
          animation: show 0.4s ease;
          background: #333;

          &.room-creator {
            order: 1;
          }

          &.current-user {
            order: 2;
          }

          &.room-user {
            order: 3;
          }

          &:hover:after {
            content: ' ';
            position: absolute;
            z-index: 1;
            top: 0;
            width: 100%;
            height: 100%;
            background: #000;
            opacity: 0.3;
          }

          &:hover {
            .microphone-mute,
            .microphone-unmute,
            .user-footer-actions {
              display: inline-block;
            }
          }

          @media only screen and (max-width: 600px) {
            flex: 0 0 auto;
          }

          .user-name {
            position: absolute;
            z-index: 3;
            left: 0;
            bottom: 0;
            display: inline-block;
            color: #fff;
            padding: 5px 10px;
            overflow: hidden;
            border-top-right-radius: 8px;
            border-bottom-left-radius: 8px;

            span {
              position: relative;
              z-index: 1;
            }

            &:after {
              content: ' ';
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              opacity: 0.6;
              background: #000;
            }
          }

          .user-footer-actions {
            display: none;
            position: absolute;
            z-index: 3;
            right: 15px;
            bottom: 15px;
            color: #fff;

            .action-item {
              cursor: pointer;
            }
          }

          .microphone-mute {
            position: absolute;
            z-index: 5;
            display: none;
            color: #fff;
            top: 25px;
            right: 25px;

            @media only screen and (max-width: 600px) {
              top: 10px;
              right: 10px;
            }

            svg {
              width: 32px;
              height: 32px;

              @media only screen and (max-width: 600px) {
                width: 20px;
                height: 20px;
              }
            }
          }

          .microphone-unmute {
            position: absolute;
            z-index: 5;
            display: none;
            color: #fff;
            cursor: pointer;
            bottom: 25px;
            right: 25px;
          }

          .user-video {

            video {
              position: absolute;
              z-index: 1;
              height: 100%;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .camera-mute {
              position: absolute;
              z-index: 4;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              color: #fff;
              background: #333;
            }

            canvas {
              z-index: 2;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}

@keyframes show {
  0% {
    opacity: 0;
    transform: scale(0.4) translateY(20px);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

</style>
