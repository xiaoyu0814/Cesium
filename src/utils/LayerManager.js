/*地图图层菜单目录构造*/
/*
 *name-图层名称
 *layerurl-图层服务配置
 *type代表地图服务类型:
 0代表ArcGisMapServerImageryProvider;
 1代表createOpenStreetMapImageryProvider;
 2代表WebMapTileServiceImageryProvider;
 3代表createTileMapServiceImageryProvider;
 4 代表UrlTemplateImageryProvider;
 5 代表WebMapServiceImageryProviderr(WMS);
 6 代表kml,kmz;
 7 代表geoJson;
 *layerid-图层id
 */

import GeoJsonLayer from "./LayerManagers/GeoJsonLayer";
import PrimitiveLayer from "./LayerManagers/PrimitiveLayer";
import ImageryProviderLayer from "./LayerManagers/ImageryProviderLayer";

var LayerManager = function(option){

    this.layers = [];
    this.viewer = option.viewer;
    this.geoJsonLayer = new GeoJsonLayer(option);
    this.primitiveLayer = new PrimitiveLayer(option);
    this.imageryLayer = new ImageryProviderLayer(option);
};
//添加图层
LayerManager.prototype.addLayer = function(option){
    if(option.data_type == "GeoJson"){
        this.geoJsonLayer.addLayer(option);
    }else if(option.data_type == "Imagery"){
        return this.imageryLayer.addLayer(option);
    }else if(option.data_type == "Primitive"){
        return this.primitiveLayer.addLayer(option);
    }
};
//移除图层
LayerManager.prototype.removeLayer = function(option){
    if(option.data_type == "GeoJson"){
        this.geoJsonLayer.removeLayer(option.id);
    }else if(option.data_type == "Imagery"){
        this.imageryLayer.removeLayer(option.id);
    }else if(option.data_type == "Primitive"){
        return this.primitiveLayer.removeLayer(option.id);
    }
};
//移动图层
LayerManager.prototype.moveLayer = function(){

};
//显示图层
LayerManager.prototype.showLayer = function(option){
    if(option.data_type == "GeoJson"){
        this.geoJsonLayer.showLayer(option.id);
    }else if(option.data_type == "Imagery"){
        this.imageryLayer.showLayer(option.id);
    }
};
//隐藏图层
LayerManager.prototype.hideLayer = function(option){
    console.log(option);
    if(option.data_type == "GeoJson"){
        this.geoJsonLayer.hideLayer(option.id);
    }else if(option.data_type == "Imagery"){
        this.imageryLayer.hideLayer(option.id);
    }
};
//下移图层
LayerManager.prototype.lowerLayer = function(option){
    if(option.data_type == "GeoJson"){
        this.geoJsonLayer.lowerLayer(option.id);
    }else if(option.data_type == "Imagery"){
        this.imageryLayer.lowerLayer(option.id);
    }

};
//上移图层
LayerManager.prototype.raiseLayer = function(option){
    if(option.data_type == "GeoJson"){
        this.geoJsonLayer.raiseLayer(option.id);
    }else if(option.data_type == "Imagery"){
        this.imageryLayer.raiseLayer(option.id);
    }
};

//获取图层
LayerManager.prototype.getLayer = function(option){
    if(option.data_type == "GeoJson"){
        return this.geoJsonLayer.getLayer(option.id);
    }else if(option.data_type == "Imagery"){
        return this.imageryLayer.getLayer(option.id);
    }else if(option.data_type == "Primitive"){
        return this.primitiveLayer.getLayer(option.id);
    }
}
export default LayerManager;