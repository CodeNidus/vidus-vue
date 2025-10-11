<template>
   <div ref="canvasModule" id="canvas-module" class="module" :style="{ 'display': ((dialog)? 'block' : 'none')}">
    <div ref="canvasArea" id="canvas-module-area">
      <div id="canvas-module-actions-dock">
        <template
          v-for="(action, index) in filteredActions"
          :key="index"
        >
          <div
            class="btn btn-small mx-2 circle"
            @click="runAction(action)"
          >
            <Icon :icon="action.icon" size="16" />
          </div>
        </template>
      </div>
      <div id="canvas-module-custom-actions">
        <template
          v-for="(action, index) in filteredActions"
          :key="index"
        >
          <component
            :is="action.view"
            :ref="(obj) => { setAction(index, obj) }"
            class="action"
            :room="room"
            :webrtc="webrtc"
            :canvas="canvas"
            :userSettings="webrtc.userSettings"
          />
        </template>
      </div>
      <canvas ref="canvas" id="canvas-module-canvas"  height="250"/>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import Icon from '../helpers/Icon.vue';

  const props = defineProps({
    room: {
      type: Object,
      required: true
    },
    webrtc: {
      type: Object,
      required: true
    },
  })

  const dialog = ref(false);
  const canvas = ref();
  const canvasArea = ref();
  const canvasModule = ref();
  const actions = ref({});
  const filteredActions = ref({});

  for (const [key, value] of Object.entries(props.webrtc.actions)) {
    if (value?.category?.includes(['canvas'])) {
      filteredActions.value[key] = value;
    }
  }

  const show = (status = true) => {
    dialog.value = status;

    props.webrtc.emit('onCanvasModuleDisplay', {
      show: status
    });
  }

  const open = () => {
    show(!dialog.value);
  }

  const setAction = (name, object) => {
    const actionName = props.webrtc.camelToKebab(name)
    actions.value[actionName] = object
  }

  const runAction = (action) => {
    const actionName = props.webrtc.camelToKebab(action.name)
    actions.value[actionName].run(props.room, action?.data || {})
  }

  defineExpose({
    open,
  })

</script>


<style lang="scss">
#canvas-module {
  position: relative!important;
  z-index: 1000;

  #canvas-module-area {
    position: relative;
    padding: 0 15px;
    border: 1px solid #333;
    border-radius: 15px;
    overflow: hidden;
    height: 250px;

    #canvas-module-actions-dock {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 100;

      .btn {
        &.circle {
          border-radius: 45%;
          padding: 2px 4px;
        }
      }
    }

    #canvas-module-custom-actions {
      position: relative;
    }

    #canvas-module-canvas {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
}
</style>