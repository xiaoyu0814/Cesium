//图元图层
// var billboards = new Cesium.BillboardCollection();
// var labels = new Cesium.LabelCollection();

// var collection = new Cesium.PrimitiveCollection();
// collection.add(billboards);

// scene.primitives.add(collection);  // Add collection
// scene.primitives.add(labels);      // Add regular primitive

//添加geoJson 图层

var PrimitiveLayr = function(option){
    this.viewer = option.viewer;
    this.primitives = [];
};

PrimitiveLayr.prototype.addLayer = function(option){
    let data = option.data ? option.data : "";
    if(data == "") return;
    let viewer = this.viewer;
    let geometryInstances  = [];
    for(let i=0;i<data.features.length;i++){
        let feature = data.features[i];
        let geometryInstance = null;
        let type = feature.geometry.type;//几何对象的类型：点，线，面
        let coordinates = feature.geometry.coordinates;//几何对象的点数组
        let properties = feature.properties;//几何对象的属性信息
        let elevation = properties.ELEVATION;

        if (type == "Polygon") {
            //debugger
            var coordinate = [].concat.apply([], coordinates[0]);//几何对象的坐标
            var position = Cesium.Cartesian3.fromDegreesArray(coordinate);
            var polygon = new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(position),

              });
            var geometry = Cesium.PolygonGeometry.createGeometry(polygon);

               // 根据图形实例创建一个图元
            geometryInstance = new Cesium.GeometryInstance({//地理位置
                geometry: geometry,
                id: 'myLine' + i.toString(),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 0.0, 0.5))
                },
                appearance: new Cesium.PolylineColorAppearance({
                    translucent: true
                })
            });
        }else if(type == "LineString"){
            var coordinate = [].concat.apply([], coordinates);//几何对象的坐标
            var position = Cesium.Cartesian3.fromDegreesArrayHeights(coordinate);

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

        }else if(type == "Point"){

        }

        if (geometryInstance != null) {
            geometryInstances.push(geometryInstance);
        }

    }
    var primitive = new Cesium.Primitive({
        geometryInstances: geometryInstances,
        appearance: new Cesium.PolylineColorAppearance({
            translucent: true
        })
    });
    primitive.id = option.id;
   
    viewer.scene.primitives.add(primitive);
    return primitive;
};
PrimitiveLayr.prototype.removeLayer = function(id){
    var primitives = this.viewer.primitives;
    for (var i= 0; i < primitives.length; i++) {
        if (primitives.get(i).id==id) {
            primitives.remove(primitives.get(i));
            break;
        }
    }
};
PrimitiveLayr.prototype.hideLayer = function(id){
    var primitives = this.viewer.primitives;
    for (var i= 0; i < primitives.length; i++) {
        if (primitives.get(i).id==id) {
            primitives.get(i).show = false;
            break;
        }
    }
};
PrimitiveLayr.prototype.showLayer = function(id){
    var primitives = this.viewer.primitives;
    for (var i= 0; i < primitives.length; i++) {
        if (primitives.get(i).id==id) {
            primitives.get(i).show = true;
            break;
        }
    }
};
PrimitiveLayr.prototype.lowerLayer = function(id){
    var primitives = this.viewer.primitives;
    for (var i= 0; i < primitives.length; i++) {
        if (primitives.get(i).id==id) {
            primitives.lower(primitives.get(i));
            break;
        }
    }
};
PrimitiveLayr.prototype.raiseLayer = function(id){
    var primitives = this.viewer.primitives;
    for (var i= 0; i < primitives.length; i++) {
        if (primitives.get(i).id==id) {
            primitives.raise(primitives.get(i));
            break;
        }
    }
};
export default PrimitiveLayr;