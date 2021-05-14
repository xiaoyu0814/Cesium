<template>
    <div class='base' v-show="hidebasemap" v-drag>
        <!-- 底图第一层 -->
        <div calss='firstfloor' id="firstfloor">
            <div>
                <img src="@/assets/basemap1.png" alt="">
                <span>底图</span>
            </div>
            <div class='cancel' @click="hideBasemap">X</div>
        </div>  
        <hr>
        <!-- 底图第二层--中间4*3动态加载地图 -->  
        <div>
            <div class="text">
                <p>在线影像</p>
            </div >  
            <div class="secondfloor" id="secondfloor" >           
                <div v-for="(item,i) in baseMaps" @click="addImageUrl(item)" :key="i" ><img :src="item.imgUrl" alt=""><p>{{item.name}}</p></div>           
            </div>
        </div> 

        <!-- 底图第三层 -->
        <div>
            <div class="text">
                <p>PIE-CLOUDS卫星遥感</p>
            </div >  
            <div class="secondfloor" id="secondfloor" >           
                <div v-for="item in baseCloudsMaps" @click="addImageUrl(item)" :key="item"><img :src="item.imgUrl" alt=""><p>{{item.name}}</p></div>           
            </div>
             <div class="text">
                <p>PIE-CLOUDS气象相关</p>
            </div >  
            <div class="secondfloor" id="secondfloor" >           
                <div v-for="item in baseCloudsMaps" @click="addImageUrl(item)" :key="item"><img :src="item.imgUrl" alt=""><p>{{item.name}}</p></div>           
            </div>
             <div class="text">
                <p>PIE-CLOUDS减灾支持</p>
            </div >  
            <div class="secondfloor" id="secondfloor" >           
                <div v-for="item in baseCloudsMaps" @click="addImageUrl(item)" :key="item"><img :src="item.imgUrl" alt=""><p>{{item.name}}</p></div>           
            </div>
             <div class="text">
                <p>PIE-CLOUDS AI相关</p>
            </div >  
            <div class="secondfloor" id="secondfloor" >           
                <div v-for="item in baseCloudsMaps" @click="addImageUrl(item)" :key="item"><img :src="item.imgUrl" alt=""><p>{{item.name}}</p></div>           
            </div>
        </div> 
        <!-- 底图第四层 -->
        <div class="thirdfloor">
            <Checkbox v-model="single" @on-change = "terrainShow">显示地形</Checkbox>
        </div> 
    </div>
</template>
<script>
import $ from 'jquery' 
export default {  
    name:'BaseMap',
    data(){
        return {
            hidebasemap:false,
            single:false,
            baseMaps:[
                {
                    name:"谷歌影像",
                    type:1,
                    imgUrl:"static/yingxiang.jpg",
                    url:"http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}",
                },
                {
                    name:"天地图影像",
                    type:1,
                    imgUrl:"static/yingxiang.jpg",
                    url:"https://t3.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=01648a46241de4244d518d8e151b3528",
                },
                {
                    name:"行政地图",
                    type:1,
                    imgUrl:"static/xingzheng.jpg",
                    url:"https://t1.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=01648a46241de4244d518d8e151b3528",
                },
                {
                    name:"地形地图",
                    type:1,
                    imgUrl:"static/dixing.jpg",
                    url:"https://t4.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=01648a46241de4244d518d8e151b3528",
                }
            ],
            baseCloudsMaps:[
                {
                    name:"谷歌影像",
                    type:1,
                    imgUrl:"static/yingxiang.jpg",
                    url:"http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}",
                },
                {
                    name:"天地图影像",
                    type:1,
                    imgUrl:"static/yingxiang.jpg",
                    url:"https://t3.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=01648a46241de4244d518d8e151b3528",
                },
                {
                    name:"行政地图",
                    type:1,
                    imgUrl:"static/xingzheng.jpg",
                    url:"https://t1.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=01648a46241de4244d518d8e151b3528",
                },
                {
                    name:"地形地图",
                    type:1,
                    imgUrl:"static/dixing.jpg",
                    url:"https://t4.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=01648a46241de4244d518d8e151b3528",
                }
            ]
        }
    },
    methods:{
        hideBasemap(){
            this.hidebasemap=!this.hidebasemap
        },
        terrainShow(item){
            if(this.single){
                this.map.addTerrain()
            }else{
                this.map.removeTerrain();
            }
        },
        addImageUrl(item){
            console.log(item);
            var ImageUrlLayer = {
                id:"ditu",
                url: item.url,
                region :[-180,-90,180,90],
                opacity:1,
            }
            this.map.setUrlTemplateImageryLayer(ImageUrlLayer)
        },
       
    },
    // 整个组件可以拖拽
    directives:{
        drag(el){
            el.onmousedown = function(e){
                var disx = e.clientX - el.offsetLeft;
                var disy = e.clientY - el.offsetTop;
                document.onmousemove = function (e){
                    el.style.left = e.clientX - disx+'px';
                    el.style.top = e.clientY - disy+'px';
                }
                document.onmouseup = function(){
                    document.onmousemove = document.onmouseup = null;
                }
            }
        },
    }
}
</script>
<style scoped>
    /* 基层 */
    .base{
        width:300px; 
        height:650px;
        border:1px solid rgb(126, 169, 224);
        border-radius:5px;
        position: fixed;
        right: 65px;
        top: 50px;
        background-color:gray; 
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        top: 50px
    }
    /* 一楼样式 */
    #firstfloor{
        display:flex;
        justify-content:space-between;
        margin: 8px ;
        font-size:15px;
        vertical-align:middle;
        cursor: pointer;
    }
    .firstfloor>div{
        width:100px;
        vertical-align: middle
    }
    .text{
        font-size: 14px;
        margin-left: 8px;
        margin-top: 5PX;
       
    }
    .firstfloor>div>img{
        width:15px;
        height:15px;
    }
    #firstfloor>div>img{
        vertical-align: middle;
    }
    /* 文字“底图” */
    #firstfloor>div>span{
        padding-bottom:15px;
        color:white;
    }
    .cancel{
        color:white
    }
    /* 二楼样式 */
    #secondfloor{
        margin-top:10px;
        display:flex;
        justify-content:space-evenly;
        flex-flow:wrap;        
         border-bottom: 1px solid  rgb(126, 169, 224);
         padding-bottom: 5px;
    }
    .secondfloor>div{
        width:70px;
        color:white;
    }
    .secondfloor>div:hover{
        color: rgb(126, 169, 224)
         
    }
    .secondfloor>div>img{
        border:1px solid white;
    }
    .secondfloor>div>img:hover{
        border:1px solid  rgb(126, 169, 224)
        
    }
    /* 三楼样式 */
    .thirdfloor{
        margin-top:10px;
        margin-left: 8px;
        color:white;
    }
    
</style>
