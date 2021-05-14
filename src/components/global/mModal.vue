<!-- 
  example
  <mModal
    :modal="true"
    :modalTitle="例子标题"
    :modalWidth="200"
    @listenModalOk="点击确认之后的回调函数"
    @listenModal="点击取消和关闭按钮的回调函数"
    @listenApply="点击保存按钮之后的回调函数"
  >content</mModal>
-->
<template>
  <div class="models">
    <Modal
      :value="modal"
      :width="modalWidth"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="false"
      @on-ok="onOk"
      @on-cancel="onCancel"
      :class-name="`myModels ${modalClass}`"
      :footer-hide="true"
      v-if="modalType=='common'"
    >
      <div slot="header" v-if="headerSlot">
        <slot name="title">
        </slot>
      </div>
      <div class="models_body_er" v-if="scrollHide" :style="{...customerStyle}">
        <slot></slot>
        <div class="op-btns" v-if="!hideFooter" :style="{maxWidth: hasSaveBtn ? '400px' : '250px'}">
          <Button @click="onOk" class="basic-button" style="width:100px">确定</Button>
          <Button @click="onCancel" class="basic-button" style="width:100px">取消</Button>
          <Button v-if="hasSaveBtn" @click="onSave" class="basic-button" style="width:100px">保存</Button>
        </div>
      </div>
      <div class="models_body" v-else :style="{...customerStyle}">
        <vue-scroll style="height: 90%">
          <div class="models_body_box">
            <slot></slot>
          </div>
        </vue-scroll>
        <div class="op-btns" v-if="!hideFooter" :style="{maxWidth: hasSaveBtn ? '400px' : '250px'}">
          <Button @click="onOk" class="basic-button" style="width:100px">确定</Button>
          <Button @click="onCancel" class="basic-button" style="width:100px">取消</Button>
          <Button v-if="hasSaveBtn" @click="onSave" class="basic-button" style="width:100px">保存</Button>
        </div>
      </div>
    </Modal>
    <!--s 删除 s-->
    <Modal
      :value="modal"
      v-if="modalType=='del'"
      :width="modalWidth"
      :loading="modalLoading"
      :mask-closable="false"
      @on-ok="onOk"
      @on-cancel="onCancel"
      :class-name="`myModels ${modalClass}`"
      :footer-hide="true"
    >
      <p slot="header" style="">
        <span>{{modalTitle}}</span>
      </p>
      <div style="text-align:center;padding:16px 20px;">
        <p>不可恢复操作，是否删除<b>{{delName}}</b>？</p>
      </div>
    </Modal>
    <!--e 删除 e-->
  </div>
</template>
<script>
export default {
  name: 'models',
  props: {
    modal: { // 弹框的显示隐藏
      type: Boolean,
      required: true,
      default: false
    },
    modalTitle: { // 弹框的标题
      type: String,
      default: '标题',
      required: false
    },
    modalWidth: { // 弹框的宽度
      type: [Number, String],
      default: 540
    },
    modalLoading: { // modal是否在加载中
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      default: 'common'
    },
    scrollHide: { // 是否是内容滚动的弹框
      type: Boolean,
      default: true
    },
    modalClass: { // 定义在外层的弹出框类名
      type: String,
      default: ''
    },
    customerStyle: { // 加载modal body身上的样式
      type: Object,
      default: () => {}
    },
    headerSlot: { // 头部是否是slot
      type: Boolean,
      default: false
    },
    delName: { // TODO 删除确认框的名字
      type: String,
      default: ''
    },
    hideFooter: { // 隐藏下面的操作按钮
      type: Boolean,
      default: false
    },
    hasSaveBtn: { // 是否有保存按钮
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    onOk() {
      this.$emit('listenModalOk')
    },
    onCancel() {
      this.$emit('listenModal')
    },
    onSave() {
      this.$emit('listenModalSave')
    }
  }
}
</script>
<style lang="less">
.myModels {
  .ivu-modal {
    border-radius: 0;
    .ivu-modal-content {
      border-radius: 5px;
      .ivu-modal-close {
        background: @main-red;
        border-radius: 4px;
        top: 7px;
        right: 7px;
        .ivu-icon-ios-close {
          font-size: 24px;
          color: @fff;
        }
      }
      .ivu-modal-header {
        padding: 8px;
        background: @modal-head-back;
        color: @black-1;
        font-size: 14px;
        line-height: 1.5;
        border-radius: 5px 5px 0 0;
        .ivu-modal-header-inner {
          text-align: center;
          line-height: 24px;
        }
      }
      .op-btns {
        display: flex;
        justify-content: space-between;
        margin: 20px auto;
        max-width: 400px;
      }
      .models_body {
        height: 60vh;
      }
    }
  }
}
</style>

