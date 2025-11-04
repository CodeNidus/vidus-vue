<template>
  <div class="module" v-show="model">
    <div class="module-box sidebar">
      <div class="module-box-heading">
        <h3 v-if="title && title !== ''">
          {{ title }}
        </h3>
        <span class="close" @click="show(false)">
          <Icon icon="close"/>
        </span>
      </div>
      <div class="module-box-interface">
        <slot></slot>
      </div>
    </div>
    <div class="module-back" @click="show(false)"></div>
  </div>
</template>

<script setup>
import Icon from "./Icon.vue";

const model = defineModel();

const props = defineProps({
  title: {
    type: String,
    default: '',
    require: false,
  },
});

const show = (status = true) => {
  model.value = status;
};

defineExpose({
  show,
});
</script>

<style scoped lang="scss">
@import '../../assets/scss/Colors';

.module {
  .module-box {
    background: $color-white;
    border: 1px solid $color-slate-100;
    box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -4px rgba(0, 0, 0, .1);

    &.sidebar {
      position: fixed;
      flex-direction: column;
      display: flex;
      z-index: 999999;
      top: 0;
      right: 0;
      bottom: 0;
      width: 350px;

      .module-box-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;

        .close {
          cursor: pointer;
        }
      }
    }

    .module-box-interface {
      display: flex;
      flex: auto;
      flex-direction: column;
      justify-content: space-between;
      overflow: auto;
      padding: 10px;
    }
  }

  .module-back {
    position: fixed;
    z-index: 999998;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $color-black;
    opacity: 0.6;
  }
}
</style>