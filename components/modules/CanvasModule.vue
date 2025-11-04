<template>
   <div
     v-show="dialog"
     ref="canvasModule"
     id="canvas-module"
     class="module"
   >
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
            :webrtc="webrtc"
            :room="room"
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
  import { ref, shallowRef } from "vue";
  import Icon from "../helpers/Icon.vue";

  const props = defineProps({
    room: {
      type: Object,
      required: true
    },
    webrtc: {
      type: Object,
      required: true
    },
  });

  const dialog = ref(false);
  const canvas = ref();
  const canvasArea = ref();
  const canvasModule = ref();
  const filteredActions = shallowRef({});

  for (const [key, value] of Object.entries(props.webrtc.actions)) {
    if (value?.category?.includes(['canvas'])) {
      filteredActions.value[key] = value;
    }
  }

  const open = () => {
    dialog.value = !dialog.value;

    props.webrtc.emit('onCanvasDisplay', {
      show: dialog.value
    });
  };

  const setAction = (name, object) => {
    props.webrtc.registerActionReference(name, object);
  };

  const runAction = (_action) => {
    const action = props.webrtc.getAction(_action.name);
    action.run(props.room, _action?.data || {});
  };

  defineExpose({
    open,
  });
</script>


<style scoped lang="scss">
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