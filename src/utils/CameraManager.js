var CameraManager = function(scene){
    this.scene = scene
    this.camera = scene.camera
}
//设置开启移动
CameraManager.prototype.openMove = function(){
    this.scene.screenSpaceCameraController.enableInputs  = true;
}
//设置关闭移动
CameraManager.prototype.closeMove = function(){
    this.scene.screenSpaceCameraController.enableInputs  = false;
}
//
CameraManager.prototype.getDataFormat = function(option){
    let headRadian = option.headRadian ? option.headRadian : 0;
    let pitchRadian = option.pitchRadian ? option.pitchRadian : -90;
    let rollRadian = option.rollRadian ? option.rollRadian : 0;
    let duration = option.duration ? option.duration : 1;
    let Isfly = option.Isfly ? option.Isfly : true;
    let callback = option.callback ? option.callback : null;
    let formatData = {
        headRadian:headRadian,
        pitchRadian:pitchRadian,
        rollRadian:rollRadian,
        duration:duration,
        Isfly:Isfly,
        callback:callback
    }
    return formatData;
};
//设置相机经纬度
CameraManager.prototype.setLonlat = function(option){
    let lon = option.lon ? option.lon : 0;
    let lat = option.lat ? option.lat : 0;
    let height = option.height ? option.height : 10000;
    const { headRadian = 0, pitchRadian = -90, rollRadian = 0, duration = 1, Isfly = true,callback = null } = this.getDataFormat(option);

    let destination =  Cesium.Cartesian3.fromDegrees(lon, lat, height);
    let heading = Cesium.Math.toRadians(Number(headRadian));
    let pitch = Cesium.Math.toRadians(Number(pitchRadian));
    let roll = Cesium.Math.toRadians(Number(rollRadian));

    if(Isfly){
        this.flyTo(destination,heading,pitch,roll,duration,callback);
    }else{
        this.setView(destination,heading,pitch,roll,duration,callback);
    }
   
    
};
//设置相机范围
CameraManager.prototype.setRectangle = function(option){
    let west = option.west ? option.west : 0;
    let south = option.south ? option.south : 0;
    let east = option.east ? option.east : 0;
    let north = option.north ? option.north : 0;
    const { headRadian = 0, pitchRadian = -90, rollRadian = 0, duration = 1, Isfly = true,callback = null } = this.getDataFormat(option);
    let destination = Cesium.Rectangle.fromDegrees(west,south,east,north);
    let heading = Cesium.Math.toRadians(Number(headRadian));
    let pitch = Cesium.Math.toRadians(Number(pitchRadian));
    let roll = Cesium.Math.toRadians(Number(rollRadian));
    if(Isfly){
        this.flyTo(destination,heading,pitch,roll,duration,callback);
    }else{
        this.setView(destination,heading,pitch,roll,duration,callback);
    }
    
};
//设置相机弧度
CameraManager.prototype.setRadians = function(option){
    let lonRad = option.lonRad ? option.lonRad : 0;
    let latRad = option.latRad ? option.latRad : 0;
    let height = option.height ? option.height : 10000;
    const { headRadian = 0, pitchRadian = -90, rollRadian = 0, duration = 1, Isfly = true,callback = null } = this.getDataFormat(option);
    let destination = Cesium.Cartesian3.fromRadians(lonRad, latRad, height);
    let heading = Cesium.Math.toRadians(Number(headRadian));
    let pitch = Cesium.Math.toRadians(Number(pitchRadian));
    let roll = Cesium.Math.toRadians(Number(rollRadian));
    if(Isfly){
        this.flyTo(destination,heading,pitch,roll,duration,callback);
    }else{
        this.setView(destination,heading,pitch,roll,duration,callback);
    }
};

//飞行过去
CameraManager.prototype.flyTo = function(destination, head, pitch, roll, duration, call){
    if (this.camera) {
        this.camera.flyTo({
            destination: destination,    //Cartesian3 | Rectangle
            orientation: {
                heading: head,
                pitch: pitch,
                roll: roll,
            },
            duration: duration,
            complete: function ()//飞行完毕后执行的动作
            {
                if (call)//如果有回调函数
                {
                    call();
                }
            }
        });
    } else {
       console.error("Camera is Not Find")
    }
};
CameraManager.prototype.setView = function(destination, head, pitch, roll, duration, call){
    if (this.camera) {
        this.camera.setView({
            destination: destination,    //Cartesian3 | Rectangle
            orientation: {
                heading: head,
                pitch: pitch,
                roll: roll,
            },
            duration: duration,
            complete: function ()//飞行完毕后执行的动作
            {
                if (call)//如果有回调函数
                {
                    call();
                }
            }
        });
    } else {
       console.error("Camera is Not Find")
    }
};

CameraManager.prototype.zoomIn = function(){
    // 获取当前镜头位置的笛卡尔坐标
    let cameraPos = this.camera.position;

    // 获取当前坐标系标准
    let ellipsoid = this.scene.globe.ellipsoid;

    // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
    let cartographic = ellipsoid.cartesianToCartographic(cameraPos);

    // 获取镜头的高度
    let height = cartographic.height;

    let centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
    let centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

    // 镜头拉近
    this.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height / 1.8),
        duration: 1.0
    });
};
CameraManager.prototype.zoomOut = function(){
    // 获取当前镜头位置的笛卡尔坐标
    let cameraPos = this.camera.position;

    // 获取当前坐标系标准
    let ellipsoid = this.scene.globe.ellipsoid;

    // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
    let cartographic = ellipsoid.cartesianToCartographic(cameraPos);

    // 获取镜头的高度
    let height = cartographic.height;

    let centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
    let centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));
    // 镜头拉远
    this.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height * 1.8),
        duration: 1.0
    });
};

export default CameraManager;