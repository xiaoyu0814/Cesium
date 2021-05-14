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
    <button @click="start(detectType)">开始检测</button>
    <!-- <button @click="startExtract" style="top:350px;">开始分割</button> -->
    <segmentationAndClassification
      :pointDataStr="pointDataStr"
      v-show="segmentationAndClassification_type"
    ></segmentationAndClassification>
  </div>
</template>

<script>
import segmentationAndClassification from "./segmentationAndClassification/index";
import { get, post } from "@/api/load";
import LineLayer from "@/utils/Layers/LineLayer";
import PolygonLayer from "@/utils/Layers/PolygonLayer";

export default {
  components: {
    segmentationAndClassification
  },
  data() {
    return {
      activeClass:"",
      pointDataStr: [],
      getIsStartClassify: false,
      detectType: "",
      measureTool: null,
      tools_list: [
        {
          img: "static/img/plane.png",
          name: "飞机识别",
          value: "plane"
        },
        {
          img: "static/img/ship.png",
          name: "舰船识别",
          value: "ship"
        },
        {
          img: "static/img/greenhouse.png",
          name: "大棚识别",
          value: "greenhouse"
        },
        {
          img: "static/img/airport.png",
          name: "机场检测",
          value: "airport"
        },
        {
          img: "static/img/classification.png",
          name: "地物分类",
          value: "classification"
        }
      ],
      segmentationAndClassification_type: false,
      planeParamed: {
        detectType: "",
        gtPath: "", //识别固定参数
        imagePath: "" //识别固定参数
      }
    };
  },
  mounted() {},
  methods: {
    Selection(value) {
      this.activeClass = value;
      this.segmentationAndClassification_type = false;
      switch (value) {
        case "plane":
          this.planeIcon();
          break;
        case "ship":
          this.shipRecognition();
          break;
        case "greenhouse":
          this.greenhouseIcon();
          break;
        case "airport":
          this.airportDetection();
          break;
        case "classification":
          this.classification();
          this.segmentationAndClassification_type = true;
          break;
        default:
          break;
      }
    },
    // 大棚识别
    greenhouseIcon() {
      this.detectType = "GREENHOUSE";
      var _this = this;
      this.map.gotoView([116.6462, 40.1571, 2000]);
      this.map.getPolygon(false, function(data) {
        _this.callback(data);
      });
    },
    //机场检测
    airportDetection() {
      this.detectType = "AIRPORT";
      var _this = this;
      this.map.gotoView([116.411, 39.5103, 6500]);
      this.map.getPolygon(false, function(data) {
        _this.callback(data);
      });
    },
    //船舰识别
    shipRecognition() {
      this.detectType = "SHIP";
      var _this = this;
      this.map.gotoView([129.7152, 33.158, 6055]);
      this.map.getPolygon(false, function(data) {
        _this.callback(data);
      });
    },
    //飞机识别
    planeIcon() {
      this.detectType = "PLANE";
      var _this = this;
      this.map.gotoView([-115.0352, 36.2394, 1000]);
      this.map.getPolygon(false, function(data) {
        _this.callback(data);
      });
    },
    classification() {
      this.detectType = "classification";
      var _this = this;
      this.map.gotoView([116.3947, 39.9141, 1000]);
      this.map.getPolygon(false, function(data) {
        console.log(123);
        _this.pointDataStr = _this.callback(data);
        // 地物分类分割的结果
        _this.$store.state.splitCoordinates= _this.pointDataStr
      });
    },
    // 获取识别范围
    callback(dataArray){
      var _this = this;
      // debugger
      this.polygoned = [];
      for (var i = 0; i < dataArray.length; i++) {
        _this.polygoned.push([dataArray[i].longitude, dataArray[i].latitude]);
      }
      console.log(_this.polygoned);
      return _this.polygoned;
    },
    //开始检测
    start(detectType) {
      console.log(detectType);
      this.planeParamed.detectType = detectType;
      this.algorithm();
      this.$Loading.start();
    },
    algorithm() {
      // 飞机检测 第一个接口：算法调取
      let _this = this;
      let url = this.$interfacePath.identification.distinguish.detect;
      let param = {
        modelId: "831c48db9185430fb8a354efe60f49a9",
        planeParam: _this.planeParamed,
        polygon: _this.polygoned
      };
      post(url, param).then(data => {
        if (data.success) {
          let taskid = data.data.taskId;
          _this.timer = setInterval(function() {
            _this.speed_of_progress(data.data.taskId);
          }, 2000);
        } else {
          _this.$Message.error("调取算法失败");
        }
      });
    },
    speed_of_progress(taskId) {
      // 飞机检测 第二个接口：进度查询
      let _this = this;
      let url =
        this.$interfacePath.identification.distinguish.modelTaskListByID +
        `/${taskId}`;
      get(url).then(data => {
        if (data.success) {
          console.log(data);
          if (this.getIsStartClassify) {
            // 如果是分类
            if (data.data.taskStatus > 2 || data.data.taskStatus < -1) {
              // 异常或失败
              window.clearInterval(_this.timer);
              _this.$Message.error("计算失败，状态码：" + data.data.taskStatus);
            } else if (data.data.taskStatus == 2) {
              // 成功，完成進度條，輸出結果
              // this.percentage = data.data.progress;
              _this.entrance(data.data.id);
            } else {
              //中間過程，處理進度條
              //處理進度條信息
            }
          } else {
            //如果是分割
            if (data.data.taskStatus > 2 || data.data.taskStatus < -1) {
              // 异常或失败
              window.clearInterval(_this.timer);
              _this.$Message.error("计算失败，状态码：" + data.data.taskStatus);
            } else if (data.data.taskStatus == 2) {
              // 成功，完成進度條，輸出結果
              // this.percentage = data.data.progress;
              _this.entrance(data.data.id);
            } else {
              //中間過程，處理進度條
              //處理進度條信息
            }
          }
        } else {
          clearInterval(_this.timer);
          this.$Message.error("调取进度接口失败");
        }
      });
    },
    // 第三个：入库接口
    entrance(taskId) {
      window.clearInterval(this.timer);
      let param = {
        taskId,
        modelIded: this.modelIdeded
      };
      let url = this.$interfacePath.identification.distinguish.getOutData;
      get(url, param).then(data => {
        if (data.success) {
          this.result(data.data);
        } else {
          this.$Message.error("调取入库接口失败");
        }
      });
    },
    // 第四个：查询结果
    result(data) {
      var string = this.polygoned.join(";");
      console.log(string);
      let url = this.$interfacePath.identification.distinguish.query_intersects;
      let param = {
        polygon: string,
        output: "geojson",
        type: data
      };
      get(url, param).then(data => {
        if (data.code == 0) {
          console.log("终于成功啦！！！！！",data);
          // for (let i = 0; i < data.data.features.length; i++) {
          //   data.data.features[i] = turf.polygonToLine(data.data.features[i]);
          // }
          // let line = new LineLayer({
          //   width: 3,
          //   color: "#f00",
          //   data: data.data,
          //   id: "分割矢量线"
          // });
          // this.map.layerManager.addLayer(line)
          let polygon = new PolygonLayer({
            strokeWidth: 3,
            strokeColor: "#f00",
            fillColor: "#f00",
            opacity: 1,
            isFill: false,
            data: data.data,
            id: "分割矢量线"
          });
          this.map.layerManager.addLayer(polygon);
        } else {
          this.$Message.error("调取查询结果接口失败");
        }
      });
    },
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
button {
  padding: 3px 5px;
  margin: 10px;
  background-color: #00ccff99;
  border-radius: 4px;
  border: none;
  color: #fff;
  position: absolute;
  right: 0;
}
.select{
  background-color: #ffffff99;
}
</style>
