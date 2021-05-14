//设置卷帘
var RollershadersManager = function(option){
    this.viewer = option.viewer;
    this.layers=[];
};

RollershadersManager.prototype.startRoller = function(option){
    
    console.log("成功调用卷帘方法")
    var _this = this
    // DOM生成div
    var body = document.body;
    var slider = document.createElement("div")
    slider.id = "slider"
    var sliderr = document.getElementById("slider")
    if (!sliderr) {
        body.appendChild(slider);
    } else {//div消失但图层没消失
        // body.removeChild(sliderr);
        // this.removeLayers();
    }
    // 定义一个图层
    var layers = this.viewer.imageryLayers;
    this.setRightLayer({
        id: "rightLayer",
        url: "http://piecloud.piesat.cn/seis/v3/wmts/service/1078/18?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleMapsCompatible&format=image%2Fpng&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG%3A3857&tilematrix={z}&tilerow={y}&tilecol={x}",
        region: [73, 3, 137, 54],
        opacity: 1
    });
    this.setLeftLayer({
        id: "leftLayer",
        url: "http://piecloud.piesat.cn/seis/v3/wmts/service/1079/10?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleMapsCompatible&format=image%2Fpng&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG%3A3857&tilematrix={z}&tilerow={y}&tilecol={x}",
        region: [73, 3, 137, 54],
        opacity: 1
    });
    var leftLayer =_this.viewer.imageryLayers._layers.find((item) => { return item.id == "leftLayer" });
    leftLayer.splitDirection = Cesium.ImagerySplitDirection.LEFT; // Only show to the left of the slider.
    // 将滑块位置与拆分位置同步
    this.setSlider();
};
//添加滑动监听
RollershadersManager.prototype.setSlider = function(){
    var _this = this;
    var slider = document.getElementById('slider');
    // 图层位置=(slider.距离浏览器左边的距离)/slider.parentElement.offsetWidth
    this.viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;
    // 定义“操作” = 可以添加自定义功能以在以下位置执行当用户输入输入等操作时
    var handler = new Cesium.ScreenSpaceEventHandler(slider);
    // 鼠标移动事件↓
    var moveActive = false;
    function move(movement) {
        if (!moveActive) {
            return;
        }
        var relativeOffset = movement.endPosition.x;
        var splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
        slider.style.left = 100.0 * splitPosition + '%';
        _this.viewer.scene.imagerySplitPosition = splitPosition;
        // this.map.viewer.scene.imagerySplitPosition = splitPosition;
    }
    handler.setInputAction(function () {
        moveActive = true;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    handler.setInputAction(function () {
        moveActive = true;
    }, Cesium.ScreenSpaceEventType.PINCH_START);
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);
    handler.setInputAction(function () {
        moveActive = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    handler.setInputAction(function () {
        moveActive = false;
        }, Cesium.ScreenSpaceEventType.PINCH_END);
        console.log("卷帘方法运行结束")
};
RollershadersManager.prototype.setLeftLayer = function(layer){
    var _this = this;
    var leftLayer =  _this.viewer.imageryLayers._layers.find((item) => { return item.id == "leftLayer" });
    var leftLayerIndex = _this.viewer.imageryLayers._layers.findIndex((item) => { return item.id == "leftLayer" });

    if (leftLayer && leftLayerIndex > -1) {
        this.viewer.imageryLayers.remove(leftLayer)
    }else{
        leftLayerIndex = _this.viewer.imageryLayers._layers.length +1;
    }
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
        var newImageLayer1 = _this.viewer.imageryLayers.addImageryProvider(newImageLayer,leftLayerIndex);
        newImageLayer1.id = layer.id;
       
        newImageLayer1.splitDirection = Cesium.ImagerySplitDirection.LEFT;
    }
};
RollershadersManager.prototype.setRightLayer = function(layer){
    var _this = this;
    var leftLayer = _this.viewer.imageryLayers._layers.find((item) => { return item.id == layer.id });
    var leftLayerIndex = _this.viewer.imageryLayers._layers.findIndex((item) => { return item.id == layer.id });

    if (leftLayer && leftLayerIndex > -1) {
        this.viewer.imageryLayers.remove(leftLayer)
       
    }else{
        leftLayerIndex = _this.viewer.imageryLayers._layers.length +1;
    }
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
        var newImageLayer1 = _this.viewer.imageryLayers.addImageryProvider(newImageLayer,leftLayerIndex);
        newImageLayer1.id = layer.id;
    }
};
RollershadersManager.prototype.removeLayer = function(id){
    var _this = this;
    var leftLayer = _this.viewer.imageryLayers._layers.find((item) => { return item.id == id });
    var leftLayerIndex = _this.viewer.imageryLayers._layers.findIndex((item) => { return item.id == id });
    if (leftLayer && leftLayerIndex > -1) {
        this.viewer.imageryLayers.remove(leftLayer)
        
    }
}

RollershadersManager.prototype.removeRoller =function(){
   
    this.removeLayer("leftLayer");
    this.removeLayer("rightLayer");
    var sliderr = document.getElementById("slider")
    if(sliderr){
        document.body.removeChild(sliderr);
    }
};

export default RollershadersManager;