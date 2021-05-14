<template>
  <div class="tools" v-show="hidetools" v-drag>
    <!-- 工具子组件 -->
    <div class="tools_top">
      <div class="title">
        <Icon type="logo-buffer"></Icon>
        <div class="Atools">工具</div>
      </div>
      <div class="close" @click="hideTools">X</div>
    </div>
    <div class="tools-nav" @click="yanmoShow">
      <img src="../../assets/compare.png" alt=" " />
      <div>淹没推演</div>
    </div>
    <div class="tools-nav" @click="computedShow">
      <img src="../../assets/compute.png" alt=" " />
      <div>图上量算</div>
    </div>
    <!-- <div class="tools-nav" @click="squareShow">
      <img src="../../assets/compare.png" alt=" " />
      <div>方量分析</div>
    </div>-->
    <!-- <div class="tools-nav" @click="locationShow">
      <img src="../../assets/compute.png" alt=" " />
      <div>坐标定位</div>
    </div>-->
    <div class="tools-nav" @click="extractShow">
      <img src="../../assets/shezhi.png" alt=" " />
      <div>地物分类</div>
    </div>
    <!-- <div class="tools-nav">
      <img src="../../assets/plane.png" alt=" " />
      <div>地区导航</div>
    </div>-->
    <!-- <div class="tools-nav">
      <img src="../../assets/pen.png" alt=" " />
      <div>我的标记</div>
    </div>-->
    <!-- <div class="tools-nav">
      <img src="../../assets/shuqian.png" alt=" " />
      <div>视角书签</div>
    </div>-->
    <div class="tools-nav" @click="fenping">
      <img src="../../assets/fenping.png" alt=" " />
      <div>分屏对比</div>
    </div>
    <div class="tools-nav" @click="juanlian">
      <img src="../../assets/compare.png" alt=" " />
      <div>卷帘对比</div>
    </div>
    <div class="tools-nav" @click="planeShow">
      <img src="../../assets/plane.png" alt=" " />
      <div>目标检测</div>
    </div>
    <div class="tools-nav" @click="testMax">
      <img src="../../assets/plane.png" alt=" " />
      <div>飞行漫游</div>
    </div>
    <div class="tools-nav" @click="draw_line">
      <img src="../../assets/jiantou.png" alt=" " />
      <div>军标绘线</div>
    </div>
    <!-- <div class="tools-nav">
      <img src="../../assets/dayin.png" alt=" " />
      <div>地图打印</div>
    </div>
    <div class="tools-nav">
      <img src="../../assets/fenxiang.png" alt=" " />
      <div>分享地图</div>
    </div>
    <div class="tools-nav">
      <img src="../../assets/shezhi.png" alt=" " />
      <div>参数设置</div>
    </div>-->
    <!-- 引入图上量算的子组件 12/21-->
    <!-- <Computed v-show="computed"  style="position:absolute;top:10px;right:240px;"></Computed>
    <Yanmo style="position:absolute;top:10px;right:240px;" v-show="yanmo"></Yanmo>
    <SquareAnalysis style="position:absolute;top:10px;right:240px;" v-show="square"></SquareAnalysis>
    <Location style="position:absolute;top:10px;right:240px;" v-show="location"></Location>-->

    <!-- xugang 12/18  -->
    <!-- <rollerShades style="position:absolute;top:-45px;right:295px;" v-show="rollerShades"></rollerShades> -->
  </div>
</template>
<script>
import { post, getLine } from "@/api/load";
import PolygonLayer from "@/utils/Layers/PolygonLayer";
export default {
  name: "Search",
  prop: ["message"],
  data() {
    return {
      hidetools: true,
      // classification:false  //地物分类
      isdrawLine: false,
      lons: [],
      lats: [],
      newLons: [],
      newLats: [],
      pcount: 0,
      res: [],
      newArr: []
    };
  },
  mounted() {
    this.initLine();
  },
  methods: {
    //绘线军标
    draw_line() {
      console.log(111);
      var _this = this;
      this.map.getPosition();
      this.map.getPolygon(false, function(data) {
        _this.fn(data);
        // _this.initLine()
        _this.initLine(_this.newLons, _this.newLats);
        // _this.mouseClickHandler();
      });
      // this.isdrawLine = true;
      // this.lats = [];
      // this.lons = [];
      // this.pcount = 0;
    },
    // 保存框选的经纬度点信息
    fn(dataArray) {
      var _this = this;
      this.polygoned = [];
      for (var i = 0; i < dataArray.length; i++) {
        _this.polygoned.push([dataArray[i].longitude, dataArray[i].latitude]);
        _this.polygoned.slice(0, 3);
      }
      console.log(_this.polygoned);
      this.res = _this.polygoned.slice(0, 3);
      console.log(this.res);
      // return res;
    },
    mouseClickHandler() {
      for (var i = 0; i < this.res.length; i++) {
        console.log(i);
        this.lons.push(this.res[i][0]);
        this.lats.push(this.res[i][1]);
        // console.log(this.lons,this.lats)
        // console.log(this.lons.slice(0,3))
        // console.log(this.lats.slice(0,3))
        this.newLons = this.lons.slice(0, 3);
        this.newLats = this.lats.slice(0, 3);
        console.log(this.newLons);
        console.log(this.newLats);
      }
      if (this.pcount == 3) {
        this.initLine(this.newLons, this.newLats);
        this.newLons = [];
        this.newLats = [];
        this.pcount = 0;
        this.totalCount++;
        // show_total();
      }
    },
    initLine(elats, elngs) {
      var newArray = this.res.join(",");
      var points = newArray;
      // console.log(points);
      // let
      // console.log(url);
      for (var i = 1; i < elats.length; i++) {
        points += "," + elngs[i] + "," + elats[i];
      }
      $.ajax({
        async: true,
        type: "get",
        dataType: "json",
        url:
          "http://172.16.10.220:8080/PlotNative/service/analysis.do?code=30303&points=" +
          points +
          "&unitlength=0.703125",
        // getLine(url).then(data => {
        success: function(res) {
          if (res == null) {
            return;
            } 
            console.log(res);
            // this.success(points)
            var point_features = [];
            for (var i = 0; i < res.length; i++) {
              console.log(res.length)
              var p = [];
              for (var j = 0; j < res[i].plotElements.length;) {
                console.log(res[i].plotElements[j].elePosX);
                console.log(res[i].plotElements[j].elePosY);
                console.log(res[i].plotElements[j].eleType);
                if (res[i].plotElements[j].eleType == 2) {
                  var p0x = res[i].plotElements[j - 1].elePosX;
                  var p0y = res[i].plotElements[j - 1].elePosY;
                  var p0 = turf.point(p0x, p0y);

                  var p1x = res[i].plotElements[j].elePosX;
                  var p1y = res[i].plotElements[j].elePosY;
                  // var p1 = turf.point(p1x, p1y);

                  var p2x = res[i].plotElements[j + 1].elePosX;
                  var p2y = res[i].plotElements[j + 1].elePosY;
                  // var p2 = turf.point(p2x, p2y);

                  var p3x = res[i].plotElements[j + 2].elePosX;
                  var p3y = res[i].plotElements[j + 2].elePosY;
                  // var p3 = turf.point(p3x, p3y);
                  // var line = turf.lineString([p0, p1, p2, p3]);
                  var line = turf.lineString([p0x,p0y,][p1x, p1y],[p2x, p2y,],[p3x,p3y]);
                  var bezier = turf.bezierSpline(line);
                  var line_feature = turf.featureCollection(bezier);
                  point_features.push(line_feature);
                  j += 3;
                } else if (res[i].plotElement[j].eleType == 1) {
                  var p0x = res[i].plotElements[j - 1].elePosX;
                  var p0y = res[i].plotElements[j - 1].elePosY;
                  var p0 = turf.point(p0x, p0y);

                  var p1x = res[i].plotElements[j].elePosX;
                  var p1y = res[i].plotElements[j].elePosY;
                  var p1 =turf.point(p1x, p1y);

                  var line = turf.lineString([p0x,p0y,][p1x, p1y]);
                  var line_feature = turf.featureCollection(line);
                  point_features.push(line_feature);
                  j++;
                } else {
                  j++;
                }
              }
            }
            featureCollection.addFeatures(point_features, {});
          
        }
      });
    },

    hideTools() {
      this.hidetools = false;
    },
    computedShow() {
      this.computed = !this.computed;
      this.$emit("ceshi", { name: "computed", status: true });
    },
    yanmoShow() {
      this.yanmo = !this.yanmo;
      this.$emit("ceshi", { name: "yanmo", status: true });
      if (this.yanmo) {
      } else {
        PageInfo.removeRain();
      }
    },
    // squareShow(){
    //   this.square = !this.square;
    //   this.$emit("ceshi", { name: "square", status: true });
    // },
    locationShow() {
      this.location = !this.location;
      this.$emit("ceshi", { name: "location", status: true });
    },
    //地物分类
    extractShow() {
      this.extract = !this.extract;
      this.$emit("ceshi", { name: "extract", status: true });
    },
    juanlian() {
      this.map.juanlian();
      this.juanlian = !this.juanlian;
      this.$emit("ceshi", { name: "rollerShades", status: true });
    },
    fenping() {
      this.map.fenping();
      this.fenping = !this.fenping;
      this.$emit("ceshi", { name: "split", status: true });
    },
    // 飞机识别
    planeShow() {
      this.plane = !this.plane;
      this.$emit("ceshi", { name: "plane", status: true });
    },

    testMax() {
      let _url =
        "http://piecloud.piesat.cn/api/v1/spatiotemporal/vectordatasets/queryFeatures";
      let param = {
        //datasetId: "d3faf33d-684f-452a-8f8e-f189de27e6b5",
        datasetId: "981f7a65-b558-4720-b30b-682dd94d30ba",
        destCrsId: "4326"
      };
      post(_url, param).then(res => {
        console.log(res.data);
        let poly = new PolygonLayer({
          data: res.data
        });

        this.map.layerManager.addLayer(poly);
        PageInfo.testFill = poly;
      });
    }
  },
  //组件引入
  components: {},
  mounted() {
    // squareShow() {
    //   this.square = !this.square;
    //   this.$emit("ceshi", { name: "square", status: this.square });
    // },
    // juanlian() {
    //   this.map.juanlian();
    //   this.rollerShades = !this.rollerShades;
    // }
    // fenping() {
    //   this.map.fenping();
    // },
    // locationShow() {
    //   this.location = !this.location;
    //   this.$emit("ceshi", { name: "location", status: this.location });
    // }
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
/* 整体样式 */
.tools {
  font-size: 18px;
  width: 200px;
  height: 700px;
  border: 1px solid rgb(126, 169, 224);
  color: #fff;
  background-color: gray;
  background-color: rgba(0, 0, 0, 0.5);
}
.tools-nav {
  margin-left: 20px;
  margin-top: 15px;
  cursor: pointer;
}
.tools_top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(126, 169, 224);
  margin: 5px 0;
}
.Atools,
.close {
  display: inline;
}
.title {
  margin-left: 10px;
}
/* 叉号样式 */
.close {
  margin-right: 15px;
  cursor: pointer;
}
/* 图片样式 */
.tools-nav > img {
  vertical-align: middle;
  height: 20px;
  width: 20px;
}
/* 鼠标移入背景颜色样式 */
.tools-nav:hover {
  background-color: rgb(126, 169, 224);
}
/* 字体样式 */
.tools-nav > div {
  display: inline;
}
</style>