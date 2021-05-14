import lodash from 'lodash';
import MouseEvent from "./MouseEvent";
import CameraManager from './CameraManager';
import LayerManager from './LayerManager';
import RollershadersManager from './RollershadersManager';
import LineLayer from './Layers/LineLayer';
import PolygonLayer from "./Layers/PolygonLayer";
import PointLayer from "./Layers/PointLayer";
import TextLayer from "./Layers/TextLayer";
import GridTileLayer from "./Layers/GridTileLayer";
import DrawHelper from './Layers/DrawHelper';
export default function (Vue, options) {
	Vue.prototype.map = {
		//全局函数1
		map: '',
		//viewer视图
		viewer: "",
		//scene 
		sence: '',
		worldTerrain: '',
		//鼠标事件
		MouseEvent: '',
		//相机管理
		CameraManager: '',
		//图层管理
		layerManager: "",
		drawHelper: "",
		// 地图上已经加载的source
		sources: [],
		// 地图上已经加载的layer
		layers: [],
		primitives: [],
		// 地图上的marker
		markers: [],
		popup: '',
		beforeMap: '',
		compare: '',
		initCesiumViewer(mapObj) {
			const { url = '', lon = '', lat = '', container = 'map' } = mapObj;
			var defaultSettings = {
				imageryProvider: false,
				animation: false,
				baseLayerPicker: false,
				fullscreenButton: false,
				geocoder: false,
				homeButton: false,
				infoBox: false,
				selectionIndicator: false,
				timeline: false,
				sceneModePicker: false,
				shouldAnimate: true,
				navigationHelpButton: false,
				contextOptions: {
					//allowTextureFilterAnisotropic : true,
					webgl: {
						alpha: false,
					}
				}
			};
			var map = new Cesium.Viewer(container, defaultSettings);
			map.scene.globe.showGroundAtmosphere = false;
			map.scene.globe.showWaterEffect = false;
			map.scene.globe.enableLighting = false;
			map.scene.globe.shadows = Cesium.ShadowMode.DISABLED;
			//this.map.scene.globe.baseColor = new Cesium.Color(self.backgroundColor.r, self.backgroundColor.g, self.backgroundColor.b, 0.01);
			map._cesiumWidget._creditContainer.style.display = "none";
			// var layer =self.map._cesiumViewer.imageryLayers.get(0);
			// if(layer){
			// 	layer.brightness=2.0;
			// 	layer.gamma=0.25;
			// }
			map._cesiumWidget._supportsImageRenderingPixelated = Cesium.FeatureDetection.supportsImageRenderingPixelated();
			map._cesiumWidget._forceResize = true;
			if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
				var vtxf_dpr = window.devicePixelRatio;
				// 适度降低分辨率
				while (vtxf_dpr >= 2.0) {
					vtxf_dpr /= 2.0;
				}
				//alert(dpr);
				map.resolutionScale = vtxf_dpr;
			}
			map.scene.screenSpaceCameraController.minimumZoomDistance = 100;
			map.clock.onTick.addEventListener(function () {
				if (map.camera.pitch > 0) {
					map.scene.screenSpaceCameraController.enableTilt = false;
				}
			});

			var mousePosition, startMousePosition;
			var handler = new Cesium.ScreenSpaceEventHandler(map.canvas);
			handler.setInputAction(function (movement) {
				mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
				handler.setInputAction(function (movement) {
					mousePosition = movement.endPosition;
					var y = mousePosition.y - startMousePosition.y;
					if (y > 0) {
						map.scene.screenSpaceCameraController.enableTilt = true;
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			}, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

			return map;
		},
		// 初始化地图
		initMap: function (mapObj, callback) {
			this.map = this.initCesiumViewer(mapObj);
			this.CameraManager = new CameraManager(this.map.scene);
			this.layerManager = new LayerManager({ viewer: this.map });
			this.drawHelper = new DrawHelper(this.map);
			this.viewer = this.map;
			this.scene = this.map.scene;
			this.sources = []
			this.layers = [];
			this.MouseEvent = new MouseEvent(this.map)
			this.roller = new RollershadersManager({ viewer: this.map });
			const that = this
			Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjE5ZTIzYy0zN2JkLTRjNzEtYmQ5NC02NjMzZjI0MWRhOTUiLCJpZCI6MjU5LCJzY29wZXMiOlsiYXNyIiwiZ2MiXSwiaWF0IjoxNTY5OTM5MjkyfQ.JBBkmCCcbd4De9AawCQStH0IzQXIimYn0wmhZ4YD2Ts'
			this.worldTerrain = Cesium.createWorldTerrain({
				requestWaterMask: true,
				requestVertexNormals: true
			});

			PageInfo.setView(this.map);
			let option = {
				west: 73,
				south: 3,
				east: 137,
				north: 54,
			}
			this.setView(option);
			if (callback && typeof callback == 'function') callback()
		},

		//根据接口返回的Layer添加图层

		addLayer(options) {
			const { data_id = false, name = '', id = '', type = '', data_url = '', show = true } = options;
			if (data_id) {

			} else {

			}
		},
		addDataSourceLayerT() {
			PageInfo.addTile();
			PageInfo.addWaterTo();
		},
		addDataSourceLayerH() {
			PageInfo.addHeight();
			PageInfo.addWaterTo();
		},
		addDataSourceLayerL() {
			var _this = this;

			//点添加测试
			PageInfo.getData("static/data/groundstation.json", function (data) {

				let ces = new PointLayer({
					strokeWidth: 0,
					strokeColor: "#000000",
					fillColor: "#f00",
					opacity: 1,
					size: 5,
					//isFill:false,
					data: data,
					id: "ces"
				})
				_this.layerManager.addLayer(ces);

				let text = new TextLayer({
					strokeWidth: 2,
					strokeColor: "#000000",
					fillColor: "#f00",
					opacity: 1,
					text: "T",
					data: data,
					font: "Arial",
					size: 1,
					id: "cesText"
				})
				_this.layerManager.addLayer(text);

				PageInfo.ccc1 = _this.layerManager.getLayer({ data_type: "GeoJson", id: "ces" });
				PageInfo.ccc = text;
			})
			//面添加测试
			PageInfo.getData("static/3d/china.geojson", function (data) {

				let cesfill = new PolygonLayer({
					strokeWidth: 2,
					strokeColor: "#000000",
					fillColor: "#f00",
					opacity: 1,
					//isFill:false,
					data: data,
					id: "cesfill"
				})
				_this.layerManager.addLayer(cesfill);


				PageInfo.fill = cesfill;
			})
			//线添加测试
			PageInfo.getData("static/3d/CounterLines.geojson", function (data) {

				let cesline = new LineLayer({
					width: 5,
					color: "#ff0",
					data: data,
					id: "cesline"
				})
				_this.layerManager.addLayer(cesline);


				PageInfo.line = cesline;
			})
			// this.layerManager.addLayer({
			// 	data:'static/3d/CounterLines.geojson',
			// 	type:"Primitive",
			// 	id:"Cous3d"
			// });
			// var scene = this.map.scene;
			// var camera = scene.camera;
			// var Iconhandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

			// Iconhandler.setInputAction(function(movement) {
			// 	// Star burst on left mouse click.
			// 	var pick = scene.pick(movement.position);
			// 	 if (Cesium.defined(pick)){
			// 		console.log(pick)
			// 	 }
			// }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		},
		//添加矢量图层
		addDiWuLayer(data, id) {
			var _this = this;
			//循环feature开始
			var geometryInstances = [];
			$.each(data.features, function (i, feature) {
				var geometryInstance = null;
				var type = feature.geometry.type;//几何对象的类型：点，线，面
				var coordinates = feature.geometry.coordinates[0];//几何对象的线宽
				var properties = feature.properties;//几何对象的属性信息
				var elevation = properties.ELEVATION;

				if (type == "Polygon") {
					//debugger
					var coordinate = [].concat.apply([], coordinates);//几何对象的坐标
					var position = Cesium.Cartesian3.fromDegreesArray(coordinate);

					// 从给的坐标点创建线段
					var lineGeometry = Cesium.PolylineGeometry.createGeometry(
						new Cesium.PolylineGeometry({//折线几何
							positions: position,
							width: 2
						}));
					// 根据图形实例创建一个图元
					geometryInstance = new Cesium.GeometryInstance({//地理位置
						geometry: lineGeometry,
						id: 'myLine' + i.toString(),
						attributes: {
							color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 0.0, 0.5))
						},
						appearance: new Cesium.PolylineColorAppearance({
							translucent: true
						})
					});
				} else {

				}
				if (geometryInstance != null) {
					geometryInstances.push(geometryInstance);
				}

			});
			var p = new Cesium.Primitive({
				geometryInstances: geometryInstances,
				appearance: new Cesium.PolylineColorAppearance({
					translucent: true
				})
			});
			p.id = id;
			this.primitives.push(p);
			this.scene.primitives.add(p);
			var option = {
				west: 116.37553893931857,
				south: 39.903704432697225,
				east: 116.40987121471511,
				north: 39.916164040650614,
			}
			this.setView(option)
		},
		removeDiWuLayer(id) {
			var layer = this.primitives.find((item) => { return item.id == id });
			var layerselectIndex = this.primitives.findIndex((item) => { return item.id == id });
			if (layer && layerselectIndex > -1) {
				this.map.scene.primitives.remove(layer)
				this.primitives.splice(layerselectIndex, 1)
			}

		},
		removeImageryLayer(id) {
			var layerselect = this.layers.find((item) => { return item.id == id });
			var layerselectIndex = this.layers.findIndex((item) => { return item.id == id });
			if (layerselect && layerselectIndex > -1) {
				this.layerManager.removeLayer(layerselect);
				this.layers.splice(layerselectIndex, 1)
			}
		},
		addTerrain() {
			this.map.terrainProvider = this.worldTerrain;
		},
		setView: function (option) {
			let box = option
			if (box) {
				
			} else {
				box = {
					west: 116.37553893931857,
					south: 39.903704432697225,
					east: 116.40987121471511,
					north: 39.916164040650614
				}
			}
			console.log(box)
			let destination = Cesium.Rectangle.fromDegrees(box.west, box.south, box.east, box.north);
			// let destination = Cesium.Rectangle.fromDegrees(116.37553893931857, 39.903704432697225, 116.40987121471511, 39.916164040650614);
			let heading = Cesium.Math.toRadians(0);
			let pitch = Cesium.Math.toRadians(-90);
			let roll = Cesium.Math.toRadians(0);
			let duration = 1;
			PageInfo.flyTo(destination, heading, pitch, roll, duration);
		},
		gotoView: function (center) {
			let destination = Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]);
			let heading = Cesium.Math.toRadians(0);
			let pitch = Cesium.Math.toRadians(-90);
			let roll = Cesium.Math.toRadians(0);
			let duration = 1;
			PageInfo.flyTo(destination, heading, pitch, roll, duration);
		},
		initView: function () {//初始视图
			let destination = Cesium.Rectangle.fromDegrees(73, 3, 137, 54);
			let heading = Cesium.Math.toRadians(0);
			let pitch = Cesium.Math.toRadians(-90);
			let roll = Cesium.Math.toRadians(0);
			let duration = 1;
			PageInfo.flyTo(destination, heading, pitch, roll, duration);
		},
		removeTerrain() {
			this.map.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
		},
		//添加图层
		addUrlTemplateImageryLayer(layer) {
			var _this = this;
			//栅格图层添加
			let gridTileLayer = new GridTileLayer(layer)

			let ownLayer = this.layerManager.addLayer(gridTileLayer);
			console.log(ownLayer);
			this.layers.push(ownLayer);
		},
		//替换地图影像
		setUrlTemplateImageryLayer(layer) {
			this.removeImageryLayer(layer.id);
			this.addUrlTemplateImageryLayer(layer);

		},
		//获取经纬度信息
		getPosition(callback) {
			this.MouseEvent.getPosition(callback);
		},
		getPoint: function (fn) {
			var _self = this;
			_self.MouseEvent.clearMouseEvent();
			//注册停止绘制功能
			_self.MouseEvent._handler.setInputAction(function (event) {
				var cartesian3;
				var ray = _self.viewer.scene.camera.getPickRay(event.position);
				if (ray)
					cartesian3 = _self.viewer.scene.globe.pick(ray, _self.viewer.scene);
				if (Cesium.defined(cartesian3)) {
					var point = _self.MouseEvent.createPoint(cartesian3);
					_self.MouseEvent.EntityArr.push(point);
					if (fn) {
						var data = Cesium.Cartographic.fromCartesian(cartesian3);
						fn({ longitude: Cesium.Math.toDegrees(data.longitude), latitude: Cesium.Math.toDegrees(data.latitude), height: data.height });
					}
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

			_self.MouseEvent._handler.setInputAction(function (event) {
				_self.MouseEvent.clearMouseEvent();
			}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		},
		getPolygon: function (isFill, fn) {//任意绘制多边形
			// Zoom in to an area with mountains
			var _self = this;
			this.MouseEvent.clearMouseEvent();
			var drawingMode = "polygon"
			this.MouseEvent.drawPolygon(drawingMode, isFill);
			//注册停止绘制功能
			_self.MouseEvent._handler.setInputAction(function (event) {
				if (fn) {
					var dataArray = [];
					_self.MouseEvent.activeShapePoints.forEach(function (value, index, array) {
						var data = Cesium.Cartographic.fromCartesian(value);
						dataArray.push({ longitude: Cesium.Math.toDegrees(data.longitude), latitude: Cesium.Math.toDegrees(data.latitude), height: data.height });
					})
					if (dataArray.length > 1) {//把首个点加到最后，形成闭环
						var d = Cesium.Cartographic.fromCartesian(_self.MouseEvent.activeShapePoints[0]);
						dataArray.push({ longitude: Cesium.Math.toDegrees(d.longitude), latitude: Cesium.Math.toDegrees(d.latitude), height: d.height });
					}

					fn(dataArray);
				}
				_self.MouseEvent.terminateShape(drawingMode, isFill);
			}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		},
		getRectangle: function (fn) {
			var _self = this;

			this.MouseEvent.drawRectangle();
			//注册停止绘制功能
			_self.MouseEvent._handler.setInputAction(function (event) {
				if (fn) {
					var westnorth = Cesium.Cartographic.fromCartesian(_self.MouseEvent.activeShapePoints[0]);
					var southeast = Cesium.Cartographic.fromCartesian(_self.MouseEvent.activeShapePoints[1]);
					fn({ westnorth: { lon: Cesium.Math.toDegrees(westnorth.longitude), lat: Cesium.Math.toDegrees(westnorth.latitude), height: westnorth.height }, southeast: { lon: Cesium.Math.toDegrees(southeast.longitude), lat: Cesium.Math.toDegrees(southeast.latitude), height: southeast.height } })
				}
				_self.MouseEvent.terminateShape("rectangle");
			}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		},
		getCircle: function (fn) {
			var _self = this;

			this.MouseEvent.drawCircle();
			//注册停止绘制功能
			_self.MouseEvent._handler.setInputAction(function (event) {
				if (fn) {
					var center = Cesium.Cartographic.fromCartesian(_self.MouseEvent.activeShapePoints[0]);
					var radius = _self.MouseEvent.activeRadius;
					fn({ center: { lon: Cesium.Math.toDegrees(center.longitude), lat: Cesium.Math.toDegrees(center.latitude), height: center.height }, radius: radius })
				}
				_self.MouseEvent.terminateShape("circle");
			}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		},
		getLine: function (fn) {//绘制线
			var _self = this;
			// Zoom in to an area with mountains
			this.MouseEvent.clearMouseEvent();
			var drawingMode = "line"
			this.MouseEvent.drawPolygon(drawingMode);
			//注册停止绘制功能
			_self.MouseEvent._handler.setInputAction(function (event) {
				if (fn) {
					var dataArray = [];
					_self.MouseEvent.activeShapePoints.forEach(function (value, index, array) {
						var data = Cesium.Cartographic.fromCartesian(value);
						dataArray.push({ longitude: Cesium.Math.toDegrees(data.longitude), latitude: Cesium.Math.toDegrees(data.latitude), height: data.height });
					})
					fn(dataArray);
				}
				_self.MouseEvent.terminateShape(drawingMode);
			}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		},
		clearShape: function () {//清除实体
			var _self = this;
			if (this.MouseEvent.EntityArr.length > 0) {
				this.MouseEvent.EntityArr.forEach(function (o) {
					if (_self.viewer.entities.contains(o)) {
						_self.viewer.entities.remove(o);
					}
				})
			}
		},

		getMeasureTool: function (viewer, handler, toolTipId) {
			//实例化测量类
			var measure = new measureHelper({ viewer: viewer, handler: handler, toolTipId: toolTipId });
			//this.map.scene.screenSpaceCameraController.enableInputs  = false;
			return measure;
		},

		// 方法：复位/全屏--徐刚12/16   纬度，经度
		reset() {
			this.viewer.camera.flyTo({
				destination: Cesium.Cartesian3.fromDegrees(39.54, 116.23, 400000),
				duration: 1.0
			});
		},
		fullScreen() {
			this.viewer.camera.flyTo({
				destination: Cesium.Cartesian3.fromDegrees(39.54, 116.23, 41154074),
				duration: 1.0
			});
		},
		// 方法：卷帘--徐刚12/18   
		juanlian() {

			this.roller.startRoller();

		},
		setRightLayer(layer) {
			this.roller.setRightLayer(layer)

		},
		setLeftLayer(layer) {
			this.roller.setLeftLayer(layer)
		},
		//关闭卷帘
		closeRoller() {
			this.roller.removeRoller();
		},

		//添加图层
		addFenpingLayer(layer, map) {
			var _this = this;
			if (layer.url) {
				var hasAlphaChannel = true;
				if (layer.opacity == 1) {
					hasAlphaChannel = false;
				}
				var newImageLayer = new Cesium.UrlTemplateImageryProvider({
					url: layer.url,
					hasAlphaChannel: true,
					alpha: layer.opacity,
					rectangle: Cesium.Rectangle.fromDegrees(layer.region[0], layer.region[1], layer.region[2], layer.region[3]),
				});
				var newImageLayer1 = map.imageryLayers.addImageryProvider(newImageLayer);
				newImageLayer1.id = layer.id;

			}
		},
		initFenpingView: function (map) {//初始视图
			let destination = Cesium.Rectangle.fromDegrees(73, 3, 137, 54);
			let heading = Cesium.Math.toRadians(0);
			let pitch = Cesium.Math.toRadians(-90);
			let roll = Cesium.Math.toRadians(0);
			let duration = 0.001;

			map.camera.flyTo({
				destination: destination,    //Cartesian3 | Rectangle
				orientation: {
					heading: heading,
					pitch: pitch,
					roll: roll,
				},
				duration: duration,
				complete: function ()//飞行完毕后执行的动作
				{

				}
			});
		},
		// 分屏方法
		fenping() {
			var mapObjleft = {
				container: 'view3D',
			}
			var mapObjright = {
				container: 'view2D',
			}
			var view3D = this.initCesiumViewer(mapObjleft);
			this.initFenpingView(view3D)
			var view2D = this.initCesiumViewer(mapObjright);
			this.initFenpingView(view2D);
			var ImageUrlLayer = {
				id: "ditu",
				url: 'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',
				region: [-180, -90, 180, 90],
				opacity: 1,
			}
			this.addFenpingLayer(ImageUrlLayer, view2D);
			this.addFenpingLayer(ImageUrlLayer, view3D);
			this.addFenpingLayer({
				id: "rightLayer",
				url: "http://piecloud.piesat.cn/seis/v3/wmts/service/1078/18?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleMapsCompatible&format=image%2Fpng&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG%3A3857&tilematrix={z}&tilerow={y}&tilecol={x}",
				region: [73, 3, 137, 54],
				opacity: 1
			}, view3D);
			this.addFenpingLayer({
				id: "leftLayer",
				url: "http://piecloud.piesat.cn/seis/v3/wmts/service/1079/10?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleMapsCompatible&format=image%2Fpng&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG%3A3857&tilematrix={z}&tilerow={y}&tilecol={x}",
				region: [73, 3, 137, 54],
				opacity: 1
			}, view2D);
			// 定义位置和距离
			var worldPosition;
			var distance;

			function sync2DView() {
				if (in3D) {
					// The center of the view is the point that the 3D camera is focusing on
					var viewCenter = new Cesium.Cartesian2(Math.floor(view3D.canvas.clientWidth / 2), Math.floor(view3D.canvas.clientHeight / 2));
					// Given the pixel in the center, get the world position
					var newWorldPosition = view3D.scene.camera.pickEllipsoid(viewCenter);
					if (Cesium.defined(newWorldPosition)) {
						// Guard against the case where the center of the screen
						// does not fall on a position on the globe
						worldPosition = newWorldPosition;
					}
					// Get the distance between the world position of the point the camera is focusing on, and the camera's world position
					distance = Cesium.Cartesian3.distance(worldPosition, view3D.scene.camera.positionWC);
					// Tell the 2D camera to look at the point of focus. The distance controls how zoomed in the 2D view is
					// (try replacing `distance` in the line below with `1e7`. The view will still sync, but will have a constant zoom)
					view2D.scene.camera.lookAt(worldPosition, new Cesium.Cartesian3(0.0, 0.0, distance));
				}

			}

			// Apply our sync function every time the 3D camera view changes
			view3D.camera.changed.addEventListener(sync2DView);
			// By default, the `camera.changed` event will trigger when the camera has changed by 50%
			// To make it more sensitive, we can bring down this sensitivity
			view3D.camera.percentageChanged = 0.01;
			// 每次左侧改变时应用同步功能

			var worldPosition1;
			var distance1;

			function sync3DView() {
				if (in2D) {
					// The center of the view is the point that the 3D camera is focusing on
					var viewCenter = new Cesium.Cartesian2(Math.floor(view2D.canvas.clientWidth / 2), Math.floor(view2D.canvas.clientHeight / 2));
					// Given the pixel in the center, get the world position
					var newWorldPosition = view2D.scene.camera.pickEllipsoid(viewCenter);
					if (Cesium.defined(newWorldPosition)) {
						// Guard against the case where the center of the screen
						// does not fall on a position on the globe
						worldPosition1 = newWorldPosition;
					}
					// Get the distance between the world position of the point the camera is focusing on, and the camera's world position
					distance1 = Cesium.Cartesian3.distance(worldPosition1, view2D.scene.camera.positionWC);
					// Tell the 2D camera to look at the point of focus. The distance controls how zoomed in the 2D view is
					// (try replacing `distance` in the line below with `1e7`. The view will still sync, but will have a constant zoom)
					view3D.scene.camera.lookAt(worldPosition1, new Cesium.Cartesian3(0.0, 0.0, distance1));
				}

			}

			// 每次右侧改变时应用同步功能
			view2D.camera.changed.addEventListener(sync3DView);
			view2D.camera.percentageChanged = 0.01;

			var in3D = false;
			document.getElementById("view3D").onmouseover = function () {
				in3D = true;
			};
			document.getElementById("view3D").onmouseout = function () {
				in3D = false;
			};
			var in2D = false;
			document.getElementById("view2D").onmouseover = function () {
				in2D = true;
			};
			document.getElementById("view2D").onmouseout = function () {
				in2D = false;
			};


		},

		//zoomin
		zoomIn() {
			this.CameraManager.zoomIn()
		},
		//zoomOut
		zoomOut() {
			this.CameraManager.zoomOut()
		},
		// 清空底图上的图层和操作
		clean() {
			if (this.map) {
				// 删除layers
				this.removeAllLayers()
				// 删除source
				this.removeAllSources()
				// 删除markers
				if (this.markers.length) {
					this.markers.forEach((item) => {
						item.remove()
					})
				}
				this.markers = []
				if (this.popup) this.popup.remove()
			}
		},
		// 重新加载底图
		reload(callback) {
			// if (this.map) this.map.remove() // 去除现有底图
			// const userEntity = vm.$store.state.userEntity
			// this.initMap(
			// 	{
			// 		mapUrl: vm.$store.state.basicMapUrl,
			// 		lon: Number(userEntity.longitude || 0),
			// 		lat: Number(userEntity.latitude || 0)
			// 	},
			// 	callback
			// )
		},
		removeLayers: function (item) {
			// 删除layers
			console.log(this.map)
			if (this.map.getLayer(item)) {
				this.map.removeLayer(item)
				lodash.remove(this.layers, item)
			}
		},
		removeSources: function (item) {
			if (this.map.getSource(item)) {
				this.map.removeSource(item)
				lodash.remove(this.sources, item)
			}
		},
		removeAllLayers: function () {
			const _this = this
			this.layers.forEach((item) => {
				_this.removeLayers(item)
				if (_this.map.hasImage(item)) _this.map.removeImage(item)
			})
		},
		removeAllSources: function () {
			const _this = this
			this.sources.forEach((item) => {
				_this.removeSources(item)
			})
		},
	}
}
