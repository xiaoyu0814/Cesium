<template>
  <div class="interpretation">
    <!--s 操作控件 s-->
    <div class="operationGroup" v-move style="z-index:3;">
      <div class="rightBorder" id="moveCursor">
        <span class="el-dropdown-link moveEdit">编辑</span>
      </div>
      <div class="rightBorder">
        <div
          :class="drawModel == 'SIMPLE_SELECT' ? 'activeItem' : ''"
          class="icon_box"
          title="选择"
          @click="isEdit?startSelFeature():null"
        >
          <i>
            <img src="static/img/select.png" style="vertical-align:top" />
          </i>
        </div>
      </div>
      <div class="rightBorder">
        <div class="drawBtnGroup">
          <div
            :class="drawModel == 'DRAW_POINT'?'activeItem': ''"
            class="icon_box"
            title="点"
            @click="isEdit && isEditPoint? drawPoint() :null"
          >
            <img src="static/img/dot.png" style="vertical-align:top" />
          </div>
          <div
            :class="drawModel == 'DRAW_LINE_STRING'?'activeItem': ''"
            class="icon_box"
            title="线"
            @click="isEdit && isEditLine? drawLine() :null"
          >
            <i>
              <img src="static/img/line2.png" style="vertical-align:top" />
            </i>
          </div>
          <div
            :class="drawModel == 'DRAW_POLYGON'?'activeItem': ''"
            class="icon_box"
            title="面"
            @click="isEdit && isEditPolygon? drawPolygon() :null"
          >
            <i>
              <img src="static/img/polygon2.png" style="vertical-align:top" />
            </i>
          </div>
          <div
            class="icon_box"
            :class="drawModel == 'DRAW_RECT'?'activeItem': ''"
            title="矩形"
            @click="isEdit && isEditPolygon? drawRect() :null"
          >
            <i>
              <img src="static/img/tran.png" style="vertical-align:top" />
            </i>
          </div>
          <div class="icon_box icon" title="圆" @click="isEdit && isEditPolygon? drawCircle() :null">
            <i>
              <img src="static/img/cir.png" style="vertical-align:top" />
            </i>
          </div>
        </div>
      </div>
      <div class="rightBorder" v-show="!isEditPoint">
        <div class="drawBtnGroup">
          <div
            :class="drawModel == 'BREAK_AREA'?'activeItem': ''"
            class="icon_box"
            title="面分割"
            @click="breakCanvas()"
          >
            <i>
              <img src="static/img/fillS.png" style="vertical-align:top" />
            </i>
          </div>
          <div class="icon_box" title="拼接" @click="isSelModal?aggregate_polygon():null">
            <i>
              <img src="static/img/contact.png" style="vertical-align:top" />
            </i>
          </div>
        </div>
      </div>
      <div
        class="icon_box"
        style="width: 28px;justify-content: center;cursor: pointer;"
        title="删除"
        @click="isSelModal?start_deleteFeature():null"
      >
        <i>
          <img src="static/img/del.png" style="vertical-align:top" />
        </i>
      </div>
      <div class="rightBorder" style="padding: 0;">
        <div class="icon_box" title="属性表" @click="isSelModal?openAttrBox():null">
          <Icon type="ios-paper-outline" />
        </div>
      </div>
    </div>
    <!--e 操作控件 e-->
  </div>
</template>
<script>
import {addDatasetData,updataDatasetData,deleteFeatures} from '@/api/dataset';
export default {
  props: ["currentLayer"],
  data() {
    return {
      tipStep: 0, //当前提示步骤进度
      drawModel: "", //当前绘制模式
      showAlert: true, // 是否显示操作提示
      alertContent: "", // 操作提示内容
      mapBase: null,
      showFactory: false,
      pointDataStr: "",
      features: null,
      showCoordinates: false,
      mapEditorObj: null,
      isEdit: true,
      isSelModal: true,
      editDtLayer: null,
      isEditPoint: true,
      isEditLine: true,
      isEditPolygon: true,
      attr_contarin: false,
      select_Obj:null,
      attrForm: {},
      attrData: [
        {
          label: "",
          value: ""
        }
      ]
    };
  },
  mounted(){
      console.log("draw 初始化")
  },
  methods: {
    clearDrawMapByLayerName() {
      // 关闭mapbox-gl-draw的编辑图层
      let layers = this.mapBase.getStyle().layers;
      console.log("TCL: clearDrawMapByLayerName -> layers", layers);
    },
    onDeleteLayerByName(dtName) {
      if (dtName == "" || !dtName) return;
      this.mapBase.removeLayer(dtName);
      this.mapBase.removeSource(dtName);
      this.mapEditorObj.deleteAll();
    },

    onlayerListChange(layerList) {
      // 图层列表更改时触发
      if (layerList.length == 0) {
      }
    },
    breakCanvas() {
      const selected = this.mapEditorObj.getSelectedIds().length;
      if (selected == 0) {
        this.$message.error("请先使用选择工具选择操作目标!");
        return;
      }
      if (selected > 1) {
        this.$message.error("面分割只能操作单个目标!");
        return;
      }
      this.drawModel = "BREAK_AREA";
      this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
      this.mapEditorObj.breakCanvas(() => {
        this.startSelFeature();
      });
    },
    drawPolygon() {
      //绘制面
      this.drawModel = "DRAW_POLYGON";
      let _this = this;
      this.map.getPolygon(false, res => {
        console.log(res);
        let param = {
          datasetId: _this.currentLayer.data_id,
          features: [
            {
              action: "create",
              geometry: {
                type: "Polygon",
                coordinates: [[]]
              },
              id: 0,
              properties: {},
              type: "feature",
              version: 0
            }
          ]
        };
        for (let i = 0; i < res.length; i++) {
          param.features[0].geometry.coordinates[0].push([
            res[i].longitude,
            res[i].latitude
          ]);
        }
        if (_this.currentLayer.type == "polygon") {
          addDatasetData(param).then(res => {
            console.log(res);
          });
        }
      });
    },
    drawLine() {
      //绘制线
      this.drawModel = "DRAW_LINE_STRING";
      let _this = this;
      this.map.getLine(res => {
        console.log(res);
        let param = {
          datasetId: _this.currentLayer.data_id,
          features: [
            {
              action: "create",
              geometry: {
                type: "LineString",
                coordinates: []
              },
              id: 0,
              properties: {},
              type: "feature",
              version: 0
            }
          ]
        };
        for (let i = 0; i < res.length; i++) {
          param.features[0].geometry.coordinates.push([
            res[i].longitude,
            res[i].latitude
          ]);
        }
        if (_this.currentLayer.type == "line") {
          addDatasetData(param).then(res => {
            console.log(res);
          });
        }
      });
    },
    drawPoint() {
      //绘制点
      this.drawModel = "DRAW_POINT";
      let _this = this;
      this.map.getPoint(res => {
        console.log(res);
        let param = {
          datasetId: _this.currentLayer.data_id,
          features: [
            {
              action: "create",
              geometry: {
                type: "Point",
                coordinates: [res.longitude, res.latitude]
              },
              id: 0,
              properties: {},
              type: "feature",
              version: 0
            }
          ]
        };
        addDatasetData(param).then(res => {
          console.log(res);
        });
      });
      //this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
      ///this.mapEditorObj.setAction("draw_point");
    },
    drawRect() {
      //绘制矩形
      this.drawModel = "DRAW_RECT";
      let _this = this;
      this.map.getRectangle(res => {
        console.log(res);
        let param = {
          datasetId: _this.currentLayer.data_id,
          features: [
            {
              action: "create",
              geometry: {
                type: "Polygon",
                coordinates: []
              },
              id: 0,
              properties: {},
              type: "feature",
              version: 0
            }
          ]
        };
        // addDatasetData(param).then((res)=>{
        //   console.log(res);
        // });
      });
    },
    drawCircle() {
      this.drawModel = "DRAW_Circle";
      let _this = this;
      this.map.getCircle(res => {
        console.log(res);
        let param = {
          datasetId: _this.currentLayer.data_id,
          features: [
            {
              action: "create",
              geometry: {
                type: "Polygon",
                coordinates: []
              },
              id: 0,
              properties: {},
              type: "feature",
              version: 0
            }
          ]
        };
        // addDatasetData(param).then((res)=>{
        //   console.log(res);
        // });
      });
    },
    selectFeature(pick){
        let  _this = this;
        var dataSources = _this.map.map.dataSources;
        for (var i= 0; i < dataSources.length; i++) {
            if (_this.currentLayer.id==pick.id.entityCollection.owner.id) {
                console.log(dataSources.get(i));
                if(_this.currentLayer.type == "line"){
                  let positions = pick.id.polyline.positions.getValue(); 
                  _this.map.drawHelper.showModifyPolyline(positions,_this.save_Feature,function(res){console.log(res)});
                }else if(_this.currentLayer.type == "polygon"){
                  let positions = pick.id.polygon.hierarchy.getValue().positions; 
                  _this.map.drawHelper.showModifyPolygon(positions,_this.save_Feature,function(res){console.log(res)}); 
                }else if(_this.currentLayer.type == "point"){
                    let positions = pick.id.position.getValue();
                    _this.map.drawHelper.showModifyPoint(positions,_this.save_Feature,function(res){console.log(res)});
                    
                }
                
                if(_this.select_Obj){
                  _this.select_Obj.show = true;
                  _this.select_Obj = null;
                }
                _this.select_Obj = pick.id;
                _this.select_Obj.show = false;
                break;
            }
        }
    },
    startSelFeature() {
      //选择模式
      let layer = this.map.layerManager.getLayer({
        data_type: "GeoJson",
        id: this.currentLayer.id
      });
      let scene = this.map.map.scene;
			let camera = scene.camera;
      let Iconhandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

      let _this = this;
  
			Iconhandler.setInputAction(function(movement) {
				// Star burst on left mouse click.
				var pick = scene.pick(movement.position);
				 if (Cesium.defined(pick)){
           console.log(pick);
            _this.selectFeature(pick);
          
				 }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      
      Iconhandler.setInputAction(function (event) {
        _this.map.drawHelper.clear();
        if(_this.select_Obj){
          _this.select_Obj.show = true;
          _this.select_Obj = null;
        }
         
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    save_Feature(points){
      let _this = this;
      console.log(points);
      console.log(_this.select_Obj.id);
      let coordinates = [];
      let param = {

        "dataset_list": [
          {
            "dataset_id": _this.currentLayer.data_id,
            "features": [
              {
                "action": "modify",
                "geometry": {
                  "type":"LineString",
                  "coordinates":[]
                },
                "id": _this.select_Obj.id,
                "properties": {},
                "type": "feature",
                "version": 0
              }
            ],
            "filters": [],
            "id_container": {}
          }
        ],
      }

      for(let i=0;i<points.length;i++){
        let cartographic = Cesium.Cartographic.fromCartesian(points[i])
        coordinates.push([Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)]);
      }
      if(_this.currentLayer.type == "line"){
         _this.select_Obj.polyline.positions  =points;
        param.dataset_list[0].features[0].geometry.type = "LineString";
        param.dataset_list[0].features[0].geometry.coordinates = coordinates;
      }else if(_this.currentLayer.type == "polygon"){
        _this.select_Obj.polygon.hierarchy=new Cesium.PolygonHierarchy(points);
        param.dataset_list[0].features[0].geometry.type = "Polygon";
        param.dataset_list[0].features[0].geometry.coordinates = [coordinates];
      }else if(_this.currentLayer.type == "point"){
          param.dataset_list[0].features[0].geometry.type = "Point";

           _this.select_Obj.position.setValue(points);
          let cartographic = Cesium.Cartographic.fromCartesian(points)
          param.dataset_list[0].features[0].geometry.coordinates = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
        //_this.select_Obj.point.positions  =points;
      }
     
      updataDatasetData(param).then((res)=>{
        console.log(res);
      });
    },
    aggregate_polygon() {
      //拼接面
      if (this.mapEditorObj.getSelectedIds().length < 2) {
        this.$message.error("请至少选择两个要进行合并的目标");
        return;
      }
      var _this = this;
      this.http
        .get(_this.GlobalUrlPath.interpretation.aggregate_polygon, {
          datasetId: _this.editDtLayer.dtName,
          ids: _this.mapEditorObj.getSelectedIds().join(",")
        })
        .then(res => {
          console.log(res);
          _this.mapEditorObj.refresh();
          _this.mapEditorObj.delete(_this.mapEditorObj.getSelectedIds());
        });
    },
    deleteFeature(obj){
      if(!obj) return;
      let _this = this;
      let coordinates = [];
      let param = {
        "datasetId": _this.currentLayer.data_id,
        "features": [
          {
            "id": obj.id 
          }
        ]
      }
   this.$Modal.confirm({
          title: '删除数据',
          content: '<p>此操作将永久删除该数据, 是否继续?</p>',
          onOk: () => {
              deleteFeatures(param).then(res => {
                obj.show = false;
                _this.$Message.info('删除成功！');
              });
              
          },
          onCancel: () => {
              this.$Message.info('已取消删除');
          }
      });
     
    },
    start_deleteFeature() {
      //删除

      let scene = this.map.map.scene;
			let camera = scene.camera;
      let Iconhandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

      let _this = this;
  
			Iconhandler.setInputAction(function(movement) {
				// Star burst on left mouse click.
				var pick = scene.pick(movement.position);
				 if (Cesium.defined(pick)){
           console.log(pick);
            let dataSources = _this.map.map.dataSources;
              for (var i= 0; i < dataSources.length; i++) {
                if (_this.currentLayer.id==pick.id.entityCollection.owner.id) {
                  
                    if(_this.currentLayer.type == "line"){
                      let postions = pick.id.polyline.positions.getValue();  
                    }else if(_this.currentLayer.type == "polygon"){
                      let postions = pick.id.polygon.hierarchy.getValue().positions; 
                    }else if(_this.currentLayer.type == "point"){

                    }
                    _this.deleteFeature(pick.id);
                    break;
                }
              }
            
				 }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      
    },
    startEdit() {
      //开始编辑
      if (!this.editDtLayer) return;
      this.isEdit = true;
      this.isSelModal = false;
      this.startSelFeature();
      this.isEditPoint = false;
      this.isEditLine = false;
      this.isEditPolygon = false;
      if (this.editDtLayer.dtType == 1) {
        this.isEditPoint = true;
      } else if (this.editDtLayer.dtType == 2) {
        this.isEditLine = true;
      } else if (this.editDtLayer.dtType == 3) {
        this.isEditPolygon = true;
      }
      //创建绘制对象
    },
    endEdit() {
      //结束编辑
      this.isEdit = false;
      this.isSelModal = false;
      this.isEditPoint = false;
      this.isEditLine = false;
      this.isEditPolygon = false;
      // this.mapEditorObj = null;
    },
    submitForm(formName) {
      //修改属性
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.mapEditorObj.setProperties(_this.attrForm);
          _this.attr_contarin = false;
          _this.$message.success("保存成功！");
        } else {
          return false;
        }
      });
    },
    openAttrBox() {
      //打开属性表
      var _this = this;
      if (Object.keys(this.mapEditorObj.getProperties()).length == 0) {
        this.$message.warning("当前没有可编辑的属性！");
        return;
      } else if (this.mapEditorObj.getSelectedIds().length > 1) {
        this.$message.warning("不支持多目标编辑的属性！");
        return;
      } else {
        this.attr_contarin = true;
        this.attrData = [];
        this.attrForm = this.mapEditorObj.getProperties();
        Object.keys(_this.mapEditorObj.getProperties()).forEach(function(key) {
          _this.attrData.push({
            label: key,
            value: _this.mapEditorObj.getProperties()[key]
          });
        });
      }
    },
    drawCutLine() {
      //绘制面分割的线
      let _this = this;
      this.clearLayer("polygonLine");
      let line;
      let theArr = [];
      let canvas = this.mapBase.getCanvasContainer();
      function ondblclick(e) {
        _this.mapBase.off("mousemove", onMove);
        _this.mapBase.off("click", onDown);
        canvas.style.cursor = "";
        theArr = [];
      }
      function onMove(e) {
        theArr[theArr.length - 1] = e.lngLat.toArray();
        line = turf.lineString(theArr);
        _this.mapBase.getSource("polygonLine").setData(line);
      }
      function onDown(e) {
        //生成面的坐标
        if (theArr.length >= 2) {
          theArr.splice(theArr.length - 1, 0, e.lngLat.toArray());
        } else {
          theArr.push(e.lngLat.toArray());
          theArr.push(e.lngLat.toArray());
        }
        theArr.push(e.lngLat.toArray());
        line = turf.lineString(theArr);
        //绘制线
        if (!_this.mapBase.getLayer("polygonLine")) {
          _this.mapBase.addLayer({
            id: "polygonLine",
            type: "line",
            source: {
              type: "geojson",
              data: line
            },
            layout: {},
            paint: {
              "line-color": "#37C637",
              "line-width": 2 
            }
          });
        } else {
          _this.mapBase.getSource("polygonLine").setData(line);
        }
        _this.mapBase.on("mousemove", onMove);
        _this.mapBase.once("dblclick", ondblclick);
      }
      this.mapBase.on("click", onDown);
      canvas.style.cursor = "pointer";
    },
    updateOperateAlert() {
      // 更新操作提示
      if (this.drawModel == "SIMPLE_SELECT") return;
      if (this.tipStep >= ALERT_CONTENT[this.drawModel].length - 1) return;
      this.tipStep += 1;
      this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
    },
    resetOperateAlert() {
      // 还原
      this.tipStep = 0;
      this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
    }
  },
  beforeDestroy() {},
  destroyed() {
    if (document.getElementById("box")) {
      document.getElementById("box").remove();
    }
  },
  directives: {
    move(el, bind) {
      let cursor = el.querySelector("#moveCursor");
      cursor.style.cursor = "move";
      let x = 0;
      let y = 0;
      let l = 0;
      let t = 0;
      cursor.onmousedown = function(e) {
        e.preventDefault();
        x = e.clientX;
        y = e.clientY;

        //获取左部和顶部的偏移量
        l = el.offsetLeft;
        t = el.offsetTop;
        window.addEventListener("mousemove", mouseMove);
      };
      function mouseMove(e) {
        e.preventDefault();
        var nx = e.clientX;
        var ny = e.clientY;
        //计算移动后的左偏移量和顶部的偏移量
        var nl = nx - (x - l);
        var nt = ny - (y - t);
        el.style.left = nl + "px";
        el.style.top = nt + "px";
      }
      cursor.onmouseup = function() {
        window.removeEventListener("mousemove", mouseMove);
      };
    }
  }
};
</script>
<style lang="less">
.interpretation {
  #mapBase {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    // z-index: 9;
  }
  .operationGroup {
    position: fixed;
    height: 26px;
    top: 100px;
    left: 75%;
    background: rgba(0, 0, 0, 0.7);
    padding: 0px 3px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    > div {
      height: 26px;
      display: flex;
      align-items: center;
    }
    .activeItem {
      background: #2ca8ff;
    }
    .rightBorder {
      border-right: 1px solid #999;
      padding: 0 5px;
      .el-dropdown-link {
        cursor: pointer;
        color: #fff;
      }
      .icon_box {
        width: 20px;
        height: 20px;
        // padding: 3px;
        margin: 0 2px;
        height: 100%;
        padding: 3px 0;
        width: 26px;
        display: flex;
        justify-content: center;
        cursor: pointer;
        .el-icon-top-left:before,
        .el-icon-location:before,
        .el-icon-minus:before,
        .el-icon-full-screen:before,
        .el-icon-picture-outline:before,
        .el-icon-s-marketing:before,
        .el-icon-crop:before,
        .el-icon-document:before,
        .el-icon-delete:before {
          font-size: 17px;
          color: #fff;
        }
      }
      .icon_box_disabled {
        // background: rgb(236, 235, 235);
        .el-icon-top-left:before,
        .el-icon-location:before,
        .el-icon-minus:before,
        .el-icon-full-screen:before,
        .el-icon-picture-outline:before,
        .el-icon-s-marketing:before,
        .el-icon-crop:before,
        .el-icon-document:before,
        .el-icon-delete:before {
          color: #bbb;
        }
      }
      .icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .drawBtnGroup {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }
    .rightBorder:last-child {
      border-right: none;
    }
  }
  .operate-alert {
    position: fixed;
    top: 55px;
    width: 100%;
    text-align: center;
    // .alert-content {
    // }
  }
  .op-alert {
    position: fixed;
    top: 58px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
.moveEdit {
  cursor: move !important;
}
.attr_contarin {
  background: #f1f2f6;
  .el-dialog__header {
    padding: 14px 20px 10px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 14px;
    }
  }
  .el-dialog__body {
    margin: 10px 20px;
    padding: 10px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    background: #fff;
    border-radius: 5px;
  }
  .el-dialog__footer {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    background: #f1f2f6;
  }
}
.ivu-modal {
  .ivu-modal-content {
    // padding: 10px;
  }
}
</style>
