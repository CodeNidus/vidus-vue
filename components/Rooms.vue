<template>
  <div id="webrtc">
    <div v-if="!!token" id="rooms-section">
      <RoomCreate
          :token="token"
          @onCreateRoom="createRoom"
      />

      <RoomsList
          ref="roomsList"
          :token="token"
          @onSelectRoom="selectRoom"
      />
    </div>
    <div v-else-if="!error">
      <h2>Please Wait{{ waitingDots }}</h2>
      <p>Connecting to the server to get a user authorization token.</p>
    </div>
    <div v-else class="server-error error">
      {{ error }}
      <div>Please <a href="#" @click.prevent="getUserAccessToken">try again</a> later.</div>
    </div>
  </div>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import RoomsList from './RoomsList.vue'
import RoomCreate from './RoomCreate.vue'

const webrtc = inject('webrtc')

const emit = defineEmits([
  'onSelectRoom'
])

const roomsList = ref()
const token = ref()
const waitingDots = ref('.')
const interval = ref()
const error = ref()

const selectRoom = (roomId) => {
  emit('onSelectRoom', roomId)
}

const getUserAccessToken = () => {
  error.value = null
  interval.value = setInterval(setWaitingDots, 500)

  try {
    webrtc.getUserToken((userToken) => {
      token.value = userToken
      clearInterval(interval.value)
    }, (errorItem) => {
      clearInterval(interval.value)
      error.value = errorItem
    })
  } catch {
    clearInterval(interval.value)
  }
}

const setWaitingDots = () => {
  if(waitingDots.value.length < 3) {
    waitingDots.value = waitingDots.value.concat('.')
  } else {
    waitingDots.value = ''
  }
}

const createRoom = (room) => {
  roomsList.value.getRoomsList()
}

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

onMounted(() => {
  getUserAccessToken()
})

</script>

<style lang="scss">
#rooms-section {
  display: flex;
  justify-content: space-around;
  gap: 50px;

  @media screen and (max-width: 480px) {
    flex-direction: column;
  }
}
.server-error {
  color: red;
}
</style>
