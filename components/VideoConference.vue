<template>
  <div id="video-conference">
    <component
      v-if="themeReady && isReady"
      v-show="roomIsValid"
      :is="themeLayout"
      :connections="connections"
      :userSettings="userSettings"
    >
      <template v-slot:modules>
        <ChatModule
          :ref="(obj) => setModule('chat', obj)"
         :webrtc="webrtc"
        />

        <PeopleModule
          :ref="(obj) => setModule('people', obj)"
          :webrtc="webrtc"
          :waitingList="waitingList"
        />

        <RecordScreenModule
          :ref="(obj) => setModule('record', obj)"
          :webrtc="webrtc"
        />
      </template>
      <template v-slot:canvas>
        <CanvasModule
          v-if="webrtc.configs.development.canvas.enable"
          :ref="(obj) => setModule('canvas', obj)"
          :room="room"
          :webrtc="webrtc"
        />
      </template>
      <template v-slot:screenShare>
        <ShareScreenModule
            :ref="(obj) => setModule('screen', obj)"
            :webrtc="webrtc"
        />
      </template>
      <template v-slot:actions>
        <VideoConferenceActions
          ref="actions"
          v-if="themeReady && isReady"
          :room="room"
          :webrtc="webrtc"
          :connections="connections"
          :userSettings="userSettings"
        />
      </template>
      <template v-slot:commandsDeck>
        <CommandsDeckModule
            :userSettings="userSettings"
            @onOpenModule="openModule"
            @onRoomLeft="leftTheRoom"
        />
      </template>
    </component>
  </div>
</template>

<script setup>
import { inject, shallowRef, ref, nextTick, onBeforeUnmount } from "vue";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-converter";

import VideoConferenceActions from "./VideoConferenceActions.vue";
import ChatModule from "./modules/ChatModule.vue";
import PeopleModule from "./modules/PeopleModule.vue";
import CanvasModule from "./modules/CanvasModule.vue";
import ShareScreenModule from "./modules/ShareScreenModule.vue";
import RecordScreenModule from "./modules/RecordScreenModule.vue";
import CommandsDeckModule from "./modules/CommandsDeckModule.vue";

const events = ref();
const webrtc = inject('webrtc');

const emit = defineEmits([
    'onSocketConnectionFailed',
    'onPeerJsConnectionFailed',
    'onCloseConference',
    'onAuthorizeRoomInvalid',
    'onSetWaitingStatus',
    'onConnectionInitialed',
]);

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  devices: {
    type: Object,
    required: true
  },
  camDisable: {
    type: Boolean,
    required: true,
    default: false
  },
  micDisable: {
    type: Boolean,
    required: true,
    default: false
  }
});

const actions = ref();
const modules = ref({});

const room = ref(null);
const token = ref(null);
const loading = ref(false);
const themeReady = ref(false);
const isReady = ref(false);
const roomIsValid = ref(true);
const connections = ref([]);
const waitingList = ref([]);
const userSettings = ref({
  isCreator: false,
  share: false,
});
const themeLayout = shallowRef(null);

const setModule = (name, reference) => {
  modules.value[name] = reference;
}

const setListeners = () => {
  let eventHandlers = {
    'onRoomAdmitWait': eventHandlerWaitUntilHostAdmit,
    'onRoomJoined': eventHandlerConnectToRoomSuccess,
    'onPeerJsConnectionFailed': eventHandlerPeerJsConnectionFailed,
    'onRoomInvalid': invalidRoom,
    'onTerminateConference': leftTheRoom,
  };

  events.value = new Map();

  if (webrtc.isMobileDevice()) {
    eventHandlers = {
      ...eventHandlers,
      'visibilitychange': checkBrowserWindowVisibility
    };
  }

  Object.entries(eventHandlers).forEach(([eventName, handler]) => {
    document.addEventListener(eventName, handler);
    events.value.set(eventName, handler);
  });
}

const removeListeners = () => {
  events.value.forEach((handler, eventName) => {
    document.removeEventListener(eventName, handler);
  });
}

const initialize = async (roomItem = null, tokenItem = null) => {
  room.value = roomItem;
  token.value = tokenItem;
  loading.value = true;
  isReady.value = false;
  roomIsValid.value = true;
  connections.value = [];
  waitingList.value = [];

  if(!token.value) {
    console.log('Connection is not established with server.')
    return;
  }

  if(!room.value || !room.value.id) {
    console.log('Please set the room id for joining.')
    return;
  }

  userSettings.value = Object.assign({
    camDisable: props.camDisable,
    micDisable: props.micDisable,
  }, userSettings.value);

  webrtc.setup({
    options: {
      name: props.name,
      roomId: room.value.id,
      localVideoRef: 'video-item',
      remoteVideoRef: 'remote-video',
      remoteAudioRef: 'remote-audio',
      resolution: props.devices.resolution
    },
    connections: connections.value,
    waitingList: waitingList.value,
    userSettings: userSettings.value,
  });

  try {
    await webrtc.openConnection(token.value);

    webrtc.initialPeerJs(token.value).then(async (peerJsId) => {
      webrtc.Room.join(room.value.id,{
        name: props.name
      });
    }).catch((error) => {
      emit('onPeerJsConnectionFailed');
    })
  } catch (error) {
    emit('onSocketConnectionFailed');
  }
}

const leftTheRoom = async () =>  {
  let data = {
    username: props.name,
  };

  webrtc.Room.left(data).then(() => {
    emit('onCloseConference');
  });
}

const invalidRoom = (error) => {
  roomIsValid.value = false;
  emit('onAuthorizeRoomInvalid', error.detail);
}

const setThemeLayout = async () => {
  const theme = webrtc.configs.theme;
  const themeName = theme.toLowerCase().charAt(0).toUpperCase();

  let themeItem = {};

  if (webrtc.themes.hasOwnProperty(theme)) {
    themeItem.default = webrtc.themes[theme];
  } else {
    try {
      themeItem = await loadThemeLayout(themeName);
    } catch(error) {
      themeItem = await loadThemeLayout('Default');
    }
  }

  themeReady.value = true;
  themeLayout.value = themeItem.default;
}

const loadThemeLayout = async (themeName) => {
  let layout = async () => import('./themes/' + themeName + 'Theme.vue');
  return await layout();
}

const openModule = (name) =>  {
  modules.value[name].open(room.value);
}

const eventHandlerConnectToRoomSuccess = (data) =>  {
  loading.value = false;
  isReady.value = true;

  emit('onSetWaitingStatus', true);
  emit('onConnectionInitialed', data.detail);

  if(data.detail.waitList && data.detail.waitList.length > 0) {
    waitingList.value = data.detail.waitList;
  }

  nextTick(async () => {
    await webrtc.startStreamUserMedia(props.devices);
    webrtc.Room.notifyJoinSuccess(room.value.id);
  });
}

const eventHandlerWaitUntilHostAdmit = () => {
  emit('onSetWaitingStatus', true);
}

const eventHandlerPeerJsConnectionFailed = (detail) => {
  emit('onPeerJsConnectionFailed');
}

/**
 * Fix mobile device browser minimize stream bug
 */
const checkBrowserWindowVisibility = (e) => {
  if (document.visibilityState === 'hidden') {
    webrtc.Media.sendUserMediaMuteStatusByDataConnection(true, true);
  } else {
    webrtc.Media.sendUserMediaMuteStatusByDataConnection(
      userSettings.value.camDisable,
      userSettings.value.micDisable
    );
  }
}

onBeforeUnmount(() => {
  leftTheRoom();
  removeListeners();
});

setThemeLayout();
setListeners();

defineExpose({
  initialize
});
</script>

<style lang="scss">
@forward "../assets/scss/DefaultThemeStyle.scss";
</style>
