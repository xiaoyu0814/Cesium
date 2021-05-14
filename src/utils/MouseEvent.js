var MouseEvent = function (viewer) {
  this._viewer = viewer
  this._scene = this._viewer.scene
  this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)
  this.activeShapePoints = []
  this.activeRadius=0//圆选时圆的动态半径
  this.activeShape = null
  this.floatingPoint = null
  this.EntityArr = [] 
}
//获取鼠标经纬度
MouseEvent.prototype.getPosition = function (callback) {
  var _this = this;
  //得到当前三维场景
  var scene = _this._scene;
  var viewer = _this._viewer;
  //得到当前三维场景的椭球体
  var ellipsoid = scene.globe.ellipsoid;
  var longitudeString = null;
  var latitudeString = null;
  var height = null;
  var heading = null;
  var pitch = null;
  var cartographic = null;
  var altitude = null;
  var startCartesian = null;
  // 定义当前场景的画布元素的事件处理
  var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
  handler.setInputAction(function (movement) {
    //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
    //cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
    
    var ray = viewer.camera.getPickRay(movement.endPosition)
    if (ray) {
      startCartesian = scene.globe.pick(ray, scene)
    }
    if (startCartesian) {
      cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(startCartesian)
    }
    if (cartographic) {
      // 海拔
      altitude = scene.globe.getHeight(cartographic).toFixed(2);
      longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      //获取相机高度
      height = Math.ceil(viewer.camera.positionCartographic.height);
      heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2)
      pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(2)
      let zoom = _this.altitudeToZoom(height);
      var position = {
        lon: longitudeString,
        lat: latitudeString,
        height: height,
        altitude: Number(altitude),
        heading: Number(heading),
        pitch: Number(pitch),
        zoom:Number(zoom)
      }
      if (callback && typeof callback == 'function') { callback(position) }
    }
    else {

    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
  handler.setInputAction(function (wheelment) {
    height = Math.ceil(viewer.camera.positionCartographic.height);
    heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2)
    pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(2)
    let zoom = _this.altitudeToZoom(height);
    var position = {
      lon: longitudeString,
      lat: latitudeString,
      height: height,
      altitude: Number(altitude),
      heading: Number(heading),
      pitch: Number(pitch),
      zoom:Number(zoom)
    }
    let rec = viewer.camera.computeViewRectangle();
    let ws_Point=[rec.west / Math.PI * 180,rec.south / Math.PI * 180];  
    let en_Point=[rec.east / Math.PI * 180,rec.north / Math.PI * 180];     

    //console.log(ws_Point,en_Point)
    if (callback && typeof callback == 'function') { callback(position) }
  }, Cesium.ScreenSpaceEventType.WHEEL);

}
MouseEvent.prototype.altitudeToZoom = function (altitude) {
  var A = 40487.57;
  var B = 0.00007096758;
  var C = 91610.74;
  var D = -40467.74;

  return Math.round(D +(A-D)/(1 + Math.pow(altitude / C,B)))
}
// 绘制河流多边形
MouseEvent.prototype.drawPolygon = function (drawingMode, isFill) {
  var _self = this
  this._handler.setInputAction(function (event) {
    // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    var earthPosition;
    var ray = _self._viewer.scene.camera.getPickRay(event.position);
    if (ray)
      earthPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
    // `earthPosition` will be undefined if our mouse is not over the globe.
    if (Cesium.defined(earthPosition)) {
      if (_self.activeShapePoints.length === 0) {
        _self.floatingPoint = _self.createPoint(earthPosition);
        _self.activeShapePoints.push(earthPosition);
        var dynamicPositions = new Cesium.CallbackProperty(function () {
          if (drawingMode === 'polygon') {
            return new Cesium.PolygonHierarchy(_self.activeShapePoints);
          }
          return _self.activeShapePoints;
        }, false);
        _self.activeShape = _self.drawShape(drawingMode, dynamicPositions, isFill);
      }
      _self.activeShapePoints.push(earthPosition);
      var p = _self.createPoint(earthPosition);
      _self.EntityArr.push(p);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  this._handler.setInputAction(function (event) {
    if (Cesium.defined(_self.floatingPoint)) {
      var newPosition;
      var ray = _self._viewer.scene.camera.getPickRay(event.endPosition);
      if (ray)
        newPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
      if (Cesium.defined(newPosition)) {
        _self.floatingPoint.position.setValue(newPosition);
        _self.activeShapePoints.pop();
        _self.activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}
//绘制圆形
MouseEvent.prototype.drawCircle = function () {
  var _self = this
  this._handler.setInputAction(function (event) {
    var earthPosition;
    var ray = _self._viewer.scene.camera.getPickRay(event.position);
    if (ray)
      earthPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
    if (Cesium.defined(earthPosition)) {
      if (_self.activeShapePoints.length === 0) {
        var point=_self.drawShape("point",earthPosition);
        _self.EntityArr.push(point);
        _self.activeShapePoints.push(earthPosition);
        var dynamicPositions = new Cesium.CallbackProperty(function () {
          return _self.activeRadius;
        }, false);
        _self.activeShape =_self.drawShape("circle",dynamicPositions);
      }
      _self.activeShapePoints.push(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  this._handler.setInputAction(function (event) {
    if (_self.activeShapePoints.length>0) {
      var newPosition;
      var ray = _self._viewer.scene.camera.getPickRay(event.endPosition);
      if (ray)
        newPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
      if (Cesium.defined(newPosition)) {
        _self.activeShapePoints.pop();
        _self.activeShapePoints.push(newPosition);
        //计算两个点之间的距离，做为半径
        var geodesic=new Cesium.EllipsoidGeodesic(Cesium.Cartographic.fromCartesian(_self.activeShapePoints[0]),Cesium.Cartographic.fromCartesian(newPosition));
        _self.activeRadius=geodesic.surfaceDistance;
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

//绘制矩形
MouseEvent.prototype.drawRectangle = function () {
  var _self = this
  this._handler.setInputAction(function (event) {
    var earthPosition;
    var ray = _self._viewer.scene.camera.getPickRay(event.position);
    if (ray)
      earthPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
    if (Cesium.defined(earthPosition)) {
      if (_self.activeShapePoints.length === 0) {
        _self.activeShapePoints.push(earthPosition);
        var dynamicPositions = new Cesium.CallbackProperty(function () {
          return Cesium.Rectangle.fromCartesianArray(_self.activeShapePoints);
        }, false);
        _self.activeShape =_self.drawShape("rectangle",dynamicPositions);
      }
      _self.activeShapePoints.push(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  this._handler.setInputAction(function (event) {
    if (_self.activeShapePoints.length>0) {
      var newPosition;
      var ray = _self._viewer.scene.camera.getPickRay(event.endPosition);
      if (ray)
        newPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
      if (Cesium.defined(newPosition)) {
          _self.activeShapePoints.pop();
          _self.activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

MouseEvent.prototype.createPoint = function (worldPosition) {
  var _self = this;
  var point = _self._viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.YELLOW,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
  return point;
}

MouseEvent.prototype.drawShape = function (drawingMode, positionData, isFill = true) {
  var _self = this;
  var shape;
  if (drawingMode === 'line') {
    shape = _self._viewer.entities.add({
      polyline: {
        positions: positionData,
        clampToGround: true,
        material: Cesium.Color.CHARTREUSE,
        width: 3
      }
    });
  }
  else if (drawingMode === 'point') {
    shape = _self._viewer.entities.add({
      position: positionData,
      point: {
        color: Cesium.Color.YELLOW,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
  }
  else if (drawingMode === 'circle') {
    shape =_self._viewer.entities.add({
      position:_self.activeShapePoints[0],
      ellipse : {
        semiMinorAxis :positionData,
        semiMajorAxis :positionData,
        material:Cesium.Color.CHARTREUSE.withAlpha( 0.3),
        extrudedHeight: 0,
        fill:false,
        outline : true,
        outlineColor :Cesium.Color.RED
      }
    });
  }  else if (drawingMode === 'rectangle') {
    shape = _self._viewer.entities.add({
      rectangle : {
        coordinates :positionData,
        fill:false,
        outline : true, // height must be set for outline to display
        outlineColor : Cesium.Color.RED
      }
    });
  }
  else if (drawingMode === 'polygon') {
    shape = _self._viewer.entities.add({
      polygon: {
        hierarchy: positionData,
        fill: isFill,
        material: Cesium.Color.CHARTREUSE.withAlpha(0.7),
        outline: true,
        outlineColor: Cesium.Color.CHARTREUSE
      }
    });
  }
  return shape;
}
MouseEvent.prototype.terminateShape = function (drawingMode, isFill) {//终结图形的绘制
  var _self = this;
  var shape=null;
  if(drawingMode=="circle"){
    //计算两个点之间的距离，做为半径
    var geodesic=new Cesium.EllipsoidGeodesic(Cesium.Cartographic.fromCartesian(_self.activeShapePoints[0]),Cesium.Cartographic.fromCartesian(_self.activeShapePoints[1]));
    shape=_self.drawShape(drawingMode,geodesic.surfaceDistance);
  }else if(drawingMode=="rectangle"){
    var coordinates =Cesium.Rectangle.fromCartesianArray(_self.activeShapePoints);
    shape=_self.drawShape(drawingMode,coordinates);
  }
  else{//针对圆，不需要补最后的右键点击点
    var point = _self.createPoint(_self.activeShapePoints[_self.activeShapePoints.length - 1]);
    _self.EntityArr.push(point);
    shape = _self.drawShape(drawingMode, _self.activeShapePoints, isFill);
  }
  _self.EntityArr.push(shape);
  _self._viewer.entities.remove(_self.floatingPoint);
  _self._viewer.entities.remove(_self.activeShape);
  _self.floatingPoint = undefined;
  _self.activeShape = undefined;
  _self.activeShapePoints = [];
}

// 清除鼠标事件
MouseEvent.prototype.clearMouseEvent = function () {
  var _self = this
  _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}

// 清除所有的监听事件，及样式，相关增加的点线面
MouseEvent.prototype.clearAll = function () {
  var _self = this
  //禁用地形允许深度检测
  _self._viewer.scene.globe.depthTestAgainstTerrain = false
  _self.clearMouseEvent()
}

// 拾取位置
MouseEvent.prototype.pickUp = function () { // 拾取位置
  var _self = this
  // 当左键单击事件
  _self._handler.setInputAction(function (movement) {
    var startCartesian = null
    var cartographic = null
    var ray = _self._viewer.camera.getPickRay(movement.position)
    if (ray) {
      startCartesian = _self._viewer.scene.globe.pick(ray, _self._viewer.scene)
    }
    if (startCartesian) {
      cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(startCartesian)
    }
    if (cartographic) {
      // 海拔
      var height = _self._viewer.scene.globe.getHeight(cartographic).toFixed(3)
      alert(height)
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

// 飞到目的地
MouseEvent.prototype.flyTo = function (destination, head, pitch, roll, duration, call) {
  var _self = this
  _self._viewer.camera.flyTo({
    destination: destination, // Cartesian3 | Rectangle
    orientation: {
      heading: head,
      pitch: pitch,
      roll: roll
    },
    duration: duration,
    complete: function () {
      if (call) {
        call()
      }
    }

  })
}
export default MouseEvent
