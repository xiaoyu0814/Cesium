import {EventDispatcher} from "../core/EventDispatcher";
/***
 *
 * @param options
 * @author yqq
 */

/**
 * Layer图层是承载地图服务的载体，layers列出了所有可用的图层。图层的类型由"type"属性指定，并且必须是背景，填充，线条，符号，栅格，圆形，填充，热图，山体阴影之一。除了背景类型的图层，每个图层都需要引用一个源。图层从源获取数据，可选择过滤器功能，然后定义这些功能的样式。
 * @class Layer
 * @param {Object} options <br/>
 * [id] — 图层的唯一id<br/>
 * [style] — 图层的样式。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [visible] — 图层的隐藏可见
 * @constructor
 */

var layerId = 1;

function Layer(options) {
    EventDispatcher.call(this);
    options = options || {};
    this.id = options.id !== undefined ? options.id : "Layer"+layerId ++;
    this.style = options.style !== undefined ? options.style : "";
    this.data = options.data !== undefined ? options.data : "";
    this.visible = options.visible !== undefined ? options.visible : "visible";
    this.extObj = options.extObj || {};
    this.loadEvent = true;
    this.drawType = options.type;
    this.name = options.name;
    this.data_id = options.data_id || options.dataset_id
    this.show = options.show;
}

Layer.prototype = Object.assign(Object.create(EventDispatcher.prototype),{
    /**
     * initData
     * <p>初始化图层，根据传参option对数据进行重新赋值。</p>
     */
    initData:function (options) {
        var self = this;
        if(options !== undefined){
            if(options.visible == "none" || options.visible == false){
                this.visible = "none";
            }else if(options.visible == "visible" || this.visible == true||options.visible == true){
                this.visible = "visible"
            }
           
        }
        
        if(this.data !== ""){
            if(typeof( this.data) == "string"){
                var callback = function(_this){
                     _this.handleData(_this);
                    self.initLayer(self.data);
                    console.log("url 返回数据");
                    self.setLoad();
                }
                this.getData(this.data, callback)
            }else{
                this.handleData(this);
                self.initLayer(self.data);
                console.log("数据整理");
                self.setLoad();
            }
        }
        if(this.url !== ""){
            var callback = function(_this){
                _this.handleData(_this);
                self.initLayer(self.data);
                console.log("url 返回数据");
                self.setLoad();
            }
            this.getData(this.url, callback)
        }
        if(this.sourceId){
            self.initLayer();
        }
    },
    
    /**
     * setVisible
     * <p>根据所传参数设置图层的显示隐藏效果。</p>
     * <a href="../../examples/Graphics_Editor.html">Graphics_Editor.html</a>
     * 
     * @method setVisible
     * @param{boolean} visible
     */
    setVisible:function(visible){
        this.visible=visible;
        if(visible){
            this.dispatchEvent({type: "visible",visible:"visible"});
        }else{
            this.dispatchEvent({type: "visible",visible: "none"});
        }
    },
    /**
     * setOpacity
     * <p>根据所传参数设置图层的透明度。</p>
     * <a href="../../examples/Graphics_Editor.html">Graphics_Editor.html</a>
     * 
     * @method setOpacity
     * @param{number} opacity 要设置的透明度
     */
    setOpacity:function(opacity){
        this.opacity = opacity
        this.dispatchEvent({type: "opacity",opacity:opacity});
    },
    /**
     * setLoad
     * <p>重新加载图层</p>
     * @method setLoad
     */
    setLoad:function () {
        if(this.loadEvent){
            this.loadEvent = false
            this.dispatchEvent({type:"load"});
        }else{

        }
        
    },
    /**
     * setSource
     * <p>根据所传参数设置图层的元数据。</p>
     *
     * 
     * @method setSource
     * @param{string} data
     */
    setSource:function (data) {
        var self = this;
        if(self.type == "rasterLayer"){
            self.dispatchEvent({type: "source",data:data});
        }else{
            if(typeof (data )== "string"){
                console.log(123123123456789,data)
                var callback = function(self){
                    self.handleData(self);
                    self.dispatchEvent({type: "source",data:self.data});
                }
                this.getData(data, callback)
                // .then(function (self) {
                //     self.handleData(self);
                //     self.dispatchEvent({type: "source",data:self.data});
                // });
            }else{
                self.data = data;
                self.handleData(self);
                self.dispatchEvent({type: "source",data:self.data});
            }
        }
    },
    /*getDataSource:function () {
        this.dispatchEvent({type: "opacity",opacity:opacity});
    },*/
    /**
     * getData
     * <p>根据所传参数设置url地址。</p>
     * @method getData
     * @param{string} url
     */
    getData : function (url,fn) {
        var self = this;
        // return new Promise( (resolve,reject) =>{
        var xhr = new XMLHttpRequest();
        //xhr.open("GET","http://"+url, true);
        xhr.open("GET",url, true);
        xhr.onload = function () {
            if (xhr.status == 200 ) {
                var result = JSON.parse(xhr.response)
                if (result.length === 0) {
                    console.log('数据读取失败');
                    // reject('数据读取失败');
                    return false;
                }
                /*for(var i=0;i<result.features.length;i++){
                    result.features[i].epsg = 4326;
                }*/
                
                self.data = result;
                console.log(123123456456789798,self)
                fn(self);
            } else {
                // reject(xhr.statusText);
            }
        };
        xhr.onerror = function () {
            // reject(xhr.statusText);
        };
        xhr.send(null);
        // })
    },

    postData:function(url,params,fn){
        var self = this;
        var xhr = new XMLHttpRequest();  
        xhr.open("post",url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            if (xhr.status == 200 ) {
                var result = JSON.parse(xhr.response)
                if (result.code !== 0) {
                    console.log('数据读取失败');
                    return false;
                }
                fn(result);
            } else {
                
            }
        };
        xhr.onerror = function () {
            console.log('数据读取失败');
        };
        xhr.send(JSON.stringify(params));
    },
    /**
     * downJson
     * <p>下载json文件。</p>
     * @method downJson
     */
    downJson:function(){
          if (!!window.ActiveXObject || "ActiveXObject" in window){//IE浏览器保存文本框内容
            var filename = this.id+".json";
            var type = "text/plain; charset=UTF-8";
 
            var blob = typeof File === 'function'
                ? new File([JSON.stringify(this.data)], filename, { type: type })
                : new Blob([JSON.stringify(this.data)], { type: type });
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var URL = window.URL || window.webkitURL;
                var downloadUrl = URL.createObjectURL(blob);
 
                if (filename) {
                    // use HTML5 a[download] attribute to specify filename
                    var a = document.createElement("a");
                    // safari doesn't support this yet
                    if (typeof a.download === 'undefined') {
                        window.location = downloadUrl;
                    } else {
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                    }
                } else {
                    window.location = downloadUrl;
                }
            }
        }else{
             var urlObject = window.URL || window.webkitURL || window
            var export_blob = new Blob([JSON.stringify(this.data)], { type:'text/plain' } );
            var save_link = document.createElementNS("http://www.w3.org/1999/xhtml","a");
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = this.id+".json";
            this.clickDown(save_link);

        }
       
    },
    clickDown:function(link){
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent(
            "click",true,false,window,0,0,0,0,0,false,false,false,false,0,null
        );
        // ev.initEvent("click", false, false)
        link.dispatchEvent(ev)
    },

    /**
     * downJson
     * <p>选中图层高亮</p>
     * @method Selection
     */
    Selection:function(){
        var tempLayer = this;
        console.log(PIE.defaultColor)
        if(PIE.selectObject){
            if(tempLayer == PIE.selectObject){

            }else{
                PIE.selectObject.setColor(PIE.defaultColor.getStyle());
                PIE. defaultColor = tempLayer.color;
                PIE.selectObject = tempLayer;
                tempLayer.setColor(PIE.selectColor);
            }
            
        }else{
            PIE.defaultColor = tempLayer.color;
            PIE.selectObject = tempLayer;
            tempLayer.setColor(PIE.selectColor);
        }
    },
});
export { Layer };
