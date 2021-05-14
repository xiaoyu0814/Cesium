//添加geoJson 图层

var GeoJsonLayer = function(option){
    this.viewer = option.viewer;
    this.dataSources = [];
    this.styleDefault = {
        show:true,
        stroke:Cesium.Color.BLACK,
        fill: Cesium.Color.BLACK,
        markerColor:Cesium.Color.BLACK,
        strokeWidth: 1,
        markerSize:0,
        clampToGround:true
    }
};

GeoJsonLayer.prototype.addLayer = function(option){
    let viewer = this.viewer;
    let _this = this;
    
    let _index = this.dataSources.findIndex((item)=>{return item.id==option.id});
    if(_index>-1){
        console.error("图层id重复");
        return 
    }
    this.dataSources.push(option);
    let promise = option.innerLayer(3);
    promise.then(function(dataSource){
        viewer.dataSources.add(dataSource);
        dataSource.id = option.id;
        option.CesiumLayer = dataSource;
        console.log("添加图层成功");
        if(option.layerType=="PointLayer"||option.layerType == "TextLayer"){
            option.handleEntity();
        }
        if(option.updata){
            _this.addEvent(option);
        }
    })
};
/**
 * 获取图层
 */
GeoJsonLayer.prototype.getLayer = function(id){
    var dataSources = this.dataSources;
    let _layer =  null;
    for (var i= 0; i < dataSources.length; i++) {
        if (dataSources[i].id==id) {
            _layer = dataSources[i];
            break;
        }
    }
    return _layer;
};
GeoJsonLayer.prototype.removeLayer = function(id){
    var dataSources = this.viewer.dataSources;
    for (var i= 0; i < dataSources.length; i++) {
        if (dataSources.get(i).id==id) {
            dataSources.remove(dataSources.get(i));
            break;
        }
    }
    let _index = this.dataSources.findIndex((item)=>{return item.id==id});
    if(_index>-1){
        this.dataSources.splice(_index,1);
    }
};
GeoJsonLayer.prototype.hideLayer = function(id){
    var dataSources = this.viewer.dataSources;
    for (var i= 0; i < dataSources.length; i++) {
        if (dataSources.get(i).id==id) {
            dataSources.get(i).show = false;
            break;
        }
    }
};
GeoJsonLayer.prototype.showLayer = function(id){
    var dataSources = this.viewer.dataSources;
    for (var i= 0; i < dataSources.length; i++) {
        if (dataSources.get(i).id==id) {
            dataSources.get(i).show = true;
            break;
        }
    }
};
GeoJsonLayer.prototype.lowerLayer = function(id){
    var dataSources = this.viewer.dataSources;
    for (var i= 0; i < dataSources.length; i++) {
        if (dataSources.get(i).id==id) {
            dataSources.lower(dataSources.get(i));
            break;
        }
    }
};
GeoJsonLayer.prototype.raiseLayer = function(id){
    var dataSources = this.viewer.dataSources;
    for (var i= 0; i < dataSources.length; i++) {
        if (dataSources.get(i).id==id) {
            dataSources.raise(dataSources.get(i));
            break;
        }
    }
};

GeoJsonLayer.prototype.addEvent = function(layer){
    let scene = this.viewer.scene;
    let viewer = this.viewer;
    let A = 40487.57;
    let B = 0.00007096758;
    let C = 91610.74;
    let D = -40467.74;
    let _this = this;
    scene.camera.moveEnd.addEventListener(function(){
        let height = Math.ceil(viewer.camera.positionCartographic.height);
        console.log("moveEnd");
  
        let zoom = Math.round(D +(A-D)/(1 + Math.pow(height / C,B)))
        let rec = viewer.camera.computeViewRectangle();
        let wsPoint=[rec.west / Math.PI * 180,rec.south / Math.PI * 180];  
        let enPoint=[rec.east / Math.PI * 180,rec.north / Math.PI * 180]; 

        let ltPoint = [wsPoint[0],enPoint[1]];
        let rtPoint = enPoint;
        let rbPoint = [enPoint[0],wsPoint[1]];
        let lbPoint = wsPoint;
        let coordinates = [ltPoint,rtPoint,rbPoint,lbPoint,ltPoint]
     
        _this.upData(layer,coordinates)
    });
};

GeoJsonLayer.prototype.upData = function(layer,coordinates){
    let url = layer.url;
    let _this = this;
    let params = {
        datasetId:layer.data_id,
        "projectCode": "4326",
        geometry:{
            "type":"Polygon",
            "coordinates":[]
        }
    }
    let viewer = this.viewer;
    params.geometry.coordinates[0] = coordinates ;
    console.log(url,params);

    layer.postData(url,params,(res)=>{
        console.log(res);
        if(res.code==0){
            _this.removeLayer(layer.id);
            layer.data = res.data;
            let promise = layer.innerLayer(3);
            promise.then(function(dataSource){
                viewer.dataSources.add(dataSource);
                dataSource.id = layer.id;
                layer.CesiumLayer = dataSource;
                console.log("添加图层成功");
                if(layer.layerType=="PointLayer"||layer.layerType == "TextLayer"){
                    layer.handleEntity();
                }
            })
        }else{

        }
    })
};
export default GeoJsonLayer;