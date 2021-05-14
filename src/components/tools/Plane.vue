<template>
  <div>
    <div class="row">
      <div class="fly">
        <div class="imgIcon" v-show="imgIcons">
          <img
            src="../../assets/jichang.png"
            class="jichang"
            alt="机场检测"
            title="机场检测"
            @click="airportDetection"
          />
          <img
            src="../../assets/chuanjian.png"
            class="chuanjian"
            alt="船舰识别"
            title="船舰识别"
            @click="shipRecognition"
          />
          <img
            src="../../assets/greenhouse.png"
            title="大棚识别"
            @click="greenhouseIcon"
            id="greenhouse"
            alt
          />
          <img src="../../assets/planes.png" title="飞机识别" alt @click="planeIcon" id="planeIcon" />
        </div>
      </div>
      <div class="plane">
        <img src="../../assets/target.png" alt="目标识别" title="目标识别" @click="targetIcon" />
      </div>
    </div>

    <div class="start">
      <button @click="start(detectType)">开始</button>
    </div>
  </div>
</template>
<script>
import { get, post } from "@/api/load";
// import $ from "jquery"
export default {
  data() {
    return {
      imgIcons: false,
      hideplane: true,
      modelIdeded: "831c48db9185430fb8a354efe60f49a9",
      planeParamed: {
        detectType: "",
        gtPath: "", //识别固定参数
        imagePath: "" //识别固定参数
      },
      polygoned: [], //
      taskid: ""
    };
  },
  methods: {
    targetIcon() {
      this.imgIcons = !this.imgIcons;
    },
    // 大棚识别
    greenhouseIcon() {
      this.detectType = "GREENHOUSE";
      var _this = this;
      this.imgIcons = !this.imgIcons;
      this.map.gotoView([116.6462, 40.1571, 2000]);
      this.map.getPolygon(false, function(data) {
        _this.fn(data);
      });
    },
    //机场检测
    airportDetection() {
      this.detectType = "AIRPORT";
      var _this = this;
      this.imgIcons = !this.imgIcons;
      this.map.gotoView([116.411, 39.5103, 6500]);
      this.map.getPolygon(false, function(data) {
        _this.fn(data);
      });
    },
    //船舰识别
    shipRecognition() {
      this.detectType = "SHIP";
      var _this = this;
      this.imgIcons = !this.imgIcons;
      this.map.gotoView([129.7152, 33.158, 6055]);
      this.map.getPolygon(false, function(data) {
        _this.fn(data);
      });
    },
    //飞机识别
    planeIcon() {
      this.detectType = "PLANE";
      var _this = this;
      this.imgIcons = !this.imgIcons;
      this.map.gotoView([-115.0352, 36.2394, 1000]);
      this.map.getPolygon(false, function(data) {
        _this.fn(data);
      });
    },
    //飞机识别开始检测
    start(detectType) {
      console.log(detectType);
      this.planeParamed.detectType = detectType;
      this.algorithm();
      this.$Loading.start();
    },
    // 获取识别范围
    fn(dataArray) {
      var _this = this;
      this.polygoned = [];
      for (var i = 0; i < dataArray.length; i++) {
        _this.polygoned.push([dataArray[i].longitude, dataArray[i].latitude]);
      }
      console.log(_this.polygoned);
      return _this.polygoned;
    },
    algorithm() {
      // 飞机检测 第一个接口：算法调取
      let _this = this;
      let url = "http://cloud.piesat.cn/api/v1/business_server/ai/detect";
      let param = {
        modelId: modelIding,
        planeParam: planeParaming,
        polygon: polygoning
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
    //第二个：进度接口
    jindu: function(taskId) {
      let url =
        "http://cloud.piesat.cn/api/v1/business_server/task/modelTaskListByID/" +
        taskId;
      get(url).then(data => {
        if (data.success) {
          // console.log(data.success)
          if (data.data.taskStatus == 2) {
            clearInterval(this.timer);
            this.ruku(taskId);
          }
        } else {
          this.$Message.error("调取进度接口失败");
        }
      }); 
    },
    // 第三个：入库接口
    ruku: function(taskId) {
      let param = {
        taskId,
        modelIded: this.modelIdeded
      };
      let url =
        "http://cloud.piesat.cn/api/v1/business_server/data_list/getOutData";
      get(url, param).then(data => {
        if (data.success) {
          this.result(data.data);
        } else {
          this.$Message.error("调取入库接口失败");
        }
      });
    },
    // 第四个：查询结果
    result: function(data) {
      var string = this.polygoned.join(";");
      console.log(string);
      let url =
        "http://cloud.piesat.cn/geographic_search/v1/geocode/query_intersects?polygon=" +
        string +
        "&output=geojson&type=" +
        data;
      get(url, null).then(data => {
        if (data.code == 0) {
          console.log("终于成功啦！！！！！");
          this.map.layerManager.addLayer({
            data: data.data,
            type: "GeoJson",
            id: data
          });
        } else {
          this.$Message.error("调取查询结果接口失败");
        }
      });
    }
  }
};
</script>
<style scoped>
.fly {
  display: flex;
}
.row {
  display: flex;
}
/* 目标识别样式 */
.plane {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #39aaf8;
  border-radius: 5px;
}
/* 图片样式 */
.plane > img {
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 四张图片的整体样式 */
.imgIcon {
  width: 120px;
  background-color: gray;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
}
/* 飞机识别 大棚识别*/
#planeIcon,
#greenhouse,
.jichang,
.chuanjian {
  margin-top: 5px;
  margin-left: 5px;
  cursor: pointer;
}
/* {
  display: flex;
  width: 20px;
  height: 20px;
  cursor: pointer;
} */
/* 开始按钮 */
.start {
  position: absolute;
  top: 50px;
  right: -15px;
}
button {
  width: 40px;
  height: 20px;
  background-color: #39aaf8;
  border-radius: 5px;
  border: 1px solid #39aaf8;
  margin-top: 50px;
  display: flex;
  justify-content: center;
}
</style>