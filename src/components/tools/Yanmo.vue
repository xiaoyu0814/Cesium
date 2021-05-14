<template>
  <div class="nav" v-drag v-show="hide">
    <div class="top">
      <div class="text">
        <Icon type="md-calculator" />
        <span>淹没推演</span>
      </div>
      <div class="close" @click="hideCompute">X</div>
    </div>
    <div class="list">
      <Row style="margin-bottom: 5px;">
        <Col span="8">降雨条件</Col>
        <Col span="16">
          <Select v-model="rainstatus" style="width:160px">
            <Option v-for="item in rains" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row style="margin-bottom: 5px;">
        <Col span="8">推演时长</Col>
        <Col span="16">
          <Select v-model="timestatus" style="width:160px">
            <Option v-for="item in times" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row style="margin-bottom: 5px;">
        <Col span="8">仿真时长</Col>
        <Col span="16">
          <Select v-model="timeTruestatus" style="width:160px">
            <Option v-for="item in timeTrues" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </div>
    <button @click="start">开始推演</button>
  </div>
</template>
<script>
export default {
  name: "Yanmo",
  data() {
    return {
      hide: true,
      rainstatus: 0,
      rains: [
        { value: 0, label: "小雨" },
        { value: 1, label: "中雨" },
        { value: 2, label: "大雨" },
        { value: 3, label: "暴雨" },
        { value: 4, label: "大暴雨" },
        { value: 5, label: "特大暴雨" }
      ],
      timestatus: 3,
      times: [
        { value: 1, label: "1小时" },
        { value: 2, label: "2小时" },
        { value: 3, label: "3小时" }
      ],
      timeTruestatus: 1,
      timeTrues: [{ value: 1, label: "1分钟" }, { value: 2, label: "2分钟" }],
      hidetools: true,
      showCompute: false
    };
  },
  methods: {
    hideCompute() {
      // this.hide = false;
      this.$emit("toolShow", { name: "yanmo", status: false });
      this.end();
    },
    start() {
      console.log(this.rainstatus);
      console.log(this.timestatus);
      console.log(this.timeTruestatus);
      PageInfo.startRain(this.rainstatus, this.timestatus, this.timeTruestatus);
    },
    end() {
      PageInfo.removeRain();
    }
  },
  // 整个组件可以拖拽
  directives: {
    drag(el) {
      el.onmousedown = function(e) {
        var disx = e.clientX - el.offsetLeft;
        var disy = e.clientY - el.offsetTop;
        document.onmousemove = function(e) {
          el.style.left = e.clientX - disx + "px";
          el.style.top = e.clientY - disy + "px";
        };
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null;
        };
      };
    }
  }
};
</script>
<style scoped>
/* 整体的样式 */
.nav {
  width: 260px;
  height: 300px;
  border: 1px solid rgb(126, 169, 224);
  margin-left: 85px;
  padding-bottom: 5px;

  background-color: rgba(0, 0, 0, 0.5);
  margin-top: 50px;
  color: #fff;
  font-size: 16px;
}
/* 顶部导航条的样式 */
.top {
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 5px;
  display: flex;
}
.text {
  margin-left: 10px;
  border: none;
  color: #fff;
  font-size: 18px;
  padding-top: 5px;
}
/* 叉号样式 */
.close {
  display: inline;
  color: #fff;
}
.list {
  margin-left: 5px;
}
/* 按钮的样式 */
button {
  margin-top: 10px;
  width: 237px;
  height: 40px;
  border-radius: 25px;
  background-color: rgb(126, 169, 224);
  /* padding-left: 10px; */
  margin-left: 10px;
}
.Row {
  margin-bottom: 5px;
}
/* 样式修改--12.13xugang */
.nav > div {
  margin-top: 6px;
}
</style>