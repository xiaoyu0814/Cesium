<template>
  <div id="tools">
    <ul>
      <li
        v-for="(item, index) in tools_list"
        :key="index"
        :class="activeClass===item.value?'select':''"
        @click="Selection(item.value)"
      >
        <img :src="item.img" :alt="item.name" srcset width="20" />
        <span>{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeClass: "",
      measureTool: null,
      tools_list: [
        {
          img: "static/img/distanceMeasurement.png",
          name: "测距离",
          value: "distance"
        },
        {
          img: "static/img/areaMeasurement.png",
          name: "测面积",
          value: "area"
        },
        {
          img: "static/img/heightMeasurement.png",
          name: "测高程",
          value: "height"
        }
      ]
    };
  },
  mounted() {
    this.measurement();
  },
  methods: {
    Selection(value) {
      this.activeClass = value;
      switch (value) {
        case "distance":
          // this.distanceMeasurement();
          this.measureTool.measureDistance(); //测距
          break;
        case "area":
          // this.areaMeasurement();
          this.measureTool.measureArea(); //测面积
          break;
        case "height":
          // this.heightMeasurement();
          this.measureTool.measureHeight(); //测高
          break;
        default:
          break;
      }
    },
    measurement() {
  
      var handler = new Cesium.ScreenSpaceEventHandler(this.map.viewer.canvas);
      this.measureTool = this.map.getMeasureTool(
        this.map.viewer,
        handler,
        "toolTipId1"
      );
    }
  }
};
</script>

<style scoped>
#tools {
  height: 100%;
  position: absolute;
  top: 0;
  left: 80px;
  /* width: 200px; */
  background-color: #00000099;
  color: #fff;
  border-left: 2px solid #fff;
  /* padding: 20px; */
}
li {
  /* margin-bottom: 10px; */
  padding: 10px 20px;
}
li:hover {
  background-color: #ffffff99;
}
span {
  margin-left: 5px;
}
img,
span {
  vertical-align: middle;
}
.select {
  background-color: #ffffff99;
}
</style>
