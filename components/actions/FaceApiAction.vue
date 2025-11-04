<template>
  <template
    v-for="(user, index) in usersSetting"
    :key="index"
  >
  <teleport
    v-if="user?.target"
    :to="user.target"
  >
  <div
    class="face-api-action-popup"
    v-show="user.showPopup"
  >
    <span
      class="emoji-type"
      @click="setEmoji('medal', index)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px" height="24px"
        viewBox="0 0 1800 1800"
        xml:space="preserve"
        :class="{ selected: user.medal }"
      >
        <g>
          <path d="M1170.537,1120.229l-178.391-25.926l-79.759-161.635c-5.272-10.681-16.147-17.441-28.059-17.441
            c-11.906,0-22.783,6.761-28.056,17.441l-79.776,161.63l-178.386,25.931c-11.785,1.711-21.574,9.964-25.253,21.29
            c-3.68,11.326-0.611,23.761,7.917,32.071l129.084,125.823l-30.474,177.653c-2.013,11.736,2.811,23.6,12.447,30.601
            c9.633,6.991,22.404,7.926,32.944,2.383l159.553-83.88l159.547,83.88c4.573,2.404,9.575,3.592,14.552,3.592
            c6.494,0,12.945-2.017,18.393-5.975c9.637-7.001,14.464-18.864,12.447-30.601l-30.465-177.657l129.07-125.819
            c8.529-8.314,11.593-20.745,7.918-32.071C1192.107,1130.192,1182.321,1121.939,1170.537,1120.229z M1003.346,1266.085
            c-7.376,7.188-10.736,17.541-9,27.693l22.539,131.389l-117.999-62.035c-4.557-2.396-9.555-3.592-14.557-3.592
            c-5.001,0-9.999,1.196-14.556,3.592l-118.002,62.035l22.539-131.389c1.741-10.152-1.624-20.505-9-27.693l-95.467-93.054
            l131.929-19.178c10.188-1.479,19-7.879,23.556-17.109l59-119.543l58.995,119.538c4.547,9.235,13.355,15.635,23.551,17.114
            l131.934,19.178L1003.346,1266.085z"/>
          <path d="M1784.612,23.339c-5.569-9.776-15.948-15.813-27.191-15.813h-462.282c-11.183,0-21.51,5.966-27.096,15.652
            L913.897,637.144c-9.349-0.476-18.752-0.711-28.211-0.733L531.961,23.178c-5.587-9.686-15.918-15.652-27.1-15.652H42.58
            c-11.247,0-21.626,6.037-27.191,15.813c-5.561,9.772-5.451,21.779,0.292,31.451l451.452,759.959
            c-99.576,103.891-160.847,244.763-160.847,399.686c0,318.734,259.309,578.041,578.039,578.041
            c318.728,0,578.03-259.307,578.03-578.041c0-144.814-53.537-277.354-141.842-378.884L1784.315,54.79
            C1790.06,45.118,1790.173,33.111,1784.612,23.339z M97.553,70.097h389.239l329.004,570.376
            c-114.047,13.535-218.012,60.385-301.861,130.55L97.553,70.097z M1399.784,1214.435c0,284.232-231.237,515.47-515.459,515.47
            c-284.229,0-515.468-231.237-515.468-515.47c0-131.891,49.815-252.35,131.586-343.609c14.351-16.018,29.67-31.146,45.89-45.261
            c82.522-71.82,188.032-117.836,303.869-125.443c9.267-0.607,18.598-0.969,27.991-1.078c2.042-0.026,4.081-0.079,6.132-0.079
            c12.871,0,25.627,0.489,38.267,1.423c8.59,0.629,17.127,1.48,25.594,2.532c113.699,14.115,216.014,65.408,294.402,141.287
            c15.678,15.176,30.387,31.329,44.048,48.369C1357.395,980.84,1399.784,1092.771,1399.784,1214.435z M1275.322,789.106
            c-80.282-73.867-181.454-125.339-293.529-144.451l331.414-574.558h389.236L1275.322,789.106z"/>
        </g>
      </svg>
    </span>
    <span
      class="emoji-type"
      @click="setEmoji('hat', index)"
    >
      <svg
        height="36px"
        width="36px"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 413.988 413.988"
        xml:space="preserve"
        :class="{ selected: user.hat }"
      >
        <path d="M333.598,231.344c-4.083-34.865-14.409-95.779-38.456-124.271c-7.853-11.084-29.643-28.275-56.985-15.232
          c-3.548,1.691-7.011,3.881-10.359,5.998c-7.001,4.426-13.614,8.607-20.804,8.607c-7.19,0-13.805-4.182-20.807-8.607
          c-3.349-2.117-6.812-4.307-10.359-5.998c-27.341-13.045-49.133,4.15-56.984,15.232c-24.046,28.494-34.373,89.41-38.456,124.275
          c-2.562,0.482-5.08,0.98-7.516,1.488C39.628,239.762,0,252.497,0,273.835c0,19.697,34.263,31.973,63.006,38.803
          c38.519,9.152,89.654,14.193,143.987,14.193c54.332,0,105.468-5.041,143.987-14.193c28.744-6.83,63.008-19.105,63.008-38.803
          C413.988,251.426,371.136,238.43,333.598,231.344z M92.471,216.735c20.514,6.002,64.664,9.898,114.523,9.898
          c49.853,0,94.004-3.896,114.521-9.9c2.882,19.693,4.096,35.252,4.407,39.693c-1.744,1.213-9.143,4.971-36.751,8.25
          c-22.575,2.682-51.76,4.158-82.178,4.158s-59.604-1.477-82.18-4.158c-27.606-3.279-35.007-7.035-36.751-8.25
          C88.374,251.985,89.589,236.426,92.471,216.735z M126.613,113.372c0.097-0.113,19.274-24.912,44.907-12.506
          c3.006,1.453,6.078,3.375,9.323,5.426c7.529,4.76,16.063,10.154,26.149,10.154c10.085,0,18.618-5.395,26.147-10.154
          c3.245-2.051,6.316-3.975,9.321-5.426c25.118-12.137,44.807,12.385,44.909,12.506c17.3,20.354,27.166,60.574,32.593,93.402
          c-18.274,5.869-63.247,9.859-112.971,9.859c-49.729,0-94.7-3.99-112.971-9.859C99.448,173.946,109.314,133.725,126.613,113.372z
           M348.669,302.909c-37.784,8.977-88.1,13.922-141.676,13.922c-53.577,0-103.892-4.945-141.676-13.922
          C24.532,293.217,10,281.536,10,273.835c0-8.158,17-21.227,64.909-31.209c1.424-0.297,2.881-0.588,4.354-0.877
          c-0.86,8.717-1.278,15.613-1.278,15.664c0,5.809,4.926,11.836,40.664,16.568c23.633,3.131,55.008,4.854,88.344,4.854
          c33.336,0,64.709-1.723,88.342-4.854c35.737-4.732,40.664-10.76,40.664-16.568c0-0.051-0.418-6.945-1.277-15.662
          c50.951,9.992,69.267,23.387,69.267,32.084C403.988,281.536,389.456,293.217,348.669,302.909z"/>
      </svg>
    </span>
  </div>
  </teleport>
  </template>
</template>

<script setup>
import {ref, onMounted, onUnmounted, inject, nextTick} from "vue";

const webrtc = inject('webrtc');

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
});

const usersSetting = ref({});

const closePopup = (event) => {
  const parent = event.target.closest('div');

  if (event.target?.classList.contains('face-api-action-popup') ||
    parent?.classList.contains('face-api-action-popup')) return;

  Object.entries(usersSetting.value).forEach(([peerJsId, setting]) => {
    usersSetting.value[peerJsId].showPopup = false;
  });
}

const setEmoji = (type, peerJsId) => {
  const setting = usersSetting.value[peerJsId];

  setting[type] = !setting[type];
  setting.showPopup = false;

  startDraw(setting[type], type, peerJsId);
}

onMounted(() => {
  document.addEventListener("click", closePopup);
})

const run = (user, target) => {
  if (!usersSetting.value[user.peerJsId]) {
    usersSetting.value[user.peerJsId] = {
      showPopup: false,
      hat: false,
      medal: false,
      target: null,
    };
  }

  nextTick(() => {
    const userItem = target.closest('.user-item');

    usersSetting.value[user.peerJsId].target = userItem;

    setTimeout(() => {
      usersSetting.value[user.peerJsId].showPopup = true;
    }, 10);
  });
};

const startDraw = (status, type, peerJsId) => {
  const action = props.webrtc.getAction('face-api');

  action.setAttributes({
    type: type,
    status: status,
  });
  action.setUsers({
    peerJsId: peerJsId
  });
  action.setAsModeratorAction();
  action.request();
};

const userFaceApiListenerAction = (e) => {
  webrtc.helpers.faceApiAction.setStatus(e);
};

const getBucketImages = () => {
  webrtc.helpers.faceApiAction.getImagesFromBucket(props.room.id);
};

onMounted(() => {
  document.addEventListener('onFaceDetectDraw', userFaceApiListenerAction);
  getBucketImages();
});

onUnmounted(() => {
  document.addEventListener("click", closePopup);
  document.removeEventListener('onFaceDetectDraw', userFaceApiListenerAction);
});

defineExpose({
  run
});

</script>

<style lang="scss">
.face-api-action-popup {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 10px;
  padding: 10px;
  background: #fff;
  border-radius: 50px;
  transform: translateX(-50%);

  span {
    display: inline-block;
    cursor: pointer;
    margin: 0 2px;

    svg {
      path {
        fill: #333333;
      }

      &.selected {
        path {
          fill: #DC2626;
        }
      }
    }
  }
}
</style>
