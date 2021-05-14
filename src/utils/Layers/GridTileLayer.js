import {Layer} from './Layer';
/***
 *
 * @author yqq
 */

 /**
 * @module Layer
 */
/**
 * LineLayer
 * <a href="../../examples/Layer_GeoJsonLayer.html">Layer_GeoJsonLayer.html:36</a>
 * 
 * @class LineLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [color] — 符号样式,包含线颜色。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [opacity] — 图层的透明度。<br/>
 * [width] — 图层的宽度。<br/>
 * [dasharray] — 虚线数组[2,4]。<br/>
 * [visible] — 图层的隐藏可见（继承父级layer）
 * @constructor
 */
var gridTileLayer = 1;
function GridTileLayer (options) {
    Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "gridTileLayer"+gridTileLayer++;
    this.region = options.region !== undefined ? options.region : [-180,-90,180,90]; 
    this.data_type = "Imagery";
    this.layerType = "GridTileLayer";
    this.opacity  = options.opacity !== undefined ? options.opacity : 1;
    this.maxZoom = options.maxZoom !== undefined ? options.maxZoom : 25;
    this.minZoom = options.minZoom !== undefined ? options.minZoom : 0;
    this.color =  options.color !== undefined ? options.color : "#000000";
};
GridTileLayer.prototype = Object.assign( Object.create( Layer.prototype ), {

    /**
     * innerLayer
     * <p>初始化图层，根据传参data对数据进行赋值。</p>
     * @method innerLayer
     * @param{Object} data 对象
     */
    innerLayer:function (type) {
        if(type == 3){
            let url = this.url ;
            if(url == "") return;
        
            var ImageLayer = new Cesium.UrlTemplateImageryProvider({
                url: url,
                hasAlphaChannel: true,
                alpha:1,
               
                minimumLevel:this.minZoom,
                maximumLevel:this.maxZoom,
                rectangle: Cesium.Rectangle.fromDegrees(this.region[0], this.region[1], this.region[2], this.region[3]),
            });
            this.UrlImageryLayer =ImageLayer;
            return this.UrlImageryLayer;
           
        }
    },

    /**
     * 获取透明度
     */
    getOpactity:function(){
        return this.opacity;
    },
    /**
     * 设置透明度
     * @param {Number} opacity 
     */
    setOpacity:function(opacity){
        this.opacity = opacity;
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].polyline.material =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.color),this.opacity);
        }
    },

});
export default GridTileLayer