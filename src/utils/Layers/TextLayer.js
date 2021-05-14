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
 * @class TextLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [color] — 图层的颜色。<br/>
 * [size] — 图层的大小。<br/>
 * [visible] — 控制图层的显隐性。<br/>
 * [font] - 字体样式 courier/serif/sans-serif/Arial/monospace/cursive/fantasy/system-ui 
 * @constructor
 */
var textLayer = 1;
function TextLayer(options) {
    Layer.call(this);
    console.log('optipns', options)
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "textLayer"+textLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.fillColor =  options.fillColor !== undefined ? options.fillColor : "#000000";
    this.strokeColor =  options.strokeColor !== undefined ? options.strokeColor : "#000000";
    this.strokeWidth =  options.strokeWidth !== undefined ? options.strokeWidth : 0;
    this.size =  options.size !== undefined ? options.size : 5;
    this.opacity =  options.opacity !== undefined ? options.opacity : 1;
    this.sourceId = options.sourceId !== undefined ? options.sourceId : false;
    this.filter = options.filter !== undefined?options.filter:false;
    this.isFill = options.isFill !== undefined ? options.isFill : true;
    this.text =  options.text !== undefined ? options.text : "";
    this.offset = options.offset !== undefined ? options.offset : [0,0];
    this.font = options.font !== undefined ? options.font : "sans-serif";
    this.fontSize = options.fontSize !== undefined ? options.fontSize :30;
    // this.visible = options.visible !== undefined ? options.visible : true
    this.data_type = "GeoJson";
    this.layerType= "TextLayer";
    this.initData(options);

    //map.addLayer(layer);
};
TextLayer.prototype =  Object.assign( Object.create( Layer.prototype ), {
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
               let _text = entity.properties[this.text].getValue()
               entity.billboard = undefined;
               entity.label = new Cesium.LabelGraphics({
                  // This callback updates the length to print each frame.
                    text:  _text.toString(),
                    font : this.fontSize +"px " +  this.font,
                    pixelOffset:new Cesium.Cartesian2(this.offset[0],this.offset[1]),
                    fillColor:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),this.opacity),
                    pixelOffset : new Cesium.Cartesian2(this.offset[0],this.offset[1])
               
               });
            //    entity.label.scale = this.size;
            //    entity.label.outlineWidth=this.strokeWidth;
            //   // entity.label.style=Cesium.LabelStyle.FILL_AND_OUTLINE;
            //    entity.label.font =this.fontSize +"px " +  this.font;
            // //    entity.label.outlineColor=Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
            // //    entity.label.fillColor = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),this.opacity);
            // //    entity.label.backgroundColor=Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),this.opacity);
            //    entity.label.pixelOffset=new Cesium.Cartesian2(this.offset[0],this.offset[1]);
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
            // show:true,
            // stroke:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity),
            // fill:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),this.opacity),
            // markerColor:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),this.opacity),
            // strokeWidth: this.strokeWidth,
            // markerSymbol:"文本信息",
            // markerSize:this.size,
         
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
            this.CesiumLayer.entities.values[i].label.outline=true;
            this.CesiumLayer.entities.values[i].label.outlineWidth =this.strokeWidth;
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
            this.CesiumLayer.entities.values[i].label.scale =this.size;
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
            this.CesiumLayer.entities.values[i].label.style=Cesium.LabelStyle.FILL_AND_OUTLINE;
            this.CesiumLayer.entities.values[i].label.fillColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
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
            this.CesiumLayer.entities.values[i].label.style=Cesium.LabelStyle.FILL_AND_OUTLINE;
            this.CesiumLayer.entities.values[i].label.outlineColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
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
            this.CesiumLayer.entities.values[i].label.outlineColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
            this.CesiumLayer.entities.values[i].label.fillColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
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
            this.CesiumLayer.entities.values[i].label.style=Cesium.LabelStyle.FILL_AND_OUTLINE;
            this.CesiumLayer.entities.values[i].label.fillColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
        }
    },
    /**
     * 获取位置信息
     */
    getOffset:function(){
        return this.offset;
    },
    /**
     * 设置是否填充
     * @param {Array} offset 
     */
    setOffset:function(offset){
        this.offset = offset;
     
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].label.pixelOffset=new Cesium.Cartesian2(this.offset[0],this.offset[1]);
        }
    },

    /**
     * 获取字体大小
     */
    getFontSize:function(){
        return this.fontSize;
    },
    /**
     * 设置字体大小
     * @param {Number} fontSize 
     */
    setFontSize:function(fontSize){
        this.fontSize = fontSize;
     
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].label.font =this.fontSize +"px " +  this.font;
        }
    },

    /**
     * 获取字体类型
     */
    getFont:function(){
        return this.font;
    },
    /**
     * 设置字体类型
     * @param {String} font
     */
    setFont:function(font){
        this.font = font;
     
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].label.font =this.fontSize +"px " +  this.font;
        }
    },

    /**
     * 更新样式
     * @param {Json} style 
     */
    updataStyle:function(style){
        Object.assign(this,style)
        let _fillColor = this.isFill ===true ? this.opacity : 0;
        for(let i=0;i<this.CesiumLayer.entities.values.length;i++){
            this.CesiumLayer.entities.values[i].label.style=Cesium.LabelStyle.FILL_AND_OUTLINE;
            this.CesiumLayer.entities.values[i].label.outlineColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity);
            this.CesiumLayer.entities.values[i].label.fillColor =Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor);
            this.CesiumLayer.entities.values[i].label.outlineWidth =this.strokeWidth;
            this.CesiumLayer.entities.values[i].label.scale =this.size;
            this.CesiumLayer.entities.values[i].label.pixelOffset=new Cesium.Cartesian2(this.offset[0],this.offset[1]);
            let _text = this.CesiumLayer.entities.values[i].properties[this.text].getValue()
            this.CesiumLayer.entities.values[i].label.text= _text.toString();
            this.CesiumLayer.entities.values[i].label.font =this.fontSize +"px " +  this.font;
        }
      
    },
});
export default TextLayer;