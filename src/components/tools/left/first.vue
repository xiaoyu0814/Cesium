<template>
  <!-- 样本面板 -->
  <!-- 表格 -->
  <div class="div_out_height">
    <Table
      border
      :columns="simple_columns"
      :data="sample_list"
      height="200"
      @on-row-click="showSimpleData"
      tooltip="true"
    >
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <!-- <template slot="sample_name">
        <Tooltip content="Here is the prompt text">
          <strong>{{ row.name }}</strong>
        </Tooltip>
      </template>-->
      <template slot-scope="{row}" slot="color">
        <ColorPicker v-model="sample_list[row._index].color" @on-change="changeSimpleColor" />
      </template>
      <template slot-scope="{row}" slot="action">
        <Button
          icon="ios-trash-outline"
          type="error"
          size="small"
          @click="deleteStyleInformation(row)"
        ></Button>
      </template>
    </Table>
    <br />
    <!--  -->
    <div>
      <span>
        <div style="display:inline-block; margin-left:-143px">
          <Row>
            <ColorPicker v-model="color" />
          </Row>
        </div>
      </span>
      <Select v-model="message_model" style="width:200px" id="test">
        <Option
          v-for="item in message_list"
          :value="item.id"
          :key="item.value"
        >{{ item.sample_name }}</Option>
      </Select>
      <Button icon="ios-add-circle" @click="addTempDetails()"></Button>
    </div>
    <br />
    <div>
      <span style="color:#000;font-size: 16px;margin-left:-70px;">请先选择样本模板：</span>
      <Select
        v-model="template_model"
        style="width:200px;margin-left: 30px;"
        @click="queryDetailsByTempId(Option.value)"
        @on-change="updateSamplelist"
      >
        <Option v-for="item in template_list" :value="item.value" :key="item.value">{{ item.text }}</Option>
      </Select>
    </div>
    <br />
    <Button type="success" long @click="startClassify()">开始分类</Button>
    <br />
    <br />
    <Table height="200" :columns="data_columns" :data="querysimplelist"></Table>
  </div>
</template>

<script>
import { get, post } from "@/api/load";
import Bus from "@/api/bus.js";
import PolygonLayer from "@/utils/Layers/PolygonLayer";
import MouseEvent from "@/utils/MouseEvent";
export default {
  data() {
    return {
      currenttemplateid:"",
      addsimpleId:"",
      querysimplelist: [],
      // thecurrentdata:"",
      color: "#EFBD48",
      data_columns: [
        {
          title: "序号",
          key: "index"
        },
        {
          title: "ID",
          key: "ID"
        },
        {
          title: "尺度",
          key: "Scale"
        }
      ],
      changeSimpleData: {},
      sample_list: [],
      message_list: [],
      message_model: "",
      template_list: [],
      template_model: "",
      template_data: [],
      simple_columns: [
        {
          title: "序号",
          key: "index",
          width: 50,
          align: "center"
        },
        {
          title: "颜色",
          slot: "color",
          width: 90,
          align: "center"
        },
        {
          title: "名称",
          key: "sample_name",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.sample_name
                  }
                },
                params.row.sample_name
              )
            ]);
          }
        },
        {
          title: "数量",
          key: "count",
          width: 70,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 80,
          align: "center"
        }
      ],
      addTempList: []
    };
  },
  mounted() {
    this.addYangBeng();
    this.userStyle();
  },
  methods: {
    // 更新图层列表
    updateSamplelist() {
      // console.log("update");
      var self = this;
      self.queryDetailsByTempId();
    },
    changeSimpleColor(data){
      var temp = data;
      // console.log("yanbnzhongshujv",data)
      var self = this;
      let url =
        "http://piecloud.piesat.cn/api/v1/business_server/sample/updateTempDetails";
      let params = {
        color: temp,
        tempId: self.changeSimpleData.tempId,
        sampleId: self.changeSimpleData.sampleId
      };
      post(url, params).then(data => {
        // console.log("fei", data);
      });
    },
    // 样本模板 template
    userStyle() {
      // console.log("123debugger")
      // debugger
      let self = this;
      let url = this.$interfacePath.identification.segmentationAndClassification
        .queryTemp;
      // "http://piecloud.piesat.cn/api/v1/business_server/sample/queryTemp";
      get(url).then(data => {
        console.log("样本模板",data)
        var tp = data.data;
        for (var i = 0; i < tp.length; i++) {
          tp[i].name = i;
        }
        self.template_list = tp;
        self.template_model = self.template_list[0].value;
        self.queryDetailsByTempId(self.template_model);
      });
    },
    // 查询所有样本信息 message
    addYangBeng() {
      let self = this;
      let url = this.$interfacePath.identification.segmentationAndClassification
        .querySampleList;
      // "http://piecloud.piesat.cn/api/v1/business_server/sample/querySampleList";
      get(url).then(data => {
        var tp = data.data;
        for (var i = 0; i < tp.length; i++) {
          tp[i].value = i;
        }
        self.message_list = tp;
      });
    },
    // 模板id查询样本数据 data
    queryDetailsByTempId(tempId) {
      // debugger
      
      let self = this;
      self.currenttemplateid = tempId;
      console.log("模板id",self.currenttemplateid);
      let url = this.$interfacePath.identification.segmentationAndClassification
        .queryDetailsByTempId;
      // "http://piecloud.piesat.cn/api/v1/business_server/sample/queryDetailsByTempId";
      let params = {
        tempId: tempId ? tempId : self.template_model
      };
      get(url, params).then(data => {
        console.log("样本001",data.data)
        var tp = data.data;
        for (var i = 0; i < tp.length; i++) {
          tp[i].index = i + 1;
        }
        self.sample_list = tp;
        console.log ("2020/01/17/16:32-list1",self.sample_list)
        Bus.$emit("change", self.sample_list);
      });
    },
    //向指定模板中添加样本数据
    addTempDetails(row) {
      let self = this;
      let url = this.$interfacePath.identification.segmentationAndClassification
        .addTempDetails;
      // "http://piecloud.piesat.cn/api/v1/business_server/sample/addTempDetails";
      var options = $("#test option:selected");
      let params = {
        tempId: self.template_model,
        color: self.color,
        sampleId: self.message_model
      };
      post(url, params).then(data => {
        var tp = data;
        for (var i = 0; i < tp.length; i++) {
          tp[i].name = i;
        }
        self.addTempList = tp;
        self.queryDetailsByTempId(self.template_model);
      });
    },
    deleteStyleInformation(row) {
      var self = this;
      var id = row.value;
      let url =
        this.$interfacePath.identification.segmentationAndClassification
          .delTem +
        // "http://piecloud.piesat.cn/api/v1/business_server/sample/delTem/"
        `${id}`;
      get(url).then(data => {
        self.userStyle();
      });
    }, 

    query(simpleId) {
      var self = this;
      let url = this.$interfacePath.identification.segmentationAndClassification
        .query;
      // "http://piecloud.piesat.cn/api/v1/mongo/feature/query";
      let params = {
        outdata: "geojson",
        datasetId: simpleId
      };
      post(url, params).then(data => {
        var temp = data.data.features;
        for (var i = 0; i < temp.length; i++) {
          let querylist = {
            Scale: temp[i].properties.Scale,
            ogc_fid: temp[i].properties.ogc_fid,
            ID: temp[i].properties.ID,
            index: i + 1
          };
          self.querysimplelist.push(querylist);
         
        }
      });
    },
    // 标注样本颜色
    addcolor(simpleId,features){
      // console.log("simpleId",simpleId)
      // console.log("addsimpleId",this.addsimpleId)
      // console.log("features",features)
      let url = this.$interfacePath.identification.segmentationAndClassification.add;
      let params = {
        features: features,
        datasetId: simpleId,
        projectCode: 4326
      };
      post(url,params).then(data =>{
        console.log("2020/01/17/14:30",data)
        this.query(simpleId)
        this.queryDetailsByTempId(this.currenttemplateid)
        // console.log ("2020/01/17/17:40-list",self.sample_list)
      })
      // this.map.removeAllLayers()
      this.querySimpleColor() //标注样本图层显示标注好的颜色
    },
    // 请求模板样本图层
    querySimpleColor() {
      var self = this;
      // console.log(self.samplelist.length)
      for (var i = 0; i < self.sample_list.length; i++) {
        let id = self.sample_list[i].sample_name;
        let color = self.sample_list[i].color;
        let collection = self.sample_list[i].collection;
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
    showSimpleData(data) {
      var self = this;
      // let temp = data;
      self.changeSimpleData = {
        color: data.color,
        tempId: data.id,
        sampleId: data.sample_id
      };
      self.simpleColor = data.color;
      self.querysimplelist = [];
      //获取表格当前行数据
      let simpleId = data.collection;
      self.addsimpleId = simpleId;
      self.query(simpleId);
      console.log("SimpleData", simpleId);
      // 清除鼠标绘制功能并添加新功能
      self.map.MouseEvent.clearMouseEvent();
      self.map.getPoint((res)=>{
        // console.log("点击矢量图层上的一个点，返回的数据经纬度",res)
        // console.log("矢量图层的类型",this.$store.state.vectorid)
        let url = this.$interfacePath.other.query_intersects
        let params = {
          lon:res.longitude,
          lat:res.latitude,
          // projectionCode: 4326,
          type: this.$store.state.vectorid,
          output: "geojson"
        }
        get(url,params).then(data => {
          console.log("点击矢量图层，返回的面",data.data)
          let features = data.data.features
          self.addcolor(simpleId,features)
      });
      })     
    },
    //开始分类
    startClassify() {
      // console.log(this.$store.state.splitCoordinates)
      // console.log(this.template_model)
      // console.log(this.$store.state.classificationTaskIdVal)
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
        polygon: _this.$store.state.splitCoordinates,
        taskId: this.$store.state.classificationTaskIdVal,
        tempId: this.template_model
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
  }
};
</script>
<style>
/* 样式面板中表格的样式 */
.div_out_height {
  width: 460px;
  border: 1px solid #eee;
  border-radius: 3px;
  background-color: #fff;
  /* position: relative; */
  /* overflow: hidden; */
  height: calc(70% - 65px);
  text-align: center;
}
.false table {
  width: 430px;
  text-align: center;
}
.true table {
  width: 460px;
}
/* 假表头 */
.false {
  width: 100%;
  float: left;
  background-color: #f0f9ff;
}
/* 假表头宽度为（100% - 滚动条宽度） */
.false table {
  margin: 0;
  width: cale(100% - 19px);
}
.false thead {
  text-align: initial;
  /* text-align-last: center */
}
/* 表格滚动条 */
.true {
  overflow: scroll;
  overflow-x: hidden;
  /* clear: both; */
  max-height: 100px; /*给有滚动条的框架最大高度，超过这个高度就开始滚动*/
}
/* 隐藏真表头 */
.true thead {
  display: none;
}
/* .ivu-select-dropdown .ivu-transfer-no-max-height{
left: 40px!important;
} */
</style>