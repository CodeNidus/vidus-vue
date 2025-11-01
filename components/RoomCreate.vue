<template>
  <div id="room-register" class="card">
    <h2>Create Room</h2>
    <form ref="form" @submit="createRoom">
      <div class="text-field">
        <label>Room Name</label>
        <input
            v-model="room.name"
            type="text"
        />
      </div>
      <div class="text-field">
        <label>Moderator</label>
        <input
            v-model="room.moderator"
            type="text"
        />
      </div>
      <div class="text-field">
        <label>Start Time</label>
        <input
            v-model="room.start_time"
            type="datetime-local"
            :min="roomMinTime"
        />
      </div>
      <div class="text-field">
        <label>End Time</label>
        <input
            v-model="room.end_time"
            type="datetime-local"
            :min="room.start_time"
        />
      </div>
      <div class="text-field">
        <label>Expire Time</label>
        <input
            v-model="room.expire_time"
            type="datetime-local"
            :min="room.end_time"
        />
      </div>
      <div>
        <label class="text-bold">Authorisable</label>
        <label class="switch mx-2">
          <input
            v-model="room.authorisable"
            type="checkbox"
            :value="true"
          >
          <span class="slider"></span>
        </label>
      </div>
      <div>
        <input v-if="!loading" type="submit" class="btn btn-block" value="Create Room"/>
        <span v-else>Please wait ...</span>
      </div>
    </form>

    <div v-if="message.text" :class="message.type">
      {{ message.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";

const webrtc = inject('webrtc');

const props = defineProps({
  token: {
    type: String,
    required: true
  }
});

const emit = defineEmits([
  'onRoomCreated'
]);

const loading = ref(false);
const room = ref({
  name: null,
  moderator: 'moderator',
  start_time: '',
  end_time: '',
  expire_time: '',
  authorisable: false,
});
const roomMinTime = ref('');
const message = ref({
  text: null,
  type: 'success'
});

const createRoom = async (e) => {
  e.preventDefault();
  message.value.text = null;

  if (!(room.value.name && room.value.moderator && room.value.start_time && room.value.end_time && room.value.expire_time)) {
    message.value.type = 'error';
    message.value.text = 'Please fill all required fields.';
    return false;
  }

  loading.value = true;

  try {
    await webrtc.createRoom(room.value).then(response => {
      room.value.name = null;
      message.value.type = 'success';
      message.value.text = 'Room created successfully! Room Id is: ' + response.room.id;
      emit('onRoomCreated', response.room);
    });
  } catch(e) {
    message.value.type = 'error';
    message.value.text = 'Error happened! ' + e.message;
  }

  loading.value = false;
};

const setRoomStartEndTime = () => {
  roomMinTime.value = setDateTimeFormat();
  room.value.start_time = setDateTimeFormat(1);
  room.value.end_time = setDateTimeFormat(10);
  room.value.expire_time = setDateTimeFormat(48 * 60);
};

const setDateTimeFormat = (minutes = 0) => {
  let dateTime;
  let dateObject = new Date(Date.now());

  dateObject.setDate(dateObject.getDate() + 2);
  dateObject.setMinutes(dateObject.getMinutes() + minutes);
  dateTime = dateObject.toISOString();

  return dateTime.substring(0, dateTime.indexOf("T") + 6);
};


setRoomStartEndTime();
</script>

<style lang="scss">
#room-register {
  width: 380px;
  display: inline-block;
  padding: 20px 50px;

  @media (max-width: 768px) {
    width: unset;
    margin: 0 0 50px 0;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }

  div {
    margin-bottom: 20px;
  }
}
</style>
