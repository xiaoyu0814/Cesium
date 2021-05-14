var FireMap = function(options){
    this.FireLayer = null;

}
FireMap.prototype.addFire = function(){
    var destination=Cesium.Cartesian3.fromDegrees(112.30,36.77, 30000.0);
    var  heading=Cesium.Math.toRadians(0.0);
    var  pitch=Cesium.Math.toRadians(-90);
    var  roll=Cesium.Math.toRadians(0);
    var  duration=0.1;
    PageInfo.flyTo(destination,heading,pitch,roll,duration,addGuohuo);
};

FireMap.prototype.addGuohuo = function(){
    var grid = new PIE.GridTileLayer({
        projection: "EPSG:3857",
        id:"guohuoGrid",
        region : [112.19,36.67,112.49,36.87],
        url: 'http://cloud.piesat.cn:9000/dataservices/map-editor/tiles/node1_test/tif_c3e8be4bb2334291bb31ed266c0bc214/{z}/{x}/{y}?tms=false',
    });
    map.add(grid);
    PageInfo.getData("./data/guohuo.geojson",function(data){
        console.log(data);
        if(data.features[0].geometry.type == "Polygon"){
            data.features[0] = turf.polygonToLine(data.features[0]);
        }
        console.log(data);
         var testWindLayer = new PIE.MetoStyle.LineLayer({
            data: data,
            color:"#f00",
            id: "guohuoLine",
            opacity: 1,
            width: 2,
            visible: true
        });
        map.add(testWindLayer);
    })
};

FireMap.prototype.removeFire = function(){
    let guohuoGrid = map.getLayer("guohuoGrid");
    if(guohuoGrid){
        map.remove(guohuoGrid);
    }
    
    let guohuoLine = map.getLayer("guohuoLine");
    if(guohuoLine){
        map.remove(guohuoLine);
    }
};
export default FireMap;