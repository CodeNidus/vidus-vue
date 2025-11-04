<template>
  <div class="webrtc-section">
    <div class="video-installation" v-if="!initializeVideo">
      <div id="room-join" class="card">
        <div v-if="!token">
          Please wait, connecting...
        </div>
        <div v-else-if="!startConnecting" class="connection-settings">
          <div v-if="permissionsState?.handleDenied">
            <div v-if="!permissionsState.camera && !permissionsState.microphone">
              <div>
                <p>
                  Click on button to grant camera & microphone permissions.<br/>
                  Please click on <strong>Allow</strong> button to grant access permissions.
                </p>
              </div>
              <button
                  class="btn"
                  @click="grantPermissions"
              >
                Request Permissions
              </button>
            </div>
            <div v-else class="introduction">
              <div class="introduction-title">Please restart your browser camera and microphone permissions.</div>
              <p class="introduction-text">
                To reset camera and microphone permissions:<br/><br/>
                1. Click the lock or information icon in the address bar.<br/>
                2. Go to "Site settings" or "Permissions".<br/>
                3. Reset the camera and microphone permissions.<br/>
                4. Refresh this page and grant access when prompted.<br/>
              </p>
            </div>
          </div>

          <div v-else>
            <div class="d-flex info">
              <div class="text-field">
                <label>Name</label>
                <input
                    v-model="name"
                    type="text"
                />
              </div>
              <button
                  :disabled="!name || (permissionsState?.camera || permissionsState?.microphone)"
                  class="btn-join mx-2"
                  @click="joinToRoom"
              >
                Join
              </button>
            </div>

            <div class="device-setting">
              <button
                  class="d-flex btn-small"
                  :class="{ disabled: camDisable }"
                  @click="camDisable = !camDisable"
              >
                <Icon
                  v-show="!camDisable"
                  icon="video"
                />

                <Icon
                  v-show="camDisable"
                  icon="video-off"
                />
              </button>

              <button
                  class="d-flex btn-small"
                  :class="{ disabled: micDisable }"
                  @click="micDisable = !micDisable"
              >
                <Icon
                  v-show="!micDisable"
                  icon="microphone"
                />

                <Icon
                  v-show="micDisable"
                  icon="microphone-off"
                />

              </button>

              <div class="select-field">
                <label>Resolution</label>
                <select
                    v-model="resolution"
                >
                  <option value="qvga" selected>QVGA</option>
                  <option value="vga">VGA</option>
                  <option value="hd">HD</option>
                  <option value="fhd">Full HD</option>
                </select>
              </div>
            </div>

            <div class="divider"></div>

            <div class="devices">
              <div class="select-field">
                <label>Camera</label>
                <select v-model="cameraDevice">
                  <option
                      v-for="(camera, index) in cameras"
                      :key="'camera_device_' + index"
                      :value="camera.deviceId"
                  >
                    {{ camera.label }}
                  </option>
                </select>
              </div>

              <div class="select-field">
                <label>Microphone</label>
                <select v-model="microphoneDevice">
                  <option
                      v-for="(microphone, index) in microphones"
                      :key="'microphone_device_' + index"
                      :value="microphone.deviceId"
                  >
                    {{ microphone.label }}
                  </option>
                </select>
              </div>

              <div v-if="speakerEnable">
                <label>Speaker</label>
                <select v-model="speakerDevice">
                  <option
                      v-for="(speaker, index) in speakers"
                      :key="'speaker_device_' + index"
                      :value="speaker.deviceId"
                  >
                    {{ speaker.label }}
                  </option>
                </select>
              </div>
            </div>

          </div>
        </div>
        <div v-else>
          <div v-if="roomIsValid && !connectionFailed">
            <p v-if="!waiting">Please wait for establishing a connection...</p>
            <p v-else>Please wait until host admit you to join room...</p>
          </div>
          <div v-else class="error">
            <template v-if="roomIsValid">
              <template v-if="socketFailed">
                Sorry! apparently server doesn't respond, please contact with administration.
              </template>
              <template v-else-if="peerJsFailed">
                Sorry! apparently server doesn't respond, please contact with administration.
              </template>
              <template v-else>
                Sorry! apparently server doesn't respond, please try again.
              </template>
            </template>
            <template v-else>
              <template v-if="errorMessage">
                {{ errorMessage }}
              </template>
              <template v-else>
                The desired room was not found! Please try to connect to an available room.
              </template>
            </template>
            <a href="#" @click.prevent="closeConference" class="mx-2">Back</a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="prepearInitializing">
      <VideoConference
          v-show="initializeVideo"
          ref="conference"
          :name="name"
          :devices="{
            camera: cameraDevice,
            microphone: microphoneDevice,
            speaker: speakerDevice,
            resolution: resolution
          }"
          :camDisable="camDisable"
          :micDisable="micDisable"
          :waiting="waiting"
          @onConnectionInitialed="connectionInitialed"
          @onAuthorizeRoomInvalid="authorizeRoomInvalid"
          @onSocketConnectionFailed="socketConnectionFailed"
          @onPeerJsConnectionFailed="peerJsConnectionFailed"
          @onCloseConference="closeConference"
          @onSetWaitingStatus="setWaitingStatus"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, inject, watch, onMounted, nextTick} from "vue";
import VideoConference from "./VideoConference.vue";
import Icon from "./helpers/Icon.vue";

const props = defineProps({
  roomId: {
    type: String,
    default: ''
  },
});

const emit = defineEmits([
  'onCloseConference'
]);

const webrtc = inject('webrtc');

const conference = ref();
const speakerEnable = ref(false);
const prepearInitializing = ref(false);
const initializeVideo = ref(false);
const token = ref();
const name = ref('');
const camDisable = ref(false);
const micDisable = ref(false);
const resolution = ref('qvga');
const waiting = ref(false);
const startConnecting = ref(false);
const roomIsValid = ref(true);
const socketFailed = ref(false);
const peerJsFailed = ref(false);
const connectionFailed = ref(false);
const errorMessage = ref();

const permissionsState = ref();
const cameras = ref();
const microphones = ref();
const speakers = ref();
const cameraDevice = ref();
const microphoneDevice = ref();
const speakerDevice = ref();

watch(cameras, (value) => {
  if (Array.isArray(value) && value.length > 0) {
    cameraDevice.value = value[0].deviceId;
  }
});

watch(microphones, (value) => {
  if (Array.isArray(value) && value.length > 0) {
    microphoneDevice.value = value[0].deviceId;
  }
});

watch(speakers, (value) => {
  if (Array.isArray(value) && value.length > 0) {
    speakerDevice.value = value[0].deviceId;
  }
});

const joinToRoom = () => {
  const room = {
    id: props.roomId
  };

  startConnecting.value = true;
  prepearInitializing.value = true;

  nextTick(() => {
    conference.value.initialize(room, token.value);
  });
};

const connectionInitialed = () => {
  connectionFailed.value = false;
  initializeVideo.value = true;
};

const authorizeRoomInvalid = (error) => {
  errorMessage.value = error;
  roomIsValid.value = false;
};

const socketConnectionFailed = () => {
  connectionFailed.value = true;
  socketFailed.value = true;
};

const peerJsConnectionFailed = () => {
  connectionFailed.value = true;
  peerJsFailed.value = true;
};

const closeConference = () => {
  initializeVideo.value = false;
  name.value = '';
  camDisable.value = false;
  micDisable.value = false;
  resolution.value = 'qvga';
  waiting.value = false;
  startConnecting.value = false;
  roomIsValid.value = true;
  socketFailed.value = false;
  peerJsFailed.value = false;
  connectionFailed.value = false;

  emit('onCloseConference');
};

const setWaitingStatus = (status) => {
  waiting.value = status;
};

const grantPermissions = async () => {
  permissionsState.value = await webrtc.Media.grantPermissions();
  cameras.value = permissionsState.value.getCameras();
  microphones.value = permissionsState.value.getMicrophones();
  speakers.value = permissionsState.value.getSpeakers();
};

onMounted(async () => {
  token.value =  await webrtc.getUserToken(false);
  await grantPermissions();
});

</script>

<style lang="scss">
.video-installation {
  padding:10px;
}

#room-join {
  width: fit-content;
  margin: 25px auto;

  @media screen and (max-width: 480px) {
    width: auto;
  }

  .connection-settings {
    padding: 25px;

    @media screen and (max-width: 480px) {
      padding: 0;
    }

    .text-field {
      input {
        @media screen and (max-width: 480px) {
          min-width: 200px;
        }
      }
    }

  }

  .info {
    align-items: flex-end;

    @media screen and (max-width: 480px) {
      justify-content: space-between;
    }
  }

  .device-setting {
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: end;

    button {
      margin-right: 5px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .devices {
    div {
      margin-bottom: 5px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  label {
    @media screen and (max-width: 480px) {
      width: 80px;
    }
  }

  .btn-join {
    margin: 0 0 0 25px;

    @media screen and (max-width: 480px) {
      margin: 0;
    }
  }
}
</style>
