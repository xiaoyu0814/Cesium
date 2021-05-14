<!-- 图上量算子组件 -->
<template>
  <div class="nav" v-show="hide" v-drag>
    <div
      id="toolTipId1"
      style="z-index: 9999; position: absolute; top: 250px; left: 20px; width:45px"
    ></div>
    <div
      id="toolTipId2"
      style="z-index: 9999; position: absolute; top: 250px; left: 20px; width:45px"
    ></div>
    <div class="top">
      <div class="text">
        <Icon type="md-calculator" />
        <span>图上量算</span>
      </div>
      <div class="close" @click="hideCompute">X</div>
    </div>
    <div class="list">
      <div class="list_item" id="toolTipId" @click="get">
        <div class="pic" style="background-color: blueviolet;">
          <img src="@/assets/02.png" alt />
        </div>
        <span>空间距离</span>
      </div>
      <div class="list_item">
        <div class="pic" style="background-color: rgb(212, 139, 235);">
          <img src="@/assets/02.png" alt />
        </div>
        <span>贴地距离</span>
      </div>
      <div class="list_item">
        <div class="pic" style="background-color: rgb(124, 190, 235);">
          <img src="@/assets/02.png" alt />
        </div>
        <span>剖面</span>
      </div>
      <div class="list_item" @click="area">
        <div class="pic" style="background-color:rgb(43, 153, 226)">
          <img src="@/assets/02.png" alt />
        </div>
        <span>面积</span>
      </div>
      <div class="list_item">
        <div class="pic" @click="height" style="background-color: rgb(7, 121, 115)">
          <img src="@/assets/02.png" alt />
        </div>
        <span>高度差</span>
      </div>
      <div class="list_item">
        <div class="pic" style="background-color:rgb(19, 230, 54)">
          <img src="@/assets/02.png" alt />
        </div>
        <span>三角测量</span>
      </div>
      <div class="list_item">
        <div class="pic" style="background-color: rgb(157, 207, 75);">
          <img src="@/assets/02.png" alt />
        </div>
        <span>角度</span>
      </div>
      <div class="list_item">
        <div class="pic" style="background-color: rgb(173, 190, 16);">
          <img src="@/assets/02.png" alt />
        </div>
        <span>坐标测量</span>
      </div>
      <div class="list_item">
        <div class="pic" style="background-color:rgb(19, 230, 54)">
          <img src="@/assets/02.png" alt />
        </div>
        <span>坐标测量</span>
      </div>
    </div>
    <div class="cm">
      <div>单位</div>
      <input type="text" placeholder="自动" />
    </div>
    <button @click="btn_Clear">清空测量数据</button>
     
  </div>
</template>
<script>
export default {
  name: "Computed",
  data() {
    return {
      hide: true,
    };
  },
  methods: {
    hideCompute() {
      // console.log(111)
       this.$emit("toolShow", { name: "computed", status:false })
    },
    get() {
      // console.log(1);
      //定义目标位置
      var destination = Cesium.Rectangle.fromDegrees(
        118.30037712999183,
        29.854291959512913,
        118.50337712999183,
        29.869921830807358
      );
      var heading = Cesium.Math.toRadians(0.0); //朝北
      var pitch = Cesium.Math.toRadians(-15);
      var roll = Cesium.Math.toRadians(0);
      var duration = 0;
      var handler = new Cesium.ScreenSpaceEventHandler(this.map.viewer.canvas);
      var measureTool = this.map.getMeasureTool(
        this.map.viewer,
        handler,
        "toolTipId"
      );
      //定位到目标位置
      measureTool.flyTo(destination, heading, pitch, roll, duration);
      measureTool.measureDistance();//测距
    },
    area() {
      // console.log(2);
      var destination = Cesium.Rectangle.fromDegrees(
        118.30037712999183,
        29.854291959512913,
        118.50337712999183,
        29.869921830807358
      );
      var heading = Cesium.Math.toRadians(0.0); //朝北
      var pitch = Cesium.Math.toRadians(-15);
      var roll = Cesium.Math.toRadians(0);
      var duration = 0;
      var handler = new Cesium.ScreenSpaceEventHandler(this.map.viewer.canvas);
      var measureTool = this.map.getMeasureTool(
        this.map.viewer,
        handler,
        "toolTipId1"
      );
      measureTool.flyTo(destination, heading, pitch, roll, duration);
      measureTool.measureArea();//测面积
    },
    height() {
      // console.log(3);
      var destination = Cesium.Rectangle.fromDegrees(
        118.30037712999183,
        29.854291959512913,
        118.50337712999183,
        29.869921830807358
      );
      var heading = Cesium.Math.toRadians(0.0); //朝北
      var pitch = Cesium.Math.toRadians(-15);
      var roll = Cesium.Math.toRadians(0);
      var duration = 0;
      var handler = new Cesium.ScreenSpaceEventHandler(this.map.viewer.canvas);
      var measureTool = this.map.getMeasureTool(
        this.map.viewer,
        handler,
        "toolTipId2"
      );
      measureTool.flyTo(destination, heading, pitch, roll, duration);
      measureTool.measureHeight();//测高
    },
    btn_Clear() {
      // console.log(4)
      var destination = Cesium.Rectangle.fromDegrees(
        118.30037712999183,
        29.854291959512913,
        118.50337712999183,
        29.869921830807358
      );
      var heading = Cesium.Math.toRadians(0.0); //朝北
      var pitch = Cesium.Math.toRadians(-15);
      var roll = Cesium.Math.toRadians(0);
      var duration = 0;
      var handler = new Cesium.ScreenSpaceEventHandler(this.map.viewer.canvas);
      var measureTool = this.map.getMeasureTool(
        this.map.viewer,
        handler,
        "toolTipId"
      );
      measureTool.flyTo(destination, heading, pitch, roll, duration);
      measureTool.clearAll();//清除所有数据
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
  height: 500px;
  border: 1px solid #ccc;
  margin-left: 5px;
  padding-bottom: 5px;
  margin-top: 50px;
  color: #fff
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
/* 中间八张图片样式 */
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 15px;
  margin-left: 20px;
}
.list_item {
  font-size: 14px;
  width: 30%;
  margin-bottom: 10px;
}
/* 图片背景的样式 */
.pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: relative;
}
/* 图片的样式 */
img {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 15%;
  left: 15%;
}
/* 单位和输入框的样式 */
.cm {
  display: flex;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 20px;
  font-size: 14px;
}
input {
  margin-left: 5px;
}
/* 按钮的样式 */
button {
  width: 150px;
  height: 40px;
  border-radius: 25px;
  background-color: cornflowerblue;
  margin: 0 50px;
  color: #fff;
  font-size: 16px;
}
</style>