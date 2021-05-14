<template>
  <div class="interpretation" style="    position: absolute;
    right: 0px;">
    <!--s 操作控件 s-->
   <div id="toolbar">
    </div>
    <div id="logging">
    </div>
    <!--e 操作控件 e-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawHelper:"",//编辑操作
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
      attrForm: {},
      attrData: [
        {
          label: "",
          value: ""
        }
      ]
    };
  },
  // methods: {
  //   clearDrawMapByLayerName() {
  //     // 关闭mapbox-gl-draw的编辑图层
  //     let layers = this.mapBase.getStyle().layers;
  //     console.log("TCL: clearDrawMapByLayerName -> layers", layers);
  //   },
  //   onDeleteLayerByName(dtName) {
  //     if (dtName == "" || !dtName) return;
  //     this.mapBase.removeLayer(dtName);
  //     this.mapBase.removeSource(dtName);
  //     this.mapEditorObj.deleteAll();
  //   },
  //   openMap(arr) {
  //     if (arr.length == 0) return;
  //     for (let i = 0; i < arr.length; i++) {
  //       arr[i].layerShow == true;
  //       if (arr[i].dtType == 1) {
  //         this.addDataSetLayerPoint(arr[i].dtName);
  //       } else {
  //         this.addDataSetLayer(arr[i].dtName);
  //       }
  //     }
  //   },
  //   onlayerListChange(layerList) {
  //     // 图层列表更改时触发
  //     if (layerList.length == 0) {
  //     }
  //   },
  //   breakCanvas() {
  //     const selected = this.mapEditorObj.getSelectedIds().length;
  //     if (selected == 0) {
  //       this.$message.error("请先使用选择工具选择操作目标!");
  //       return;
  //     }
  //     if (selected > 1) {
  //       this.$message.error("面分割只能操作单个目标!");
  //       return;
  //     }
  //     this.drawModel = "BREAK_AREA";
  //     this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
  //     this.mapEditorObj.breakCanvas(() => {
  //       this.startSelFeature();
  //     });
  //   },
  //   drawPolygon() {
  //     //绘制面
  //     this.drawModel = "DRAW_POLYGON";
  //     this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
  //     this.mapEditorObj.setAction("draw_polygon");
  //   },
  //   drawLine() {
  //     //绘制线
  //     this.drawModel = "DRAW_LINE_STRING";
  //     this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
  //     this.mapEditorObj.setAction("draw_line_string");
  //   },
  //   drawPoint() {
  //     //绘制点
  //     this.drawModel = "DRAW_POINT";
  //     this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
  //     this.mapEditorObj.setAction("draw_point");
  //   },
  //   drawRect() {
  //     //绘制矩形
  //     this.drawModel = "DRAW_RECT";
  //     this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
  //     this.mapEditorObj.setAction("draw_rect");
  //   },
  //   addDataSetLayer(dtName) {
  //     //添加数据集数据
  //     this.mapBase.addLayer({
  //       id: dtName,
  //       type: "line",
  //       source: {
  //         type: "geojson-wms",
  //         data: {
  //           epsg: 4326,
  //           type: "Feature",
  //           properties: {},
  //           geometry: {
  //             type: "LineString",
  //             coordinates: [[-180, -90], [180, 90]]
  //           }
  //         },
  //         dataUrl:
  //           this.GlobalUrlPath.interpretation.query_intersects +
  //           "?polygon={polygon}&type=" +
  //           dtName +
  //           "&output={output}"
  //       },
  //       layout: {
  //         "line-join": "round",
  //         "line-cap": "round",
  //         visibility: "visible"
  //       },
  //       paint: {
  //         "line-color": "#3BB2D0",
  //         "line-width": 3
  //       }
  //     });
  //   },
  //   addDataSetLayerPoint(dtName) {
  //     //添加数据集数据
  //     this.mapBase.addLayer({
  //       id: dtName,
  //       type: "circle",
  //       layout: {
  //         visibility: "visible"
  //       },
  //       source: {
  //         type: "geojson-wms",
  //         data: {
  //           epsg: 4326,
  //           type: "Feature",
  //           properties: {},
  //           geometry: {
  //             type: "Point",
  //             coordinates: []
  //           }
  //         },
  //         dataUrl:
  //           this.GlobalUrlPath.interpretation.query_intersects +
  //           "?polygon={polygon}&type=" +
  //           dtName +
  //           "&output={output}"
  //       },
  //       paint: {
  //         "circle-radius": 5,
  //         "circle-color": "#3BB2D0"
  //       }
  //     });
  //   },
  //   startSelFeature() {
  //     //选择模式
  //     if (!this.editDtLayer) return;
  //     this.isSelModal = true;
  //     this.drawModel = "SIMPLE_SELECT";
  //     this.tipStep = 0;
  //     this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
  //     this.mapEditorObj.setAction("simple_select");
  //   },
  //   aggregate_polygon() {
  //     //拼接面
  //     if (this.mapEditorObj.getSelectedIds().length < 2) {
  //       this.$message.error("请至少选择两个要进行合并的目标");
  //       return;
  //     }
  //     var _this = this;
  //     this.http
  //       .get(_this.GlobalUrlPath.interpretation.aggregate_polygon, {
  //         datasetId: _this.editDtLayer.dtName,
  //         ids: _this.mapEditorObj.getSelectedIds().join(",")
  //       })
  //       .then(res => {
  //         console.log(res);
  //         _this.mapEditorObj.refresh();
  //         _this.mapEditorObj.delete(_this.mapEditorObj.getSelectedIds());
  //       });
  //   },
  //   deleteFeature() {
  //     //删除
  //     var _this = this;
  //     if (this.mapEditorObj.getMode() == "direct_select") {
  //       _this.mapEditorObj.trash();
  //       _this.mapEditorObj.refresh();
  //     } else {
  //       if (this.mapEditorObj.getSelectedIds().length == 0) {
  //         this.$message.error("请先选择要删除的目标");
  //         return;
  //       }
  //       this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
  //         confirmButtonText: "确定",
  //         cancelButtonText: "取消",
  //         type: "warning"
  //       })
  //         .then(() => {
  //           this.http
  //             .get(_this.GlobalUrlPath.interpretation.delete, {
  //               datasetId: _this.editDtLayer.dtName,
  //               id: _this.mapEditorObj.getSelectedIds().join(",")
  //             })
  //             .then(res => {
  //               _this.mapEditorObj.delete(_this.mapEditorObj.getSelectedIds());
  //               _this.mapEditorObj.refresh();
  //               _this.$message.success("删除成功！");
  //             });
  //         })
  //         .catch(() => {
  //           this.$message({
  //             type: "info",
  //             message: "已取消删除"
  //           });
  //         });
  //     }
  //   },
  //   startEdit() {
  //     //开始编辑
  //     if (!this.editDtLayer) return;
  //     this.isEdit = true;
  //     this.isSelModal = false;
  //     this.startSelFeature();
  //     this.isEditPoint = false;
  //     this.isEditLine = false;
  //     this.isEditPolygon = false;
  //     if (this.editDtLayer.dtType == 1) {
  //       this.isEditPoint = true;
  //     } else if (this.editDtLayer.dtType == 2) {
  //       this.isEditLine = true;
  //     } else if (this.editDtLayer.dtType == 3) {
  //       this.isEditPolygon = true;
  //     }
  //     //创建绘制对象
  //   },
  //   endEdit() {
  //     //结束编辑
  //     this.isEdit = false;
  //     this.isSelModal = false;
  //     this.isEditPoint = false;
  //     this.isEditLine = false;
  //     this.isEditPolygon = false;
  //     // this.mapEditorObj = null;
  //   },
  //   submitForm(formName) {
  //     //修改属性
  //     var _this = this;
  //     this.$refs[formName].validate(valid => {
  //       if (valid) {
  //         _this.mapEditorObj.setProperties(_this.attrForm);
  //         _this.attr_contarin = false;
  //         _this.$message.success("保存成功！");
  //       } else {
  //         return false;
  //       }
  //     });
  //   },
  //   openAttrBox() {
  //     //打开属性表
  //     var _this = this;
  //     if (Object.keys(this.mapEditorObj.getProperties()).length == 0) {
  //       this.$message.warning("当前没有可编辑的属性！");
  //       return;
  //     } else if (this.mapEditorObj.getSelectedIds().length > 1) {
  //       this.$message.warning("不支持多目标编辑的属性！");
  //       return;
  //     } else {
  //       this.attr_contarin = true;
  //       this.attrData = [];
  //       this.attrForm = this.mapEditorObj.getProperties();
  //       Object.keys(_this.mapEditorObj.getProperties()).forEach(function(key) {
  //         _this.attrData.push({
  //           label: key,
  //           value: _this.mapEditorObj.getProperties()[key]
  //         });
  //       });
  //     }
  //   },
  //   drawCutLine() {
  //     //绘制面分割的线
  //     let _this = this;
  //     this.clearLayer("polygonLine");
  //     let line;
  //     let theArr = [];
  //     let canvas = this.mapBase.getCanvasContainer();
  //     function ondblclick(e) {
  //       _this.mapBase.off("mousemove", onMove);
  //       _this.mapBase.off("click", onDown);
  //       canvas.style.cursor = "";
  //       theArr = [];
  //     }
  //     function onMove(e) {
  //       theArr[theArr.length - 1] = e.lngLat.toArray();
  //       line = turf.lineString(theArr);
  //       _this.mapBase.getSource("polygonLine").setData(line);
  //     }
  //     function onDown(e) {
  //       //生成面的坐标
  //       if (theArr.length >= 2) {
  //         theArr.splice(theArr.length - 1, 0, e.lngLat.toArray());
  //       } else {
  //         theArr.push(e.lngLat.toArray());
  //         theArr.push(e.lngLat.toArray());
  //       }
  //       theArr.push(e.lngLat.toArray());
  //       line = turf.lineString(theArr);
  //       //绘制线
  //       if (!_this.mapBase.getLayer("polygonLine")) {
  //         _this.mapBase.addLayer({
  //           id: "polygonLine",
  //           type: "line",
  //           source: {
  //             type: "geojson",
  //             data: line
  //           },
  //           layout: {},
  //           paint: {
  //             "line-color": "#37C637",
  //             "line-width": 2
  //           }
  //         });
  //       } else {
  //         _this.mapBase.getSource("polygonLine").setData(line);
  //       }
  //       _this.mapBase.on("mousemove", onMove);
  //       _this.mapBase.once("dblclick", ondblclick);
  //     }
  //     this.mapBase.on("click", onDown);
  //     canvas.style.cursor = "pointer";
  //   },
  //   updateOperateAlert() {
  //     // 更新操作提示
  //     if (this.drawModel == "SIMPLE_SELECT") return;
  //     if (this.tipStep >= ALERT_CONTENT[this.drawModel].length - 1) return;
  //     this.tipStep += 1;
  //     this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
  //   },
  //   resetOperateAlert() {
  //     // 还原
  //     this.tipStep = 0;
  //     this.alertContent = ALERT_CONTENT[this.drawModel][this.tipStep];
  //   }
  // },
  mounted(){
    this.drawHelper = new DrawHelper(this.map.map);

    var toolbar = this.drawHelper.addToolbar(document.getElementById("toolbar"), {
            buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
    });
    var scene = this.map.map.scene;
    let viewer = this.map.map;

    toolbar.addListener('markerCreated', function(event) {
           // loggingMessage('Marker created at ' + event.position.toString());
            // create one common billboard collection for all billboards
            var b = new Cesium.BillboardCollection();
            scene.primitives.add(b);
            var billboard = b.add({
                show : true,
                position : event.position,
                pixelOffset : new Cesium.Cartesian2(0, 0),
                eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                verticalOrigin : Cesium.VerticalOrigin.CENTER,
                scale : 1.0,
                image: './img/glyphicons_242_google_maps.png',
                color : new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            billboard.setEditable();
        });
        toolbar.addListener('polylineCreated', function(event) {
            //loggingMessage('Polyline created with ' + event.positions.length + ' points');
              console.log(event)
                
                 console.log(viewer.scene.globe.ellipsoid.cartesianToCartographic(event.positions[0]))
            var polyline = new DrawHelper.PolylinePrimitive({
                positions: event.positions,
                width: 5,
                geodesic: true
            });
            scene.primitives.add(polyline);
            polyline.setEditable();
            polyline.addListener('onEdited', function(event) {
                console.log(event)
                
                 let cartograhphic = viewer.scene.globe.ellipsoid.cartesianToCartographic(event.positions[0])
                 let lat=Cesium.Math.toDegrees(cartograhphic.latitude);
                 let lng=Cesium.Math.toDegrees(cartograhphic.longitude);
                 let alt=cartographic.height;
                //loggingMessage('Polyline edited, ' + event.positions.length + ' points');
            });

        });
        toolbar.addListener('polygonCreated', function(event) {
           // loggingMessage('Polygon created with ' + event.positions.length + ' points');
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                material : Cesium.Material.fromType('Checkerboard')
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('onEdited', function(event) {
                //loggingMessage('Polygon edited, ' + event.positions.length + ' points');
            });

        });
        toolbar.addListener('circleCreated', function(event) {
            //loggingMessage('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');
            var circle = new DrawHelper.CirclePrimitive({
                center: event.center,
                radius: event.radius,
                material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            scene.primitives.add(circle);
            circle.setEditable();
            circle.addListener('onEdited', function(event) {
                //loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
            });
        });
        toolbar.addListener('extentCreated', function(event) {
            var extent = event.extent;
            //loggingMessage('Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
            var extentPrimitive = new DrawHelper.ExtentPrimitive({
                extent: extent,
                material: Cesium.Material.fromType(Cesium.Material.StripeType)
            });
            scene.primitives.add(extentPrimitive);
            extentPrimitive.setEditable();
            extentPrimitive.addListener('onEdited', function(event) {
                //loggingMessage('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
            });
        });

        function loggingMessage() {
            
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
    .alert-content {
    }
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
#toolbar {
      position: absolute;
      top: 0px;
      left: 0;
      display: inline;
      margin: 10px;
      padding: 0px;
      background: white;
  }
  #logging {
      position: absolute;
      bottom: 0px;
      right: 0;
      display: inline;
      margin: 10px;
      padding: 10px;
      background: white;
  }
</style>
