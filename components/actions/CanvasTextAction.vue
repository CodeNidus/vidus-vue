<template>
  <div id="canvas-text" class="action" v-show="dialog || isPlay">
    <div id="canvas-text-action" class="action-setting" :style="{ 'display': ((dialog)? 'block' : 'none')}">
      <div class="action-setting-box" v-if="props.userSettings.isCreator">
        <h3>Canvas Text</h3>
        <div class="canvas-text-setting-section">
          <div class="text-section">
            <textarea rows="5" v-model="text"></textarea>
            <div class="d-flex gap-1 canvas-text-setting-section-actions">
              <button
                v-if="isPlay"
                @click.prevent="pauseMessage"
                class="btn btn-subtle"
              >
                {{ (!isPause) ? 'Pause' : 'Resume' }}
              </button>

              <button
                  @click.prevent="marqueeMessage"
                  class="btn btn-subtle"
                  :disabled="(!text || text === '')"
              >
                {{ (!isPlay) ? 'Play' : 'Stop' }}
              </button>
            </div>
          </div>

          <div
              v-if="files.length > 0"
              class="text-history"
          >
            <ul class="list-items">
              <li
                v-for="(file, index) in files"
                :key="index"
                @click="copyText(file.file)"
              >
                {{ file.file.split('/').pop() }}
              </li>
            </ul>

          </div>
        </div>
      </div>
      <div class="action-setting-back" @click="show(false)"></div>
    </div>

    <div id="canvas-text-action-card">
      <div id="canvas-text-action-counter" v-if="props.userSettings.isCreator">
        <span
          v-if="isPlay"
          @click.prevent="pauseMessage"
          class="mx-2 c-pointer"
        >
            {{ (!isPause) ? 'Pause' : 'Resume' }}
          </span>
        <span class="mx-2 c-pointer" @click.prevent="marqueeMessage">{{ (!isPlay) ? 'Play' : 'Stop' }}</span>
      </div>
      <canvas id="canvas-text-scroll-section"  height="250"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'

const webrtc = inject('webrtc')
const apiClient = webrtc.axios.getInstance()

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

const disabled = computed(() => {
  return (!text.value || text.value === '')
})

const dialog = ref(false)
const loading = ref(false)
const text = ref(null)
const isPlay = ref(false)
const isPause = ref(false)
const files = ref([])

const action = ref({
  name: 'canvas-text',
  moderator: true,
  users: [],
  attributes: {
    play: false,
    pause: false,
    initial: false,
    message: null,
  }
})

const run = (room, data) => {
  show()
}

const show = (status = true) => {
  dialog.value = status;
}

const copyText = (url) => {
  webrtc.helpers.canvasTextAction.copyText(url).then(response => {
    text.value = response
  })
}

const getTextFromBucket = () => {
  loading.value = true

  try {
    webrtc.helpers.canvasTextAction.getTextFromBucket(props.room?.id || 0).then(response => {
      loading.value = false
   //   files.value = response
    })
  } catch {
    loading.value = false
  }
}

const getActionObject = () =>  {
  return JSON.parse(JSON.stringify(action.value))
}

const pauseMessage = () =>  {
  if(!isPlay.value) {
    return false
  }

  isPause.value = !isPause.value

  let actionItem = getActionObject()
  actionItem.attributes.play = true
  actionItem.attributes.pause = isPause.value

  webrtc.runAction(props.room?.id || 0, actionItem)
  show(false)
}

const marqueeMessage = () => {
  if(disabled.value && !isPlay.value) {
    return false
  }

  isPlay.value = !isPlay.value
  isPause.value = false

  let actionItem = getActionObject()
  actionItem.attributes.play = isPlay.value
  actionItem.attributes.message = text.value

  if(isPlay.value) {
    actionItem.attributes.initial = true
  }

  webrtc.runAction(props.room?.id || 0, actionItem)

  show(false)
}

onMounted(() => {
  getTextFromBucket()
})


defineExpose({
  run,
  pauseMessage,
  marqueeMessage,
})

</script>

<style lang="scss">
#canvas-text {
  position: relative!important;

  #canvas-text-action {
    .action-setting-box {
      .canvas-text-setting-section {
        display: flex;

        @media screen and (max-width: 480px) {
          flex-direction: column;
        }

        .text-section {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 150px;

          textarea {

          }

          .canvas-text-setting-section-actions {
            margin-top: 15px;
          }
        }

        .text-history {
          display: flex;
          flex-direction: column;
          max-width: 350px;
          height: 150px;
          padding: 0px 10px;
          overflow: auto;
        }
      }
    }
  }

  #canvas-text-action-card {
    position: relative;
    padding: 0 15px;
    border: 1px solid #333;
    border-radius: 15px;
    overflow: hidden;
    height: 250px;

    #canvas-text-action-counter {
      position: absolute;
      top: 0;
      left: 0;
      background: #ffdd00;
      padding: 5px;
      color: #333;
    }

    canvas {
      display: none;
    }
  }
}
</style>
