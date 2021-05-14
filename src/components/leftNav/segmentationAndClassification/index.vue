<template>
  <div id="segmentationAndClassification">
    <button @click="startExtract">开始分割</button>
    <button @click="startClassify" style="top: 200px;">开始分类</button>
    <!-- 地物分类 -->
    <div class="Leftstyle" v-if="simpleshow">
      <Left></Left>
    </div>
  </div>
</template>

<script>
import { get, post } from "@/api/load";
import Left from "@/components/tools/Left";
import LineLayer from "@/utils/Layers/LineLayer";
import PolygonLayer from "@/utils/Layers/PolygonLayer";
export default {
  components: {
    Left
  },
  props: {
    pointDataStr: {
      type: Array, //type为Array,default为函数
      default() {
        return [];
      }
    }
  }, //用props属性进行传数据，此时子组件已经获取到list的数据了
  data() {
    return {
      taskIdVal: "",
      simpleshow:false,
      shiliangcollection:""
    };
  },
  mounted() {},
  methods: {
    showSimpleStyle(){
      let self = this
      console.log(self.simpleshow)
      if(!self.simpleshow){
        self.simpleshow=true
      }else{
        self.simpleshow=false
      }
    },
    startExtract() {
      //开始分割
      if (this.pointDataStr.length === 0) {
        this.$Message.error("请先框选范围");
        return;
      } else if (this.pointDataStr.length < 4) {
        this.$Message.error("范围不合法");
        return;
      }
      var _this = this;
      let url = this.$interfacePath.identification.segmentationAndClassification.classify;
      // "https://piecloud.piesat.cn:8443/api/v1/business_server/sisa/classify";
      let polygon = [];
      for (let i = 0; i < this.pointDataStr.length; i++) {
        let mercatorPoint = this.getMercator(this.pointDataStr[i]);
        polygon.push(mercatorPoint);
      }
      let param = {
        modelId: "101f768132e643e287a1897284409f2b",
        polygon: polygon,
        splitType: {
          imgFilepath: "",
          initType: 4,
          thrdSize: 10,
          levelMinsize: 100,
          shape: 0.3,
          edge: 0.5,
          compact: 0.1
        }
      };
      post(url, param).then(data => {
        console.log("taskId2020/01/17/20:32",data)
        if (data.success) {
          window.clearTimeout(timeOut);
          _this.taskIdVal = data.data.taskId;
          this.$store.state.classificationTaskIdVal = data.data.taskId //矢量分割的类型
          _this.timer = window.setInterval(function() {
            _this.speed_of_progress(data.data.taskId);
          }, 2000);
        } else {
          window.clearTimeout(timeOut);
        }
      });
      let timeOut = window.setTimeout(() => {
        this.$Message.info("服务器连接超时");
      }, 15000);
    },
    startClassify() {
      //开始分类
      let _this = this;
      let url = this.$interfacePath.identification.segmentationAndClassification
        .automatic_classify;
      let param = {
        classifyParam: {
          classifyFilepath: "",
          imgFilepath: "",
          samFilePath: "",
          segFilePath: ""
        },
        modelId: "101f768132e643e287a1897284409f2b",
        polygon: this.pointDataStr,
        taskId: this.taskIdVal,
        tempId: 40
      };
      post(url, param).then(data => {
        if (data.success) {
          // _this.addjindu(0, 200, this.onloadClassifyData);
          this.timer = window.setInterval(function() {
            _this.speed_of_progress(data.data.taskId);
          }, 2000);
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    //第二个：进度接口
    speed_of_progress(taskId) {
      let _this = this;
      let url =
        this.$interfacePath.identification.segmentationAndClassification
          .modelTaskListByID + `/${taskId}`;

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
          this.$Message.error(data.message);
        }
      });
    },
    // 第三个：入库接口
    entrance(taskId) {
      window.clearInterval(this.timer);
      let url = this.$interfacePath.identification.segmentationAndClassification
        .getOutData;
      let param = {
        taskId,
        modelIded: this.modelIdeded
      };
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
      // console.log("矢量分割",data)
      this.$store.state.vectorid = data //矢量分割的类型
      console.log("矢量分割2020/01/17/14:23",this.$store.state.vectorid)
      // debugger
      var string = this.pointDataStr.join(";");
      console.log(string);
      let url = this.$interfacePath.identification.segmentationAndClassification
        .query_intersects;
      let param = {
        polygon: string,
        output: "geojson",
        type: data
      };
      get(url, param).then(data => {
        if (data.code == 0) {
          // console.log("终于成功啦！！！！！");
          this.showSimpleStyle()
          // for (let i = 0; i < data.data.features.length; i++) {
          //   data.data.features[i] = turf.polygonToLine(data.data.features[i]);
          // }
          // let line = new LineLayer({
          //   width: 3,
          //   color: "#f00",
          //   data: data.data,
          //   id: "分割矢量线"
          // });
          // this.map.layerManager.addLayer(line);
          // console.log("分割矢量线",data.data);
          // this.warehousing(data.data)
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
    getMercator(poi) {
      // Array [lon ,lat]经纬度
      var mercator = [];
      var earthRad = 6378137.0;
      mercator[0] = ((poi[0] * Math.PI) / 180) * earthRad;
      var a = (poi[1] * Math.PI) / 180;
      mercator[1] =
        (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
      return mercator; // Array[lon, lat]墨卡托
    },
  }
};
</script>

<style scoped>
#segmentationAndClassification {
}
#segmentationAndClassification button {
  padding: 3px 5px;
  margin: 10px;
  background-color: #00ccff99;
  border-radius: 4px;
  border: none;
  color: #fff;
  position: fixed;
  right: 600px;
  top: 150px;
}
.Leftstyle {
  position: fixed;
  right: 75px;
  background: #f1f2f6;
  border-radius: 5px;
  height: calc(100vh - 205px);
  top: 65px;
}
</style>
