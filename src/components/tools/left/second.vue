<template>
  <div>
    <!-- 图层面板 -->
    <div class="checkbox">
      <span style="height:20"></span>
      <!-- <Checkbox :checked="single" @on-change="segmentationVector">分割矢量</Checkbox>
      <Checkbox :checked="single" @on-change="warehousing">工矿仓储用地</Checkbox>
      <Checkbox :checked="single" @on-change="garden">园地</Checkbox>
      <Checkbox :checked="single" @on-change="publicLand">公共管理与公共服务用地</Checkbox>
      <Checkbox :checked="single" @on-change="specialLand">特殊用地</Checkbox>
      <Checkbox :checked="single" @on-change="arableLand">耕地</Checkbox>
      <Checkbox :checked="single" @on-change="grassland">草地</Checkbox>
      <Checkbox :checked="single" @on-change="residentialLand">住宅用地</Checkbox>
      <Checkbox :checked="single" @on-change="transportation">交通运输用地</Checkbox>
      <Checkbox :checked="single" @on-change="otherLand">其他土地</Checkbox>
      <Checkbox :checked="single" @on-change="commercialPlace">商服用地</Checkbox>
      <Checkbox :checked="single" @on-change="Waters">水域及水利设施用地</Checkbox>
      <Checkbox :checked="single" @on-change="woodland">林地</Checkbox>-->
      <div class="samplestyle">
        <Table border ref="selection" :columns="column" :data="samplelist" @on-select-cancel="hideLayers" @on-select="showLayers"></Table>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from "@/api/bus.js";
import PolygonLayer from "@/utils/Layers/PolygonLayer";
import { get, post } from "@/api/load";
export default {
  data() {
    return {
      column: [
        {
          type: "selection",
          width: 60,
          align: "left",
         
        },
        {
          title: "图层",
          // width: 100,
          key: "sample_name",
          align: "center",
          // _checked: true
        }
      ],
      single: false,
      samplelist: []
    };
  },
  created() {
    var self = this;
    Bus.$on("change", first => {
      var tempdata = first;
      console.log ("2020/01/17/16:32-list2",tempdata)
      // console.log("sample_list", first)
      // 需要调整的逻辑，样本标注完成后，分类完成调用
      if (tempdata.length != 0) {
        self.samplelist = [];
      }
      for (var i = 0; i < tempdata.length; i++) {
        var temp = {
          color: tempdata[i].color,
          sample_id: tempdata[i].sample_id,
          count: tempdata[i].count,
          id: tempdata[i].id,
          collection: tempdata[i].collection,
          sample_name: tempdata[i].sample_name,
          index: tempdata[i].index,
          _checked : true
        };

        self.samplelist.push(temp);
        // this.query(temp.collection,temp.color)
      }
      // console.log("samplelist", self.samplelist);
      // this.map.layerManager.reload()
      // 准备调整逻辑-1
      // self.query();// 样本图层加载
    });
  },
  mounted() {
    //  this.warehousing()
  },
  methods: {
    // 清除地图上的模板图层
    clearDelete(){
      var self = this
      if(self.samplelist!=null){
        // console.log(self.samplelist)
        console.log(self.samplelist)
      }
    },
    // 请求模板样本图层
    query() {
      var self = this;
      // console.log(self.samplelist.length)
      for (var i = 0; i < self.samplelist.length; i++) {
        let id = self.samplelist[i].sample_name;
        let color = self.samplelist[i].color;
        let collection = self.samplelist[i].collection;
        // console.log(id, collection, color);
        let url = this.$interfacePath.identification
          .segmentationAndClassification.query;
        // // "http://piecloud.piesat.cn/api/v1/mongo/feature/query";
        let params = {
          datasetId: collection,
          outdata: "geojson",
         // projectCode: "4326"
        };
        post(url, params).then(data => {
          let polygon = new PolygonLayer({
            strokeWidth: 3,
            strokeColor: "#f00",
            fillColor: color,
            opacity: 1,
            //isFill: false,
            data: data.data,
            id: id
          });
          self.map.layerManager.addLayer(polygon);
          // self.map.layerManager.hideLayer({data_type:"GeoJson",id:"林地"})
          // self.map.layerManager.getLayer({data_type:"GeoJson",id:"园地"})
        });
      }
      // self.clearsample()
    },
    // 样本图层隐藏
    hideLayers(selection,row){
      let self = this
      if(row._checked){
        row._checked = false
        self.map.layerManager.hideLayer({data_type:"GeoJson",id:row.sample_name})
      }
      // console.log("hideselection",selection)
      //console.log("hiderow",row)
    },
    // 样本图层显示
    showLayers(selection,row){
      let self = this
       console.log("showrow",row)
      // debugger
      self.map.layerManager.showLayer({data_type:"GeoJson",id:row.sample_name})
      // console.log("showselection",selection)
      console.log("showrow",row)
    },
    // 清除模板图层
    clearsample(){
      let self = this;
      console.log("test",self.samplelist)
    },
    // 分割矢量
    segmentationVector(data) {
      // var temp = data;
      // console.log(temp);
      // if (temp == true) {
      //   alert("调用分割矢量图层");
      // } else {
      //   alert("删除图层");
      // }
    },
    // 工矿仓储用地
    warehousing() {
      // var temp = data;
      // var self = this
      // debugger
      // self.map.getPosition()
      // let ware = new PolygonLayer({
      //     strokeWidth: 3,
      //     strokeColor: "#f00",
      //     fillColor: "#666",
      //     opacity: 1,
      //     // isFill: false,
      //     // data: data.data,
      //     id: "67"
      //   });
      //   self.map.layerManager.addLayer(ware);
    },
    // 园地
    garden(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用园地图层");
      } else {
        alert("删除图层");
      }
    },
    // 公共管理与公共服务用地
    publicLand(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用公共管理与公共服务用地图层");
      } else {
        alert("删除图层");
      }
    },
    // 特殊用地
    specialLand(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用特殊用地图层");
      } else {
        alert("删除图层");
      }
    },
    // 耕地
    arableLand(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用耕地图层");
      } else {
        alert("删除图层");
      }
    },
    // 草地
    grassland(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用草地图层");
      } else {
        alert("删除图层");
      }
    },
    // 住宅用地
    residentialLand(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用住宅用地图层");
      } else {
        alert("删除图层");
      }
    },
    // 交通运输用地
    transportation(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用交通运输用地图层");
      } else {
        alert("删除图层");
      }
    },
    // 其他土地
    otherLand(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用其他土地图层");
      } else {
        alert("删除图层");
      }
    },
    // 商服用地
    commercialPlace(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用商服用地图层");
      } else {
        alert("删除图层");
      }
    },
    // 水域及水利设施用地
    Waters(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用水域及水利设施用地图层");
      } else {
        alert("删除图层");
      }
    },
    // 林地
    woodland(data) {
      var temp = data;
      console.log(temp);
      if (temp == true) {
        alert("调用林地图层");
      } else {
        alert("删除图层");
      }
    }
  }
};
</script>

<style>
.checkbox {
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  color: #000;
    overflow: scroll;
  overflow-x: hidden;
      height: 600px;
}
.ivu-checkbox-wrapper {
  font-size: 16px;
  margin-bottom: 5px;
}
.ivu-table-wrapper {
  position: relative;
  overflow: hidden;
  /* border: 1px solid #dcdee2; */
  /* border-bottom: 0; */
  /* border-right: 0; */
  /* height:700; */
  
  width: 455px;
}
.ivu-table {
  width: inherit;
  color: #515a6e;
  font-size: 12px;
  background-color: #fff;
  box-sizing: border-box;
}
.samplestyle{
  height: 520px;
}
</style>