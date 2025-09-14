<template>
  <div id="rooms-list" class="card">
    <h2>Rooms List</h2>
    <div class="rooms-list-table">
      <span
          class="btn btn-small"
          :class="{ disabled : loading }"
          @click="getRoomsList"
      >
        {{ (!loading)? 'Get Rooms List' : 'Please Wait ...' }}
      </span>
      <table v-if="showRooms && !loading">
        <thead>
        <tr>
          <th>Room Name</th>
          <th>Room ID</th>
          <th>Start Date</th>
          <th></th>
        </tr>
        </thead>
        <tbody v-if="rooms.length > 0">
        <tr
            v-for="(room, index) in rooms"
            :key="'room_' + index"
            @click.exact="selectRoom(room._id)"
        >
          <td>
            {{ room.name }}
          </td>
          <td>
            {{ room._id }}
          </td>
          <td>
            {{ room.start_time.split('T')[0] }}
          </td>
          <td>
            <a
              class="btn btn-small mx-2"
              @click.stop="getRoom(room, 'clipboard')"
              :disabled="room?.clipboard"
            >
              <svg v-if="room?.clipboard" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
              </svg>
            </a>
            <a
              v-if="canShare"
              class="btn btn-small mx-2"
              @click.stop="getRoom(room, 'share')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
              </svg>
            </a>
          </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
          <td colspan="4">Nothing found!</td>
        </tr>
        </tbody>
        <tfoot v-if="rooms.length > 0">
          <tr>
            <td colspan="4">
              Select desired room to join.
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="message.status" :style="{ color:message.color }">
      {{ message.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits([
  'onSelectRoom'
])

const webrtc = inject('webrtc')
const route = useRoute()
const router = useRouter()
const apiClient = webrtc.axios.getInstance()

const props = defineProps({
  token: {
    type: String,
    required: true
  }
})

const loading = ref(false)
const showRooms = ref(false)
const rooms = ref([])
const room = ref({
  id: null
})
const message = ref({
  status: false,
  text: '',
  color: 'green'
})

if (route && route?.params?.room_id) {
  room.value.id = route.params.room_id
}

const selectRoom = (roomId) => {
  emit('onSelectRoom', roomId)
}

const getRoomsList = async () => {
  if (loading.value) {
    return
  }

  loading.value = true

  try {
    await webrtc.getRoomsList().then(response => {
      rooms.value = response.rooms
    })
  } catch(e) {
    //
  }

  loading.value = false
  showRooms.value = true
}

const canShare = computed(() => {
  return (navigator.share)
})

const getRoom = async (room, type = 'clipboard') => {
  const baseurl = window.location.origin + window.location.pathname;
  const roomPath = baseurl + '?room_id=' + room._id;

  if (type === 'clipboard') {
    room.clipboard = true;
    navigator.clipboard.writeText(roomPath).then(() => {
      setTimeout(() => {
        room.clipboard = false;
      }, 2000)
    }).catch(error => {
      console.error('Failed to copy: ', error);
    });
  } else if (type === 'share')  {
    try {
      await navigator.share({
        url: roomPath,
        text: 'Join to Vidus video conference room.',
        title: 'Join Now To Room!'
      });

      console.log('Shared successfully')
    } catch(error) {
      console.error('Error sharing:', error);
    }

  }
}

defineExpose({
  getRoomsList
})

</script>

<style lang="scss">
#rooms-list {
  width: 100%;
  padding: 20px 50px;

  @media (max-width: 768px) {
    width: unset;
    margin: 0;
  }

  .rooms-list-table {
    text-align: left;
    cursor: pointer;

    table {
      width: 100%;
      margin-top: 15px;
    }
  }
}
</style>
