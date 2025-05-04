<template>
  <div id="faceapi-text-action" :style="{ 'display': ((dialog)? 'block' : 'none')}">
    <div class="action-setting" v-if="props.userSettings.isCreator">
      <div class="action-setting-box">
        <h2>Face Drawing</h2>
        <div class="my-2">
          <div class="select-field">
            <label>User</label>
            <select
                v-model="selectedUser"
            >
              <option
                  v-for="(user, index) in users"
                  :key="'user-' + index"
                  :value="user.peerJsId"
              >{{ user.name }}</option>
            </select>
          </div>
        </div>
        <div class="my-2">
          <div class="text-field timeout-field">
            <label>Timeout</label>
            <input
              type="text"
              v-model="timeout"
              placeholder="Enter timeout"
            />
            <span class="prefix">sec</span>
          </div>
        </div>
        <div class="drawing-options my-5">
          <div>
            <strong>Select drawing item</strong>
          </div>
          <div class="radio-item">
            <input
                id="type-hat"
                name="type"
                type="radio"
                v-model="type"
                value="hat"
            />
            <label for="type-hat">Pirate Hat</label>
          </div>
          <div class="radio-item">
            <input
                id="type-medal"
                name="type"
                type="radio"
                v-model="type"
                value="medal"
            />
            <label for="type-medal">Medalion</label>
          </div>
        </div>
        <div class="my-2">
          <button
            class="btn btn-block"
            @click="startDraw"
            :disabled="!selectedUser || !timeout"
          >
            Start Draw
          </button>
        </div>
      </div>
      <div class="action-setting-back" @click="show(false)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'

const webrtc = inject('webrtc')

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
  }
})

const users = computed(() => {
  let users = [{
    name: 'Creator',
    peerJsId: props.userSettings.peerJsId
  }]

  props.webrtc.People.getConnections().forEach((item) => {
    users.push({
      name: item.name,
      peerJsId: item.peerJsId
    })
  })

  return users;
})

const dialog = ref(false)
const type = ref('hat')
const timeout = ref(30)
const selectedUser= ref()

const action = ref({
  name: 'face-api',
  moderator: true,
  users: [],
  attributes: {
    type: 'hat',
    timeout: '5',
    peerJsId: null,
  }
})

const show = (status = true) => {
  dialog.value = status;

  if(!status) {
  }
}

const run = () => {
  show()
}


const startDraw = () => {
  let actionItem = JSON.parse(JSON.stringify(action.value))

  actionItem.attributes.type = type.value
  actionItem.attributes.timeout = timeout.value
  actionItem.users.push({
    peerJsId: selectedUser.value
  })

  props.webrtc.runAction(props.room.id, actionItem)
  show(false)
}

const setActionEventListener = () => {
  window.addEventListener('onFaceApiAction-DetectAndDraw', userFaceApiListenerAction);
}

const clearListener = () => {
  window.removeEventListener('onFaceApiAction-DetectAndDraw', userFaceApiListenerAction);
}


const userFaceApiListenerAction = (e) => {
  webrtc.helpers.faceApiAction.setTimer(e)
}

const getBucketImages = () => {
    webrtc.helpers.faceApiAction.getImagesFromBucket(props.room.id)
}

onMounted(() => {
  setActionEventListener()
  getBucketImages()
})

onUnmounted(() => {
  clearListener()
})

defineExpose({
  run
})

</script>

<style lang="scss">
#faceapi-text-action {
  .action-setting-box {
    max-width: 350px;

    select {
      width: 100%;
    }

    .drawing-options {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .timeout-field {
      position: relative;

      input {
        padding-right: 35px;
      }

      span {
        position: absolute;
        right: 10px;
        color: #979797;
        top: 40%;
      }
    }
  }
}
</style>
