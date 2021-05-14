import {Layer} from './Layer';
/***
 *
 * @author yqq
 */

 /**
 * @module Layer
 */
/**
 * PolygonLayer
 * 
 * @class PolygonLayer
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
var polygonLayer = 1;
function PolygonLayer (options) {
    Layer.call(this);
    options = options || {};
    
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "polygonLayer"+polygonLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.data_type = "GeoJson";
    this.layerType = "PolygonLayer";
    //this.symbol = options.symbol !== undefined ? options.symbol : new PIE.LineSymbol({color:"blue",width:1});
    this.strokeWidth = options.strokeWidth !== undefined ? options.strokeWidth : 0;
    this.strokeColor =  options.strokeColor !== undefined ? options.strokeColor : "#ffff00";
    this.opacity  = options.opacity !== undefined ? options.opacity : 1;
    this.isFill = options.isFill !== undefined ? options.isFill : true;
    this.fillColor =  options.fillColor !== undefined ? options.fillColor : "#ffff00";
    this.filter = options.filter !== undefined?options.filter:false;
   
    this.updata = options.updata !== undefined ? options.updata : false;
    this.data_id = options.data_id !== undefined ? options.data_id : false;

    this.colorList = options.colorList !== undefined ? options.colorList : false;
    this.colorProperity =  options.colorProperity !== undefined ? options.colorProperity : false;

    this.initData(options);
};
PolygonLayer.prototype = Object.assign( Object.create( Layer.prototype ), {
    initLayer:function(data){
    
    },

    /**
     * innerLayer
     * <p>初始化图层，根据传参data对数据进行赋值。</p>
     * @method innerLayer
     * @param{Object} data 对象
     */
    innerLayer:function (type) {
        //Cesium.Color.fromAlpha(new Cesium.Color(color.r, color.g, color.b),geoObject.material.getValue().color.alpha)
        let _fillColor = this.isFill ===true ? this.opacity : 0;
        this.styleDefault = {
            show:true,
            stroke:  Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity),
            fill:  Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor),
            strokeWidth: this.strokeWidth,
           
        }
        if(type == 3){
            this.promiseLayer = Cesium.GeoJsonDataSource.load(this.data,this.styleDefault)
            return  this.promiseLayer;
        }
    },
    /**
     * handleData
     * <p>处理图层数据，根据传参self对数据进行赋值。</p>
     * @method handleData
     * @param{Object} self 对象
     * @param{Object} callback
     */
    handleData:function (self,callback) {
        for (var i =0 ;i<self.data.features.length;i++){
            if(self.data.features[i].properties){

            }else{
                self.data.features[i].properties = {};
            }
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
     */
    setStrokeWidth:function(strokeWidth){
        this.strokeWidth = strokeWidth
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].polygon.outline=true;
            this.CesiumLayer.entities.values[i].polygon.outlineWidth =this.strokeWidth;
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
     */
    setFillColor:function(fillColor){
        this.fillColor = fillColor;
        let _fillColor = this.isFill ===true ? this.opacity : 0;
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].polygon.material =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
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
            this.CesiumLayer.entities.values[i].polygon.outlineColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
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
            this.CesiumLayer.entities.values[i].polygon.outlineColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
            this.CesiumLayer.entities.values[i].polygon.material =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
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
            this.CesiumLayer.entities.values[i].polygon.material =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
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
                this.CesiumLayer.entities.values[i].polygon.outlineColor =Cesium.Color.fromCssColorString(color);
                this.CesiumLayer.entities.values[i].polygon.material =Cesium.Color.fromCssColorString(color);
            }
        }else{
            let _fillColor = this.isFill ===true ? this.opacity : 0;
            for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
                this.CesiumLayer.entities.values[i].polygon.outlineColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
                this.CesiumLayer.entities.values[i].polygon.material =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
                this.CesiumLayer.entities.values[i].polygon.outlineWidth =this.strokeWidth;
            }
        }
      
    },


    setData:function(wsPoint,enPoint,zoom){
        let url = this.url;
        let params = {
            datasetId:this.data_id,
            "projectCode": "4326",
            geometry:{
                "type":"Polygon",
                "coordinates":[]
            }
        }
        let ltPoint = [wsPoint[0],enPoint[1]];
        let rtPoint = enPoint;
        let rbPoint = [enPoint[0],wsPoint[1]];
        let lbPoint = wsPoint;
        params.geometry.coordinates[0] = [ltPoint,rtPoint,rbPoint,lbPoint,ltPoint];
        console.log(url,params);


        this.postData(url,params,(res)=>{
            console.log(res)
        })
    },

});
export default PolygonLayer