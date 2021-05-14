import {Layer} from './Layer';
/***
 *
 * @author yqq
 */
 /**
 * @module Layer
 */
/**
 * 点图层
 * 
 * @class PointLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [color] — 图层的颜色。<br/>
 * [size] — 图层的大小。<br/>
 * [visible] — 控制图层的显隐性。<br/>
 * [colorList] - 控制色带 {endValue:1,color:"#ff0000"}
 * @constructor
 */
var pointLayer = 1;
function PointLayer(options) {
    Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "pointLayer"+pointLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.fillColor =  options.fillColor !== undefined ? options.fillColor : "#ff0000";
    this.strokeColor =  options.strokeColor !== undefined ? options.strokeColor : "#ff0000";
    this.strokeWidth =  options.strokeWidth !== undefined ? options.strokeWidth : 0;
    this.size =  options.size !== undefined ? options.size : 10;
    this.opacity =  options.opacity !== undefined ? options.opacity : 1;
    this.sourceId = options.sourceId !== undefined ? options.sourceId : false;
    this.filter = options.filter !== undefined?options.filter:false;
    this.isFill = options.isFill !== undefined ? options.isFill : true;


    this.colorList = options.colorList !== undefined ? options.colorList : false;
    this.colorProperity =  options.colorProperity !== undefined ? options.colorProperity : false;
    // this.visible = options.visible !== undefined ? options.visible : true
    this.data_type = "GeoJson";
    this.layerType= "PointLayer";
    this.initData(options);
    //map.addLayer(layer);
};
PointLayer.prototype =  Object.assign( Object.create( Layer.prototype ), {
    /**
     * initLayer
     * <p>初始化图层，根据传参data对数据进行赋值。</p>
     * @method initLayer
     * @param{Object} data 对象
     */
    initLayer:function (data) {
       
    },
    handleEntity:function(){
        let _fillColor = this.isFill ===true ? this.opacity : 0;
        var entities = this.CesiumLayer.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.billboard) {
               entity.billboard = undefined;
               entity.point = new Cesium.PointGraphics();
               entity.point.color= Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
               entity.point.outlineWidth=this.strokeWidth;
               entity.point.outlineColor=Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
               entity.point.pixelSize=this.size;
            }
        }
    },
    /**
     * handleData
     * <p>处理图层数据，根据传参self对数据进行赋值。</p>
     * @method handleData
     * @param {Object} self 对象
     */
    handleData:function (self) {
        var data = self.data;
        for (var i =0 ;i<data.features.length;i++){
            if(self.data.features[i].properties){

            }else{
                self.data.features[i].properties = {};
            }
        }
    },
    //初始GeoJsonDataSource对象
    innerLayer:function (type) {
        this.styleDefault = {
            show:true,
            stroke:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity),
            fill:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),this.opacity),
            markerColor:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),this.opacity),
            strokeWidth: this.strokeWidth,
            markerSymbol:"?",
            markerSize:this.size,
         
        }
        if(type == 3){
            this.promiseLayer = Cesium.GeoJsonDataSource.load(this.data,this.styleDefault)
            return  this.promiseLayer;
        }
    },
    /***
     * 获取线宽
     */
    getStrokeWidth : function(){
        return this.strokeWidth;
    },
    /***
     * 设置线宽
     * @param {Number} strokeWidth
     */
    setStrokeWidth:function(strokeWidth){
        this.strokeWidth = strokeWidth
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].point.outline=true;
            this.CesiumLayer.entities.values[i].point.outlineWidth =this.strokeWidth;
        }
    },

    /**
     * 获取点大小
     */
    getSize:function(){
        return this.size;
    },
    /***
     * 设置点大小
     * @param {Number} size
     */
    setSize:function(size){
        this.size = size ;
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].point.pixelSize =this.size;
        }
    },
     /***
     * 获取颜色
     */
    getFillColor : function(){
        return this.fillColor;
    },
    /***
     * 设置颜色
     * @param {String} fillColor
     */
    setFillColor:function(fillColor){
        this.fillColor = fillColor;
        let _fillColor = this.isFill ===true ? this.opacity : 0;
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].point.color =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
        }
    },
    /**
     * 获取线框颜色
     */

    getStrokeColor:function(){
        return this.strokeColor;
    },
    /**
     * 
     * @param {String} strokeColor
     * 设置外边线颜色 
     */
    setStrokeColor:function(strokeColor){
        this.strokeColor = strokeColor;
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].point.outlineColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
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
        let _fillColor = this.isFill ===true ? this.opacity : 0;
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].point.outlineColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
            this.CesiumLayer.entities.values[i].point.color =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
        }
    },
    /**
     * 获取是否填充
     */
    getIsFill:function(){
        return this.isFill;
    },
    /**
     * 设置是否填充
     * @param {Boolean} isFill 
     */
    setIsFill:function(isFill){
        this.isFill = isFill;
        let _fillColor = this.isFill ===true ? this.opacity : 0;
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].point.color =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
        }
    },


    /**
     * 更新样式
     * @param {Json} style 
     */
    updataStyle:function(style){
        Object.assign(this,style)
        if(this.colorProperity&&this.colorList){
            for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
                let color = "#fff";
                let _num = Number(this.CesiumLayer.entities.values[i].properties[this.colorProperity].getValue())
                let colorValue = this.colorList.find((item)=>{ return _num<Number(item.endValue)})
                if(colorValue) color = colorValue.color;
                this.CesiumLayer.entities.values[i].point.outlineColor =Cesium.Color.fromCssColorString(color);
                this.CesiumLayer.entities.values[i].point.color =Cesium.Color.fromCssColorString(color);
                this.CesiumLayer.entities.values[i].point.pixelSize =this.size;
                this.CesiumLayer.entities.values[i].point.outlineWidth =this.strokeWidth;
            }
        }else{
            let _fillColor = this.isFill ===true ? this.opacity : 0;
            for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
                this.CesiumLayer.entities.values[i].point.outlineColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
                this.CesiumLayer.entities.values[i].point.color =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
                this.CesiumLayer.entities.values[i].point.pixelSize =this.size;
                this.CesiumLayer.entities.values[i].point.outlineWidth =this.strokeWidth;
            }
        }
        
      
    },

    setColorList:function(colorList){
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].point.outlineColor ="";
            this.CesiumLayer.entities.values[i].point.color =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
            this.CesiumLayer.entities.values[i].point.pixelSize =this.size;
            this.CesiumLayer.entities.values[i].point.outlineWidth =this.strokeWidth;
        }
    },
});
export default PointLayer;