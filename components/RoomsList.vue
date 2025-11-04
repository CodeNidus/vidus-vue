<template>
  <div id="rooms-list" class="card">
    <h2>Rooms List</h2>
    <div class="rooms-list-table">
      <span
        class="btn btn-small"
        :class="{ disabled : loading }"
        @click="getRoomsList"
      >
        {{ (!loading) ? 'Get Rooms List' : 'Please Wait ...' }}
      </span>
      <div>
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
            <td class="share-room">
              <a
                class="btn btn-small mx-2"
                @click.stop="getRoom(room, 'clipboard')"
                :disabled="room?.clipboard"
              >
                <Icon
                  v-show="room?.clipboard"
                  icon="clipboard-check-outline"
                />

                <Icon
                  v-show="!room?.clipboard"
                  icon="clipboard-outline"
                />
              </a>
              <a
                v-if="canShare"
                class="btn btn-small mx-2"
                @click.stop="getRoom(room, 'share')"
              >
                <Icon
                  icon="share-variant-outline"
                />
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
    </div>
  </div>
</template>

<script setup>
import {ref, inject, computed} from "vue";
import Icon from "./helpers/Icon.vue";

const emit = defineEmits([
  'onRoomSelected'
]);

const webrtc = inject('webrtc');

const props = defineProps({
  token: {
    type: String,
    required: true
  }
});

const loading = ref(false);
const showRooms = ref(false);
const rooms = ref([]);
const room = ref({
  id: null
});

const canShare = computed(() => {
  return (navigator.share)
});

const selectRoom = (roomId) => {
  emit('onRoomSelected', roomId);
};

const getRoomsList = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    await webrtc.getRoomsList().then(response => {
      rooms.value = response.rooms;
    });
  } catch (e) {
    //
  }

  loading.value = false;
  showRooms.value = true;
};

const getRoom = async (room, type = 'clipboard') => {
  const baseurl = window.location.origin + window.location.pathname;
  const roomPath = baseurl + '?room_id=' + room._id;

  if (type === 'clipboard') {
    room.clipboard = true;
    navigator.clipboard.writeText(roomPath).then(() => {
      setTimeout(() => {
        room.clipboard = false;
      }, 2000);
      webrtc.notify('Copy Room Link', 'Copied successfully');
    }).catch(error => {
      if (webrtc.configs.debug) {
        console.error('Failed to copy:', error);
      }
    });
  } else if (type === 'share') {
    try {
      await navigator.share({
        url: roomPath,
        text: 'Join to Vidus video conference room.',
        title: 'Join Now To Room!'
      });

      webrtc.notify('Share Room Link', 'Shared successfully');
    } catch (error) {
      if (webrtc.configs.debug) {
        console.error('Error sharing:', error);
      }
    }
  }
};

defineExpose({
  getRoomsList
});
</script>

<style lang="scss">
#rooms-list {
  width: 100%;
  padding: 20px 50px;

  @media (max-width: 768px) {
    width: unset;
    margin: 0;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }

  .rooms-list-table {
    text-align: left;
    cursor: pointer;

    div {
      @media (max-width: 480px) {
        overflow: scroll;
      }

      table {
        width: 100%;
        margin-top: 15px;

        .share-room {
          display: flex;

          a {
            @media (max-width: 480px) {
              display: flex;
              padding: 2px 5px;
              width: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
