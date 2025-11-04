<template>
  <Sidebar
    v-model="dialog"
    id="people-module"
    title="Peoples"
  >
    <div class="people" ref="people">
      <div
        v-for="(user, index) in usersMenu"
        :key="index"
        class="user-item"
      >
        <span>{{ user.name }}</span>
        <div v-if="index > 0">
          <Icon
            icon="dots-vertical"
            class="dropdown-dots bi bi-three-dots-vertical"
            @click="toggleMenu(user)"
          />

          <div
            ref="dropdown"
            class="dropdown-content"
            :class="{ show: user.openMenu }"
          >
            <h3>{{ user.name }}</h3>
            <ul>
              <li v-if="isCreator" @click="banUser(user)">Ban user</li>
              <li v-if="isCreator && !user.micMute" @click="muteMic(user)">Mute user microphone</li>
            </ul>
          </div>
        </div>
      </div>
      <div
        v-if="props.waitingList.length > 0"
        v-show="showWaitList"
        class="waitingList"
      >
        <hr/>
        <div
          v-for="(waiting, index) in props.waitingList"
          :key="index"
          class="waitingList-item"
        >
          <span>{{ waiting.name }}</span>
          <div>
            <span
              class="btn"
              @click="responseWaiting(true, waiting, index)"
            >
              approve
            </span>
            <span
              class="btn"
              @click="responseWaiting(false, waiting, index)"
            >
              denied
            </span>
          </div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script setup>
import {ref, computed, watch, nextTick, onUnmounted} from "vue";
import Sidebar from "../helpers/Sidebar.vue";
import Icon from "../helpers/Icon.vue";
import admitAudio from "../../assets/audio/admit.mp3";

const props = defineProps({
  webrtc: {
    type: Object,
    required: true
  },
  waitingList: {
    type: Array,
    required: true
  }
});

const usersMenu = ref([]);
const dropdown = ref();
const audio = ref();
const dialog = ref(false);
const room = ref();
const showWaitList = ref(true);

const users = computed(() => {
  usersMenu.value = [{
    name: props.webrtc.options.name + ' (You)',
    peerJsId: props.webrtc.peerJsId,
    openMenu: false,
  }];

  props.webrtc.People.getConnections().forEach((item) => {
    usersMenu.value.push({
      name: item.name,
      peerJsId: item.peerJsId,
      micMute: item.micMute,
      openMenu: false,
    })
  });
});

const isCreator = computed(() => {
  return props.webrtc.userSettings.isCreator;
});

watch(users, (value) => {
  let index = value.findIndex(x => x.peerJsId === selectedUser.value);

  if (index < 0) {
    selectedUser.value = null;
  }
});

const open = (roomItem) => {
  room.value = roomItem;
  dialog.value = true;
  props.webrtc.userSettings.newAdmitRequest = false;
};

const toggleMenu = (user) => {
  user.openMenu = !user.openMenu;
}

const hideMenu = (event) => {
  if (!event.target.matches('.dropdown-content') &&
    dropdown.value &&
    dropdown.value.length > 0
  ) {
    dropdown.value.forEach(dropdownItem => {
      dropdownItem.classList.remove('show');
    })
  }

  if (event.target.matches('.dropdown-dots')) {
    event.target.parentElement.childNodes.forEach(node => {
      if (node.classList.contains('dropdown-content') && !node.classList.contains('show')) {
        node.classList.add('show');
      }
    })
  }
};

const setEventsListener = () => {
  document.addEventListener('click', hideMenu);
  document.addEventListener('onAdmissionRequest', eventHandlerRequestToAdmit);
  document.addEventListener('onAdmissionCancel', eventHandlerCancelForAdmit);
};

const banUser = (user) => {
  const action = props.webrtc.getAction('ban');
  action.run(user);
  user.openMenu = false;
};

const muteMic = (user) => {
  const action = props.webrtc.getAction('mute-user-mic');
  action.run(user);

  user.openMenu = false;
};

const responseWaiting = (status = false, user, index) => {
  const action = props.webrtc.getAction('admit');
  action.run(room.value, status, user);

  showWaitList.value = false;
  props.webrtc.People.removeFromWaitingList(index);

  nextTick(() => {
    showWaitList.value = true;
  });
};

const eventHandlerRequestToAdmit = () => {
  audio.value.play();

  if (!dialog.value) {
    props.webrtc.userSettings.newAdmitRequest = true;
  }
};

const eventHandlerCancelForAdmit = () => {
  if (props.waitingList.length === 0) {
    props.webrtc.userSettings.newAdmitRequest = false;
  }
};

onUnmounted(() => {
  document.removeEventListener('click', hideMenu);
  document.removeEventListener('onAdmissionRequest', eventHandlerRequestToAdmit);
  document.removeEventListener('onAdmissionCancel', eventHandlerCancelForAdmit);
});

setEventsListener();
audio.value = new Audio(admitAudio);

defineExpose({
  open
});
</script>

<style lang="scss">
#people-module {
  .module-box-interface {
    .people {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .user-item {
        display: flex;
        justify-content: space-between;
        position: relative;

        .dropdown-dots {
          cursor: pointer;
        }
      }

      .waitingList {
        margin-top: 15px;

        .waitingList-item {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;

          .btn {
            font-size: 0.9em;
            padding: 5px 10px;
            margin: 0 2px;
          }
        }
      }
    }
  }
}
</style>
