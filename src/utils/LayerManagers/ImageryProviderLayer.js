//添加栅格 图层

var ImageryProviderLayer = function(option){
    this.viewer = option.viewer;
    this.imageryLayers = [];
};

ImageryProviderLayer.prototype.addLayer = function(option){
    let viewer = this.viewer;
    let _index = this.imageryLayers.findIndex((item)=>{return item.id==option.id});
    if(_index>-1){
        console.error("图层id重复");
        return 
    }
    this.imageryLayers.push(option);
    let ImageLayer = option.innerLayer(3);
    option.CesiumImageLayer = viewer.imageryLayers.addImageryProvider(ImageLayer);
    option.CesiumImageLayer.id = option.id;
    option.CesiumImageLayer.type =  option.type;
    return option.CesiumImageLayer;
};
ImageryProviderLayer.prototype.removeLayer = function(id){
    var imageryLayers = this.viewer.imageryLayers;
    for (var i= 0; i < imageryLayers.length; i++) {
        if (imageryLayers.get(i).id==id) {
            imageryLayers.remove(imageryLayers.get(i));
            break;
        }
    }
};
ImageryProviderLayer.prototype.hideLayer = function(id){
    var imageryLayers = this.viewer.imageryLayers;
    for (var i= 0; i < imageryLayers.length; i++) {
        if (imageryLayers.get(i).id==id) {
            imageryLayers.get(i).show = false;
            break;
        }
    }
};
ImageryProviderLayer.prototype.showLayer = function(id){
    var imageryLayers = this.viewer.imageryLayers;
    for (var i= 0; i < imageryLayers.length; i++) {
        if (imageryLayers.get(i).id==id) {
            imageryLayers.get(i).show = true;
            break;
        }
    }
};
ImageryProviderLayer.prototype.lowerLayer = function(id){
    var imageryLayers = this.viewer.imageryLayers;
    for (var i= 0; i < imageryLayers.length; i++) {
        if (imageryLayers.get(i).id==id) {
            imageryLayers.lower(imageryLayers.get(i));
            break;
        }
    }
};
ImageryProviderLayer.prototype.raiseLayer = function(id){
    var imageryLayers = this.viewer.imageryLayers;
    for (var i= 0; i < imageryLayers.length; i++) {
        if (imageryLayers.get(i).id==id) {
            imageryLayers.raise(imageryLayers.get(i));
            break;
        }
    }
};
ImageryProviderLayer.prototype.getLayer = function(id){
    var imageryLayers = this.imageryLayers;
    let _layer =  null;
    for (var i= 0; i < imageryLayers.length; i++) {
        if (imageryLayers[i].id==id) {
            _layer = imageryLayers[i];
            break;
        }
    }
    return _layer;
};
export default ImageryProviderLayer;