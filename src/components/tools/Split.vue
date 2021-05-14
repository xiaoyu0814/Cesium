<template>
  <div class="container" v-show="hidesplit">
    <div class="contSelect">左侧图层</div>
    <div>
      <select class="select" name="" id="select1"  >
        <option v-for="(item,index) in mapList" :key="item.label" >{{item.name}} </option>
      </select>
    </div>
    <div class="contSelect">右侧图层</div>
    <div>
      <select class="select" name="" id="select2"  >
        <option v-for="(item,index) in mapList" :key="item.label" > {{item.name}} </option>
      </select>
    </div>
    <div class="contSelect" @click="hideRoller">x</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hidesplit:true,
      mapList:[
        {
          label:'2012_2m',
          name:"2012_2m",
          id:"tianditu",
          url:  "http://piecloud.piesat.cn/seis/v3/wmts/service/1079/10?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleMapsCompatible&format=image%2Fpng&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG%3A3857&tilematrix={z}&tilerow={y}&tilecol={x}",
          region :[73, 3, 137, 54],
          opacity:1,
        },
        {   
          label:'2016_2m',
          name:"2016_2m",
          id:"xingzhengditu",
          url:    "http://piecloud.piesat.cn/seis/v3/wmts/service/1078/18?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleMapsCompatible&format=image%2Fpng&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG%3A3857&tilematrix={z}&tilerow={y}&tilecol={x}",
          region :[73, 3, 137, 54],
          opacity:1,
        },
      ],
       
    }
  },
  methods:{
    hideBasemap(){
        this.hidebasemap=false
    },
    hideRoller(){
      this.$emit("toolShow", { name: "split", status:false })
      // var view3D = document.getElementById("cesiumContainer");
      var cesiumContainer = document.getElementById("cesiumContainer");
      console.log(cesiumContainer)
			if(cesiumContainer){
			   cesiumContainer.style.display = "none";
			  //this.map.init
      }
    },
    
  }
}
</script>
<style scoped>
  .container{
    width:400px;
    height:34px;
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgb(126, 169, 224);
    border-radius: 5px;
    /* color: #fff */
  }
  .container>.contSelect{
    font-size:15px;
    margin:5px;
    /* margin-left:5px; */
    /* margin-top:5px; */
  }
  .select{
    width:100px;
    height:30px;
    font-size:16px;
    color:black;
    border:1px solid grey;
    border-radius:3px;

  }
  .select>option{
    color:black;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .contSelect{
    color: #fff
  }
</style>
