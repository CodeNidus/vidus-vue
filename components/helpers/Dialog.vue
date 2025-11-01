<template>
  <div ref="dialogBox" class="vidus-dialog-box" v-show="model">
    <div class="vidus-dialog-box-content">
      <div
        v-if="title && title !== ''"
        class="vidus-dialog-box-title"
      >
        {{ title }}
      </div>
      <div class="vidus-dialog-box-body">
        <slot></slot>
      </div>
    </div>
    <div class="vidus-dialog-box-back" @click="show(false)"></div>
  </div>
</template>

<script setup>
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
.vidus-dialog-box {
  position: fixed!important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index:1000!important;

  .vidus-dialog-box-content {
    position: absolute;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    top: 50%;
    left: 50%;
    min-width: 40%;
    max-width: 90%;
    padding: 15px;
    background: #fff;
    border-radius: 10px;
    transform: translate(-50%, -50%);

    @media screen and (max-width: 480px) {
      width: 80%;
    }

    .vidus-dialog-box-title {
      flex-grow: 1;
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 15px;

      @media screen and (max-width: 480px) {
        font-size: 1.2em;
      }
    }

    .vidus-dialog-box-body {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 10px;

      @media screen and (max-width: 480px) {
        flex-direction: column;
      }

      & > * {
        flex: 1 1 0% !important;
        min-width: 0;
        width: 100% !important;
      }
    }
  }

  .vidus-dialog-box-back {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .8;
    background: #000;
  }
}
</style>