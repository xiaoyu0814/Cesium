import {EventDispatcher} from "../core/EventDispatcher";
function DrawHelper(viewer){
    this.viewer = viewer;
    this.scene = viewer.scene;
    this.canvas = viewer.scene.canvas;
    this.ellipsoid = viewer.scene.globe.ellipsoid;
    this.camera = viewer.scene.camera;
    
};

DrawHelper.prototype = Object.assign(Object.create(EventDispatcher.prototype),{
    markers:{},
    positions:[],
    tempPositions:[],
    okHandler: null,
    cancelHandler: null,
    drawHandler:null,
    dragIcon: "./static/img/drawimg/circle_gray.png",
    dragIconLight: "./static/img/drawimg/circle_red.png",
    layerId:"editLayer",
    clear: function () {
        var _this = this;
        if (_this.drawHandler) {
            _this.drawHandler.destroy();
            _this.drawHandler = null;
        }
        if (_this.modifyHandler) {
            _this.modifyHandler.destroy();
            _this.modifyHandler = null;
        }
        // if (_this.toolBarIndex != null) {
        //     layer.close(_this.toolBarIndex);
        // }
        _this._clearAnchors();
        _this._clearMarkers(_this.layerId);
        //_this.tooltip.setVisible(false);
    },
    showModifyPoint: function (position, okHandler, cancelHandler) {
        var _this = this;
        _this.position = position;
        _this.okHandler = okHandler;
        _this.cancelHandler = cancelHandler;
        _this.entity = null;
        _this._createPoint(position,0);
        _this._startPointModify();
    },
    showModifyPolygon: function (positions, okHandler, cancelHandler) {
        var _this = this;
        _this._clearAnchors();
        _this.positions = positions;
        _this.okHandler = okHandler;
        _this.cancelHandler = cancelHandler;
        _this._showModifyRegion2Map();
    },
    showModifyPolyline: function (positions, okHandler, cancelHandler) {
        var _this = this;
        _this._clearAnchors();
        _this.positions = positions;
        _this.okHandler = okHandler;
        _this.cancelHandler = cancelHandler;
        _this._showModifyPolyline2Map();
    },
    //绘制多边形
    startDrawPolygon: function (okHandler, cancelHandler) {
        var _this = this;
        _this.okHandler = okHandler;
        _this.cancelHandler = cancelHandler;

        _this.positions = [];
        var floatingPoint = null;
        _this.drawHandler = new Cesium.ScreenSpaceEventHandler(_this.canvas);

        _this.drawHandler.setInputAction(function (event) {
            var position = event.position;
            if (!Cesium.defined(position)) {
                return;
            }
            var ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            var num = _this.positions.length;
            if (num == 0) {
                _this.positions.push(cartesian);
                floatingPoint = _this._createPoint(cartesian, -1);
                _this._showRegion2Map();
            }
            _this.positions.push(cartesian);
            var oid = _this.positions.length - 2;
            _this._createPoint(cartesian, oid);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        _this.drawHandler.setInputAction(function (event) {
            var position = event.endPosition;
            if (!Cesium.defined(position)) {
                return;
            }
            if (_this.positions.length < 1) {
                //_this.tooltip.showAt(position, "<p>选择起点</p>");
                return;
            }
            var num = _this.positions.length;
            var tip = "<p>点击添加下一个点</p>";
            if (num > 3) {
                tip += "<p>右键结束绘制</p>";
            }
           // _this.tooltip.showAt(position, tip);

            var ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            floatingPoint.position.setValue(cartesian);
            _this.positions.pop();
            _this.positions.push(cartesian);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        _this.drawHandler.setInputAction(function (movement) {
            if (_this.positions.length < 4) {
                return;
            }
            _this.positions.pop();
            _this.viewer.entities.remove(floatingPoint);
            //_this.tooltip.setVisible(false);

            //进入编辑状态
            _this.clear();
            _this._showModifyRegion2Map();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    },
    _computeTempPositionsLine: function () {
        var _this = this;

        var pnts = [].concat(_this.positions);
        var num = pnts.length;
        _this.tempPositions = [];
        for (var i = 1; i < num; i++) {
            var p1 = pnts[i - 1];
            var p2 = pnts[i];
            p1.sid = i - 1;
            p2.sid = i;
            var cp = _this._computeCenterPotition(p1, p2);
            _this.tempPositions.push(p1);
            _this.tempPositions.push(cp);
        }
        var last = pnts[num - 1];
        _this.tempPositions.push(last);
    },
    _computeTempPositionsPolygon: function () {
        var _this = this;

        var pnts = [].concat(_this.positions);
        var num = pnts.length;
        var first = pnts[0];
        var last = pnts[num - 1];
        if (_this._isSimpleXYZ(first, last) == false) {
            pnts.push(first);
            num += 1;
        }
        _this.tempPositions = [];
        for (var i = 1; i < num; i++) {
            var p1 = pnts[i - 1];
            var p2 = pnts[i];
            var cp = _this._computeCenterPotition(p1, p2);
            _this.tempPositions.push(p1);
            _this.tempPositions.push(cp);
        }
    },
    _computeCenterPotition: function (p1, p2) {
        var _this = this;
        var c1 = _this.ellipsoid.cartesianToCartographic(p1);
        var c2 = _this.ellipsoid.cartesianToCartographic(p2);
        var cm = new Cesium.EllipsoidGeodesic(c1, c2).interpolateUsingFraction(0.5);
        var cp = _this.ellipsoid.cartographicToCartesian(cm);
        return cp;
    },
    //判断是否为同一个点
    _isSimpleXYZ: function (p1, p2) {
        if (p1.x == p2.x && p1.y == p2.y && p1.z == p2.z) {
            return true;
        }
        return false;
    },
    _startPointModify: function () {
        var _this = this;
        var isMoving = false;
        var pickedAnchor = null;
        if (_this.drawHandler) {
            _this.drawHandler.destroy();
            _this.drawHandler = null;
        }
        //_this._showToolBar();

        _this.modifyHandler = new Cesium.ScreenSpaceEventHandler(_this.canvas);

        _this.modifyHandler.setInputAction(function (event) {
            var wp = event.position;
            if (!Cesium.defined(wp)) {
                return;
            }
            var ray = _this.camera.getPickRay(wp);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            if (isMoving) {
                isMoving = false;
                pickedAnchor.position.setValue(cartesian);
                var oid = pickedAnchor.oid;
                _this.position = cartesian;
                //_this.tooltip.setVisible(false);
                if (_this.okHandler) {
                    
                    _this.okHandler(_this.position);
                }
            } else {
                var pickedObject = _this.scene.pick(wp);
                if (!Cesium.defined(pickedObject)) {
                    return;
                }
                if (!Cesium.defined(pickedObject.id)) {
                    return;
                }
                var entity = pickedObject.id;
                if (entity.layerId != _this.layerId || entity.flag != "anchor") {
                    return;
                }
                pickedAnchor = entity;
                isMoving = true;
               // _this.tooltip.showAt(wp, "<p>移动位置</p>");
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        _this.modifyHandler.setInputAction(function (event) {
            if (!isMoving) {
                return;
            }
            var wp = event.endPosition;
            if (!Cesium.defined(wp)) {
                return;
            }
            //_this.tooltip.showAt(wp, "<p>移动位置</p>");

            var ray = _this.camera.getPickRay(wp);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            pickedAnchor.position.setValue(cartesian);
            var oid = pickedAnchor.oid;
            _this.position = cartesian;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    _startModify: function () {
        var _this = this;
        var isMoving = false;
        var pickedAnchor = null;
        if (_this.drawHandler) {
            _this.drawHandler.destroy();
            _this.drawHandler = null;
        }
        //_this._showToolBar();

        _this.modifyHandler = new Cesium.ScreenSpaceEventHandler(_this.canvas);

        _this.modifyHandler.setInputAction(function (event) {
            var position = event.position;
            if (!Cesium.defined(position)) {
                return;
            }
            var ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            if (isMoving) {
                isMoving = false;
                pickedAnchor.position.setValue(cartesian);
                var oid = pickedAnchor.oid;
                _this.tempPositions[oid] = cartesian;
                //_this.tooltip.setVisible(false);
                if (pickedAnchor.flag == "mid_anchor") {
                    _this._updateModifyAnchors(oid);
                }

                if (_this.okHandler) {
                    var positions = [];
                    for (var i = 0; i < _this.tempPositions.length; i += 2) {
                        var p = _this.tempPositions[i];
                        positions.push(p);
                    }
                    _this.positions = positions;
                    _this.okHandler(positions);
                }
            } else {
                var pickedObject = _this.scene.pick(position);
                if (!Cesium.defined(pickedObject)) {
                    return;
                }
                if (!Cesium.defined(pickedObject.id)) {
                    return;
                }
                var entity = pickedObject.id;
                if (entity.layerId != _this.layerId) {
                    return;
                }
                if (entity.flag != "anchor" && entity.flag != "mid_anchor") {
                    return;
                }
                pickedAnchor = entity;
                isMoving = true;
                if (entity.flag == "anchor") {
                    //_this.tooltip.showAt(position, "<p>移动控制点</p>");
                }
                if (entity.flag == "mid_anchor") {
                   // _this.tooltip.showAt(position, "<p>移动创建新的控制点</p>");
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        _this.modifyHandler.setInputAction(function (event) {
            if (!isMoving) {
                return;
            }
            var position = event.endPosition;
            if (!Cesium.defined(position)) {
                return;
            }
           // _this.tooltip.showAt(position, "<p>移动控制点</p>");

            var ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            var oid = pickedAnchor.oid;
            if (pickedAnchor.flag == "anchor") {
                pickedAnchor.position.setValue(cartesian);
                _this.tempPositions[oid] = cartesian;
                //左右两个中点
                _this._updateNewMidAnchors(oid);
            } else if (pickedAnchor.flag == "mid_anchor") {
                pickedAnchor.position.setValue(cartesian);
                _this.tempPositions[oid] = cartesian;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    
    },
    //高亮编辑图层
    _showModifyRegion2Map: function () {
        var _this = this;

        _this._startModify();
        _this._computeTempPositionsPolygon();

        var dynamicHierarchy = new Cesium.CallbackProperty(function () {
            if (_this.positions.length > 2) {
                var pHierarchy = new Cesium.PolygonHierarchy(_this.tempPositions);
                return pHierarchy;
            } else {
                return null;
            }
        }, false);
        var outlineDynamicPositions = new Cesium.CallbackProperty(function () {
            if (_this.tempPositions.length > 1) {
                var arr = [].concat(_this.tempPositions);
                var first = _this.tempPositions[0];
                arr.push(first);
                return arr;
            } else {
                return null;
            }
        }, false);
        if (_this.material == null) {
            _this.material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        }
        if (_this.outlineMaterial == null) {
            _this.outlineMaterial = new Cesium.PolylineDashMaterialProperty({
                dashLength: 16,
                color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.7)
            });
        }
        var bData = {
            polygon: new Cesium.PolygonGraphics({
                hierarchy: dynamicHierarchy,
                material: _this.material,
                show: _this.fill
            }),
            polyline: {
                positions: outlineDynamicPositions,
                clampToGround: true,
                width: _this.outlineWidth,
                material: _this.outlineMaterial,
                show: _this.outline
            }
        };
        if (_this.extrudedHeight > 0) {
            bData.polygon.extrudedHeight = _this.extrudedHeight;
            bData.polygon.extrudedHeightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
            bData.polygon.closeTop = true;
            bData.polygon.closeBottom = true;
        }
        _this.entity = _this.viewer.entities.add(bData);
        _this.entity.layerId = _this.layerId;
        var positions = _this.tempPositions;
        for (var i = 0; i < positions.length; i++) {
            var ys = i % 2;
            if (ys == 0) {
                _this._createPoint(positions[i], i);
            } else {
                _this._createMidPoint(positions[i], i);
            }
        }
    },
    _showModifyPolyline2Map: function () {
        var _this = this;

        _this._startModify();
        _this._computeTempPositionsLine();

        var dynamicPositions = new Cesium.CallbackProperty(function () {
            return _this.tempPositions;
        }, false);
        if (_this.material == null) {
            _this.material = new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.25,
                color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.9)
            });
        }
        var bData = {
            polyline: {
                positions: dynamicPositions,
                clampToGround: true,
                width: 8,
                material: _this.material
            }
        };
        _this.entity = _this.viewer.entities.add(bData);
        _this.entity.layerId = _this.layerId;
        var positions = _this.tempPositions;
        for (var i = 0; i < positions.length; i++) {
            var ys = i % 2;
            if (ys == 0) {
                _this._createPoint(positions[i], i);
            } else {
                _this._createMidPoint(positions[i], i);
            }
        }
    },
    _updateModifyAnchors: function (oid) {
        var _this = this;

        //重新计算tempPositions
        var p = _this.tempPositions[oid];
        var p1 = null;
        var p2 = null;
        var num = _this.tempPositions.length;
        if (oid == 0) {
            p1 = _this.tempPositions[num - 1];
            p2 = _this.tempPositions[oid + 1];
        } else if (oid == num - 1) {
            p1 = _this.tempPositions[oid - 1];
            p2 = _this.tempPositions[0];
        } else {
            p1 = _this.tempPositions[oid - 1];
            p2 = _this.tempPositions[oid + 1];
        }
        //计算中心
        var cp1 = _this._computeCenterPotition(p1, p);
        var cp2 = _this._computeCenterPotition(p, p2);

        //插入点
        var arr = [cp1, p, cp2];
        _this.tempPositions.splice(oid, 1, cp1, p, cp2);

        //重新加载锚点
        _this._clearAnchors(_this.layerId);
        var positions = _this.tempPositions;
        for (var i = 0; i < positions.length; i++) {
            var ys = i % 2;
            if (ys == 0) {
                _this._createPoint(positions[i], i);
            } else {
                _this._createMidPoint(positions[i], i);
            }
        }
    },
    //更新中间点
    _updateNewMidAnchors: function (oid) {
        var _this = this;
        if (oid == null || oid == undefined) {
            return;
        }
        //左边两个中点，oid2为临时中间点
        var oid1 = null;
        var oid2 = null;

        //右边两个中点，oid3为临时中间点
        var oid3 = null;
        var oid4 = null;
        var num = _this.tempPositions.length;
        if (oid == 0) {
            oid1 = num - 2;
            oid2 = num - 1;
            oid3 = oid + 1;
            oid4 = oid + 2;
        } else if (oid == num - 2) {
            oid1 = oid - 2;
            oid2 = oid - 1;
            oid3 = num - 1;
            oid4 = 0;
        } else {
            oid1 = oid - 2;
            oid2 = oid - 1;
            oid3 = oid + 1;
            oid4 = oid + 2;
        }

        var c1 = _this.tempPositions[oid1];
        var c = _this.tempPositions[oid];
        var c4 = _this.tempPositions[oid4];

        var c2 = _this._computeCenterPotition(c1, c);
        var c3 = _this._computeCenterPotition(c4, c);

        _this.tempPositions[oid2] = c2;
        _this.tempPositions[oid3] = c3;

        _this.markers[oid2].position.setValue(c2);
        _this.markers[oid3].position.setValue(c3);
    },
    //添加顶点
    _createPoint: function (cartesian, oid) {
        var _this = this;
        var viewer = _this.viewer;
        var point = viewer.entities.add({
            position: cartesian,
            billboard: {
                image: _this.dragIconLight,
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        point.oid = oid;
        point.layerId = _this.layerId;
        point.flag = "anchor";
        _this.markers[oid] = point;
        return point;
    },
    
    //添加中间点
    _createMidPoint: function (cartesian, oid) {
        var _this = this;
        var viewer = _this.viewer;
        var point = viewer.entities.add({
            position: cartesian,
            billboard: {
                image: _this.dragIcon,
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        point.oid = oid;
        point.layerId = _this.layerId;
        point.flag = "mid_anchor";
        _this.markers[oid] = point;
        return point;
    },
    //清除实体
    _clearMarkers: function (layerName) {
        var _this = this;
        var viewer = _this.viewer;
        var entityList = viewer.entities.values;
        if (entityList == null || entityList.length < 1)
            return;
        for (var i = 0; i < entityList.length; i++) {
            var entity = entityList[i];
            if (entity.layerId == layerName) {
                viewer.entities.remove(entity);
                i--;
            }
        }
    },
    //清楚点
    _clearAnchors: function () {
        var _this = this;
        for (var key in _this.markers) {
            var m = _this.markers[key];
            _this.viewer.entities.remove(m);
        }
        _this.markers = {};
    },
});

export default DrawHelper