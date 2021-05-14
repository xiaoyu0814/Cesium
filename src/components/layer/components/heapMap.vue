<template>
  <mModal
    :modal="showModal"
    modalTitle="热力图设置"
    :modalWidth="550"
    @listenModal="handleModalClose(modalName)"
  >
    <div class="heapMapWrapper">
      <div class="prototype-item layer-name flex">
        <div class="bold label">字段:&nbsp;</div>
        <div>
          <Select style="width: 200px;" v-model="field">
            <Option v-for="item in fieldList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </div>
      </div>
      <div class="prototype-item layer-name flex">
        <div class="bold label">中心半径:&nbsp;</div>
        <div>
          <Select style="width: 200px;" v-model="radius">
            <Option v-for="item in rdsList" :key="item" :value="item">{{item}}</Option>
          </Select>
        </div>
      </div>
      <div class="prototype-item layer-name flex">
        <div class="bold label">算法:&nbsp;</div>
        <div>
          <Select style="width: 200px;" v-model="aggMethod">
            <Option
              v-for="item in aggMethodList"
              :key="item.value"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </div>
      </div>
      <div class="prototype-item Operation flex">
        <div class="bold label">颜色渐变:&nbsp;</div>
        <div>
          <Select style="width: 200px;" v-model="colorSecheme">
            <Option
              v-for="item in colorSechemeList"
              :label="`rgb(${item.color[0]})-rgb(${item.color[1]})`"
              :key="item.value"
              :value="item.value"
            >
              <div
                :style="{height: '20px', background: `linear-gradient(to right, rgb(${item.color[0]}) , rgb(${item.color[1]}))`}"
              ></div>
            </Option>
          </Select>
        </div>
      </div>
    </div>
  </mModal>
</template>
<script>
import modalMixins from "./modalMixins.js";
export default {
  name: "heapMap",
  props: ["currentLayer"],
  mixins: [modalMixins],
  data() {
    let rdsList = [];
    for (let i = 2; i < 33; i++) {
      rdsList.push(i);
    }
    return {
      field: "1",
      fieldList: [
        { label: "field1", value: "1" },
        { label: "field2", value: "2" },
        { label: "field3", value: "3" }
      ],
      rdsList,
      radius: "",
      aggMethod: "",
      aggMethodList: [{ label: "Average", value: "1" }],
      colorSecheme: "0",
      colorSechemeList: [
        // 配色方案将来应该是作为常量保存在前端,因为在后台获取到图层渲染的时候也是需要的
        { value: "0", color: ["255,255,255", "0,0,0"] },
        { value: "1", color: ["238,32,214", "10,47,182"] },
        { value: "2", color: ["240,218,75", "255,0,94"] },
        { value: "3", color: ["108,232,253", "13,1,91"] }
      ]
    };
  }
};
</script>
<style lang="less">
.heapMapWrapper {
  padding: 0 20px;
  font-size: 14px;
  .prototype-item {
    padding: 12px 0;
    align-items: center;
    .layer-name {
      border-bottom: 1px solid #000000;
    }
    .label {
      width: 90px;
      min-width: 90px;
      text-align: right;
      padding-right: 5px;
    }
  }
}
</style>