<template>
  <div id="rightNav">
    <img src="../../assets/compass.png" alt title="按下鼠标左键拖动可修改视图角度，双击复位" v-show="false" />
    <ul class="tools_list">
      <!-- <li title="测试点" @click="addPointTest">
        <img src="../../assets/vr.png" alt />
      </li>
      <li title="测试多边形" @click="addPolygonTest">
        <img src="../../assets/vr.png" alt />
      </li>
      <li title="测试多边形" @click="addPolygonTest2">
      </li>
      <li title="清除" @click="clearTest">
        <img src="../../assets/vr.png" alt /> 
      </li>-->
      <li title="放大" @click="enlarge">
        <img src="static/img/enlarge.png" alt />
      </li>
      <li title="缩小" @click="reduce">
        <img src="static/img/narrow.png" alt />
      </li>
      <li title="中心" @click="reset">
        <Poptip content="content" placement="left" class="Poptip" trigger="click">
          <!-- <Button class="more"> -->
          <!-- <Icon type="ios-more" /> -->
          <img src="static/img/center.png" alt />
          <!-- </Button> -->
          <div slot="content">
            <ul>
              <li class="lonLatQuery">
                <table>
                  <tr>
                    <td rowspan="2">经纬度查询</td>
                    <td>X</td>
                    <td>
                      <Input
                        v-model="lat"
                        placeholder="经度"
                        style="width: 70px"
                        @on-keydown="setCenter"
                      />
                    </td>
                    <td>Y</td>
                    <td>
                      <Input
                        v-model="lon"
                        placeholder="纬度"
                        style="width: 70px"
                        @on-keydown="setCenter"
                      />
                      
                    </td>
                  </tr>
                </table>
              </li>
              <hr style="margin:10px 0" />
              <li class="cityQuery">
                <Poptip content="content" placement="bottom" class="Poptip" trigger="click">
                  <!-- <Button class="more"> -->
                  <!-- <Icon type="ios-more" /> -->
                  <!-- <img src="static/img/center.png" alt /> -->
                  按省、市选择
                  <Icon type="md-arrow-dropup" />
                  <!-- </Button> -->
                  <div slot="content">
                    <city></city>
                  </div>
                </Poptip>
              </li>
            </ul>
          </div>
        </Poptip>
      </li>
      <li title="平移" @click="move">
        <img :src="move_select ? 'static/img/select_move.png':'static/img/move.png'" alt />
      </li>
      <li title="框选" @click="polygon">
        <img :src="polygon_select ? 'static/img/polygon.png':'static/img/select_polygon.png'" alt />
      </li>
      <li title="圆选" @click="circular">
        <img
          :src="circular_select ? 'static/img/circular.png':'static/img/select_circular.png'"
          alt
        />
      </li>
      <li title="卷帘" @click="Compare">
        <img :src="Compare_select ? 'static/img/Compare.png':'static/img/select_Compare.png'" alt />
      </li>

      <li
        :title="fullScreen_or_exitFullscreen_select ? '全屏':'退出全屏'"
        @click="fullScreen_or_exitFullscreen"
      >
        <img
          :src="fullScreen_or_exitFullscreen_select ? 'static/img/fullscreen.png':'static/img/exitFullscreen.png'"
          alt
        />
      </li>
      <li title="保存" v-show="false">
        <img src="../../assets/global.png" alt />
      </li>
      <li title="三维视图" v-show="false">
        <img src="../../assets/global.png" alt />
      </li>
      <li title="复位视角" @click="reset" v-show="false">
        <img src="@/assets/Home.png" alt />
      </li>
      <li title="鼠标或触摸帮助" v-show="false">
        <img src="../../assets/ques.png" alt />
      </li>
    </ul>
  </div>
</template>
<script>
import city from "./city";

import { get, post } from "@/api/load";
export default {
  components: {
    city
  },
  data() {
    return {
      lon: "",
      lat: "",
      layer: [
        {
          url:
            "http://piecloud.piesat.cn/seis/v3/wmts/service/1079/10?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleMapsCompatible&format=image%2Fpng&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG%3A3857&tilematrix={z}&tilerow={y}&tilecol={x}"
        },
        {
          url:
            "http://piecloud.piesat.cn/seis/v3/wmts/service/1079/10?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleMapsCompatible&format=image%2Fpng&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG%3A3857&tilematrix={z}&tilerow={y}&tilecol={x}"
        }
      ],
      fullScreen_or_exitFullscreen_select: true,
      move_select: true,
      Compare_select: true,
      polygon_select: true,
      circular_select: true
    };
  },
  mounted() {},
  methods: {
    aaa(){
      console.log(1223)
    },
    addPointTest() {
      var fn = function(data) {
        alert(data.longitude);
        alert(data.latitude);
        alert(data.height);
      };
      //增加测试
      this.map.getPoint(fn);
    },
    addPolygonTest() {
      var fn = function(dataArray) {
        alert(dataArray[0].longitude);
        alert(dataArray[0].latitude);
        alert(dataArray[0].height);
      };
      //增加测试
      this.map.getPolygon(true, fn);
    },
    addPolygonTest2() {
      var fn = function(dataArray) {
        alert(dataArray[1].longitude);
        alert(dataArray[1].latitude);
        alert(dataArray[1].height);
      };
      //增加测试
      this.map.getPolygon(false, fn);
    },
    clearTest() {
      //测试
      this.map.clearShape();
    },
    baseMap() {
      this.map.setUrlTemplateImageryLayer(this.layer);
    },
    reset() {
      //console.log(1);
      return;
      this.map.initView();
    },
    enlarge() {
      this.map.zoomIn();
    },
    reduce() {
      console.log(1);
      this.map.zoomOut();
    },
    move() {
      this.move_select = !this.move_select;
      if (this.move_select) {
        this.map.CameraManager.openMove();
      } else {
        this.map.CameraManager.closeMove();
      }
    },
    polygon() {
      this.polygon_select = !this.polygon_select;
      this.map.getRectangle(function(data) {
        console.log(data);
      });
    },
    circular() {
      this.circular_select = !this.circular_select;
      this.map.getCircle(function(data) {
        console.log(data);
      });
    },
    Compare() {
      this.Compare_select = !this.Compare_select;
      if (this.Compare_select) {
        this.map.juanlian();
        this.$store.state.close_Compare = false;
        this.$store.state.layer_list = false;
      } else {
        this.$store.state.close_Compare = true;
        this.$store.state.layer_list = true;
      }
    },
    fullScreen_or_exitFullscreen() {
      // this.map.fullScreen();
      this.fullScreen_or_exitFullscreen_select = !this
        .fullScreen_or_exitFullscreen_select;
      if (this.fullScreen_or_exitFullscreen_select) {
        this.exitFullscreen();
      } else {
        this.fullScreen();
      }
    },
    fullScreen() {
      var element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    navigation() {
      this.map.viewer.extend(Cesium.viewerCesiumNavigationMixin, {
        defaultResetView: Cesium.Rectangle.fromDegrees(73, 3, 137, 54)
      });
      var distanceLegendDiv = document.getElementById("distanceLegendDiv");
      if (distanceLegendDiv != null) {
        //设置指北针位置
        distanceLegendDiv.style.position = "absolute";
        distanceLegendDiv.style.top = "100px";
        distanceLegendDiv.style.right = "0px";
        // 获取指北针下三个工具按钮
        var tools = document.querySelector(
          "#distanceLegendDiv>.navigation-controls"
        );
        // 设置工具按钮隐藏
        tools.style.display = "none";
      }

      //设置比例尺位置
      var distancelegend = document.getElementsByClassName("distance-legend");
      if (distancelegend != null) {
        distancelegend[0].style.position = "absolute";
        distancelegend[0].style.bottom = "100px";
        distancelegend[0].style.left = "10px";
      }
    },
    setCenter() {
      console.log(123)
      if (event.keyCode === 13) {
        console.log(456)
        if (this.lon === "" && this.lat === "") {
          console.log(789)
          return;
        }
        this.map.gotoView([this.lon, this.lat, 1000]);
      }
    }
  }
};
</script>
<style scoped>
/* 指南针 */
#rightNav {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(155, 155, 155, 0.4);
  border-radius: 100000px;
  position: absolute;
  bottom: 30px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
div > img {
  width: 50px;
  height: 50px;
}
/* 列表按钮 */
div .tools_list {
  list-style-type: none;
  padding: 20px 10px 0 10px;
}
div .tools_list > li {
  margin-bottom: 20px;
}
/* 列表内嵌图片 */
div .tools_list > li img {
  width: 30px;
  height: 30px;
}
.measureCur {
  cursor: crosshair;
}
.lonLatQuery {
  font-weight: bold;
}
.cityQuery {
  height: 40px;
  padding: 5px;
  text-align: center;
  background-color: #cccccc60;
  line-height: 35px;
  font-weight: bold;
}
.lonLatQuery td {
  padding: 5px;
}
</style>
