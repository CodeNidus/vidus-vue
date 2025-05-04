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
        </tr>
        </thead>
        <tbody v-if="rooms.length > 0">
        <tr
            v-for="(room, index) in rooms"
            :key="'room_' + index"
            @click="selectRoom(room._id)"
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
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
          <td colspan="3">Nothing found!</td>
        </tr>
        </tbody>
        <tfoot v-if="rooms.length > 0">
          <tr>
            <td colspan="3">
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
import { ref, inject } from 'vue'
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
