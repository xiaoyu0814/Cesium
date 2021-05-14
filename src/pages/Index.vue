<template>
  <div class="layout">
    <div id="map"></div>
    <div class="fullSize" id="cesiumContainer">
      <div id="view3D"></div>
      <div id="view2D"></div>
    </div>
    <!-- 引入search组件 -->
    <Search v-on:toolShow="toolShow($event)"></Search>
    <rightNav></rightNav>
    
    <!-- 引入工具中的子组件  陈倩倩 12/19 -->
    <Computed v-show="computed" style="position:absolute;top:10px;right:240px;" v-on:toolShow="toolShow($event)"></Computed>
    <Yanmo style="position:absolute;top:10px;right:240px;" v-show="yanmo" v-on:toolShow="toolShow($event)"></Yanmo>

    <!-- <SquareAnalysis style="position:absolute;top:10px;right:240px;" v-show="square"></SquareAnalysis> -->
    <!-- <Location style="position:absolute;top:10px;right:240px;" v-show="location"></Location> -->

    <Extract style="position:absolute;top:80px;left:40px;" v-show="extract" v-on:toolShow="toolShow($event)"></Extract>
    <rollerShades style="position:absolute;top:10px;right:350px;" v-show="rollerShades" v-on:toolShow="toolShow($event)"></rollerShades>
    <Split style="position:absolute;top:10px;right:270px;" v-show="split" v-on:toolShow="toolShow($event)"></Split>
    <Plane style="position:absolute;top:100px;right:70px;" v-show="plane" v-on:toolShow="toolShow($event)"></Plane>
    <!-- 分类成功之后的分类样式条组件  吴红梅-->
    <!-- <ClassificatSide style="position:absolute;bottom:80px;left:40px;" v-show="classificatSide"></ClassificatSide> -->
    <!-- <Classification style="position:absolute;top:10px;right:0px;" v-show="classification"></Classification> -->
    <!-- 分类成功之后的分类样式条组件的图列按钮 -->
    <!-- <div class="tuglie" @click="tuglieShow">
      <span>图列</span>
      <img :src="tuglietSrc" alt="">
    </div>-->

    <leftNav></leftNav>

    
    <footerNav :coord="coordinate" class="layout2"></footerNav>
  </div>
</template>
<script>
// 陈倩倩 12/19
import Search from "@/components/header/Search";
import Computed from "@/components/tools/Computed";
import Yanmo from "@/components/tools/Yanmo";
import SquareAnalysis from "@/components/tools/SquareAnalysis";
import Location from "@/components/tools/Location";
import Extract from "@/components/tools/Extract"; //12/21
import rollerShades from "@/components/tools/rollerShades"; //12/21
import Split from "@/components/tools/Split"; //12/21
import Plane from '@/components/tools/Plane';//12/24

// 组件引入--xugang
import rightNav from "@/components/rightNav/rightNav";
import footerNav from "@/components/footer/footer";

import leftNav from "@/components/leftNav/index";

// 地物分类
// import Classification from '@/components/tools/Classification'
//地物分类成功之后的样式条组件
// import ClassificatSide from '@/components/tools/ClassificatSide'

export default {
  name: "Index",
  data() {
    return {
      msg: "",
      coordinate: {},
      show: false,

      // 陈倩倩 12/19
      computed: false,//图上量算
      yanmo: false,//淹没推演
      square: false,//方量分析
      location: false,//地理定位
      extract:false,//12/21
      rollerShades:false,//卷帘对比
      split:false,//地物分类
      plane:false,//飞机识别
      // classificatSide:false,
      // classification:false,
      
      tuglietSrc:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1RTI1NTQ2N0ZBQkExMUU5OUY0MUIyRTk3M0RGMzI4RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1RTI1NTQ2OEZBQkExMUU5OUY0MUIyRTk3M0RGMzI4RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVFMjU1NDY1RkFCQTExRTk5RjQxQjJFOTczREYzMjhEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVFMjU1NDY2RkFCQTExRTk5RjQxQjJFOTczREYzMjhEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+N2U1xQAAAbBJREFUeNp0UjtrwlAUPokx8VUVK4QQB7GDQu3SIjgKpdCtP6C/ooujv6DgUjr0t3SvLiJCC0KrSBWb+MZHg0lMvxNKt1645CbnfK+TK5qm+eq6rmfbtr//W9zDvQK/rNfrOzxasViMLMvy+v2+QURRbAeNgUQiYauqehUKheqC4zjebrcrBAKB7nA4pF6vR5lM5gHgk/1+PwZAmUwmdQA+8vn8XAILSZKkAthtt9s0m80kTdN2wWBQy2az1791Zbvd1vgsgplgR1YUhUqlEqHJWSwWVciD3F2iZ4rtyrIc9AGbzeZ9uVy+AETRaJSKxWKqUql48H02Ho/L+C4cDodTOPj21Uaj0W06nX6ChaNwOGwhx9t8Pn8URfEeTX0oVZFlALUwAwSMaghmPRKJfKGQwgDkRqORhYUB283lcr4yapcI/iwmk0l9tVqVMU6t2WymwcRZalAlNBBngz3C1GxYI4lZUDQxHQJwzVlQOMTjcdJ1nZgAqjwYw88Ar4SR3UCphcDHLD+dTgXUCtgqrHjcCOJzJifDMP6uBi8E/ux0OhcgGUHI4x/LNT7z1fgRYACNqil7o89uTwAAAABJRU5ErkJggg=="
    };
  },
  mounted() {
    var _this = this;
    this.initMap("map");
  },
  methods:{
      initMap(id){
        var mapObj = {
          container:id,
        }
        var _this = this;
        this.map.initMap(mapObj);
        
        this.addLayer()
        this.map.getPosition((position)=>{
         // console.log(position);
          _this.coordinate=position;
        })
      },
      addLayer(){
        var ImageUrlLayer = {
          id:"ditu",
          url: 'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',
          region :[-180,-90,180,90],
          opacity:1,
        }
        this.map.addUrlTemplateImageryLayer(ImageUrlLayer)
      },
      //item name 组件名称
      //item status 组件的状态
      toolShow(item) {
        console.log(item);
        this[item.name] = item.status;
        if(item.name == "extract" ){
          if(item.status){
            var ImageUrlLayer = {
              id:"diwu",
              // Access-control-Allow-Origin:www.google.com,
              url: 'https://cloud.piesat.cn/dataservices/service/v1/tile?map=CN16M&x={x}&y={y}&z={z}',
              region :[73, 3, 137, 54],
              opacity:1,
            }
            this.map.addUrlTemplateImageryLayer(ImageUrlLayer)
          }else{
            this.map.removeImageryLayer("diwu")
          }         
        }
        if(item.name == "plane" ){
          if(item.status){
            var ImageUrlLayer = {
              id:"shibie",
              url: 'https://piecloud.piesat.cn:8443/dataservices/service/v1/tile?map=OverseasAirportScene&x={x}&y={y}&z={z}',
              region :[-180,-90,180,90],
              opacity:1,
            }
            this.map.addUrlTemplateImageryLayer(ImageUrlLayer)
          }else{
            this.map.removeImageryLayer("shibie")
          }         
        }
        //机场识别
         if(item.name == "plane" ){
          if(item.status){
            var ImageUrlLayer = {
              id:"shibie",
              url:'https://cloud.piesat.cn/dataservices/service/v1/tile?map=CN16M&x={x}&y={y}&z={z}',
              region :[-180,-90,180,90],
              opacity:1,
            }
            this.map.addUrlTemplateImageryLayer(ImageUrlLayer)
          }else{
            this.map.removeImageryLayer("shibie")
          }         
        }
        //船舰识别
         if(item.name == "plane" ){
          if(item.status){
            var ImageUrlLayer = {
              id:"shibie",
              url:'https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
              region :[-180,-90,180,90],
              opacity:1,
            }
            this.map.addUrlTemplateImageryLayer(ImageUrlLayer)
          }else{
            this.map.removeImageryLayer("shibie")
          }         
        }
      },
    // 图列展示和隐藏
    //   tuglieShow(){
    //   this.classificatSide=!this.classificatSide;

    //   }
  },
  destroyed() {},
  // 组件引入
  components: {
    Search,
    rightNav,
    footerNav,
    // 地物分类
    // Classification,
    //地物分类成功后的样式条组件
    // ClassificatSide,

    // 陈倩倩 12/19
    Computed,
    Yanmo,
    SquareAnalysis,
    Location,
    Extract, //12/21
    rollerShades,
    Split,
    Plane,

    leftNav,
  }
};
</script>
<style>
.layout {
  position: relative;
  width: 100%;
  height: 100%;
  /* background: url("@/../../../static/images/index.jpg")no-repeat left top; */
  background-size: 100%;
  overflow: hidden;
}
.layout1 {
  position: fixed;
  right: 0;
  bottom: 8%;
}
.layout2 {
  width: 100%;
  position: fixed;
  bottom: 0;
}
.layout3 {
  position: fixed;
  top: 8%;
  right: 0;
}
/* 卷帘样式效果 */
#slider {
  position: absolute;
  left: 50%;
  top: 0px;
  background-color: #d3d3d3;
  width: 5px;
  height: 100%;
  z-index: 9999;
}
#slider:hover {
  cursor: ew-resize;
}
/* 分屏样式 */
#cesiumContainer {
  display: flex;
  width: 100%;
  height: 100%;
}
#view3D {
  display: inline-block;
  width: 100%;
  height: 1000px;
}
#view2D {
  display: inline-block;
  width: 100%;
  height: 1000px;
}
.tuglie {
  position: absolute;
  bottom: 50px;
  left: 40px;
  width: 65px;
  height: 30px;
  line-height: 30px;
  padding-left: 5px;
  cursor: pointer;
}
.tuglie span {
  font-size: 14px;
  color: #fff;
}
</style>