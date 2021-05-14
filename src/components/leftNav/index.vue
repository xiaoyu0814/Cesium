<template>
  <div id="leftNav">
    <div class="left_box">
      <!-- logo start-->
      <img src="static/img/logo.png" alt="logo" srcset class="logo" />
      <!-- 导航列表 start -->
      <ul>
        <li
          v-for="(item,index) in list"
          :key="index"
          class="list"
          :class="activeClass===item.value?'select':''"
          @click="Selection(item.value)"
        >
          <img :src="item.img" :alt="item.name" srcset />
          <span style="margin-top:5px">{{item.name}}</span>
        </li>
      </ul>
      <div class="userBtn">
        <img src="static/img/user.png" style="width:40px" @click="goToLogin" alt />
        <p>用户登录</p>
      </div>
      <!-- 头像 start -->
      <!-- <img src="" alt="" srcset=""> -->
    </div>
    <transition name="fade" mode="out-in">
      <mapManage v-if="leftBoxManage.mapManage"></mapManage>
      <tools v-if="leftBoxManage.tools"></tools>
      <identification v-if="leftBoxManage.identification"></identification>
      <layer v-if="leftBoxManage.layer" />
      <dataSetList :name="dataList" v-if="leftBoxManage.dataSetList"></dataSetList>
    </transition>
  </div>
</template>
<script>
import tools from "./tools";
import identification from "./identification";
import layer from "../layer/HomePage.vue";
import dataSetList from "../dataset/dataSetList.vue";
import mapManage from "@/components/map/mapManage.vue";
import { post, get } from "@/api/load";
export default {
  components: {
    tools,
    identification,
    layer,
    dataSetList,
    mapManage
  },
  data() {
    return {
      activeClass: "",
      userid: "",
      data_id: "",
      name: "",
      dataList: [],
      leftBoxManage: {
        mapManage: false,
        tools: false,
        layer: false,
        dataSetList: false
      },
      list: [
        {
          img: "static/img/dataset.png",
          name: "数据",
          value: "dataSetList"
        },
        {
          img: "static/img/map.png",
          name: "地图",
          value: "mapManage"
        },
        {
          img: "static/img/layer.png",
          name: "图层",
          value: "layer"
        },
        {
          img: "static/img/tools.png",
          name: "工具",
          value: "tools"
        },
        {
          img: "static/img/identification.png",
          name: "地物识别",
          value: "identification"
        }
      ]
    };
  },
  mounted() {
    $(".left_box").niceScroll({
            cursorcolor: "#424242", // 改变滚动条颜色，使用16进制颜色值
            cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
            cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
            cursorwidth: "7px", // 滚动条的宽度，单位：便素
            cursorborder: "1px solid #006DE4", // CSS方式定义滚动条边框
            cursorborderradius: "5px", // 滚动条圆角（像素）
            scrollspeed: 60, // 滚动速度
            mousescrollstep: 40, // 鼠标滚轮的滚动速度 (像素)
            touchbehavior: false, // 激活拖拽滚动
            hwacceleration: true, // 激活硬件加速
            boxzoom: false, // 激活放大box的内容
            dblclickzoom: true, // (仅当 boxzoom=true时有效)双击box时放大
            gesturezoom: true, // (仅 boxzoom=true 和触屏设备时有效) 激活变焦当out/in（两个手指外张或收缩）
            grabcursorenabled: true, // (仅当 touchbehavior=true) 显示“抓住”图标display "grab" icon
            autohidemode: true, // 隐藏滚动条的方式, 可用的值:
        });
  },
  methods: {
    Selection(value) {
      this.activeClass = value;
      this.leftBoxManage = {
        tools: false,
        layer: false,
        mapManage: false,
        dataset: false,
        [value]: !this.leftBoxManage[value]
      };
      console.log(value);
      let url =
        "http://piecloud.piesat.cn/api/v1/spatiotemporal/datasets/findDatasetListByUserId";
      let param = {
        userId: this.userid
      };
      let _this = this;
      _this.dataList = [];
      let userid = window.localStorage.getItem("userId");
      console.log("userID" + userid);
    },
    goToLogin(){
      console.log(111)
      this.$router.replace('/login')
    }
  }
};
</script>

<style scoped>
#leftNav {
}
.left_box {
  height: 100%;
  position: absolute;
  top: 0;
  background: #00000099;
  color: #fff;
  text-align: center;
  overflow-y: auto;
  overflow-x: hidden;
}
.logo {
  width: 60px;
  margin: 10px;
}
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}
.list:hover {
  background-color: #ffffff99;
}
.list img {
  width: 40px;
}
.select {
  background-color: #ffffff99;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.userBtn{
  position: absolute;
  left:12px;
  top:800px
}
</style>
