<template>
  <div class="fa" v-drag v-show="hidedata">
    <div class="child0">
      <div class="top">
        <div class="text">
          <Icon type="md-calculator" />
          <span>数据源</span>
        </div>
        <div class="close" @click="hideData">X</div>
      </div>
      <div class="child1">
        <input type="text" @focus="showtab" @blur="showtab" />
        <button>搜索</button>
      </div>
      <div v-show="showitem" class="child2">
        <ul>
          <li v-for="item in datasources" :key="item.name" @click="addLayer(item)">{{item.name}}</li>
        </ul>
      </div>
      <!-- <div v-for="item in datasources" :key="item" @click="addLayer(item)">{{item.name}}</div> -->
    </div>
  </div>
</template>
<script>
import { get, post } from "@/api/load";
export default {
  data() {
    return {
      // 设置div显隐
      // 演示展示暂改为true
      showitem: true,
      hidedata:true,
      datasources: [
        {
          name: "鹤峰县地形",
          url: "",
          type: 2,
          id: "hefengxianTerrain"
        },
        {
          name: "鹤峰县建筑物",
          url: "",
          type: 3,
          id: "hefengxianTerrain"
        },
        {
          name: "鹤峰县等高线",
          url: "",
          type: 4,
          id: "hefengxianTerrain"
        }
        // {
        //     name : "金沙江灾前影像",
        //     url:"http://piecloud.piesat.cn:9000/dataservices/map-editor/tiles/node1_test/tif_7e0f402c89d846e8abfbe57f03c5b5c6/{z}/{x}/{y}?tms=false",
        //     type:1,
        //     id:"jinshajiang"
        // },
      ]
    };
  },
  methods: {
    showtab() {
      if (!this.showitem) {
        this.showitem = true;
      } else {
        this.showitem = false;
      }
    },
    addLayer(item) {
      console.log(item);
      if (item.type == 2) {
        this.map.addDataSourceLayerT();
      } else if (item.type == 3) {
        this.map.addDataSourceLayerH();
      } else if (item.type == 4) {
        this.map.addDataSourceLayerL();
      } else if (item.type == 1) {
        var ImageUrlLayer = {
          id: item.id,
          url: item.url,
          region: [-180, -90, 180, 90],
          opacity: 1
        };
        this.map.addUrlTemplateImageryLayer(ImageUrlLayer);
      }
    },
    hideData(){
        this.hidedata=!this.hidedata;
    }
  },
  //鼠标拖拽
  directives: {
    drag(el) {
      el.onmousedown = function(e) {
        var disx = e.clientX - el.offsetLeft;
        var disy = e.clientY - el.offsetTop;
        document.onmousemove = function(e) {
          el.style.left = e.clientX - disx + "px";
          el.style.top = e.clientY - disy + "px";
        };
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null;
        };
      };
    }
  },
  mounted() {
    // this.addSource()
  }
};
</script>
<style scoped>
.fa {
  width: 300px;
  height: 300px;
  border: 1px solid rgb(126, 169, 224);
  border-radius: 5px;
  background-color: gray;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
}
/* 顶部导航条的样式 */
.top {
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
}
.text {
  margin-left: 10px;
  border: none;
  color: #fff;
  font-size: 18px;
  padding-top: 5px;
}
/* 叉号样式 */
.close {
  display: inline;
  color: #fff;
}
.child0 {
  /* margin: 6px; */
}
/* 第一层input+search */
.child1 > input {
  width: 240px;
  height: 25px;
  margin: 0px 6px;
}
.child1 > button {
  width: 40px;
  border: 0;
  background-color: rgb(126, 169, 224);
  color: white;
  height: 25px;
}
/* 第二层下拉选框 */
.child2 {    
  width: 240px;
  border: 1px solid rgb(126, 169, 224);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin:0px  6px;
}
.child2 > ul > li {
  font-size: 16px;
  border-bottom: 1px solid rgb(126, 169, 224);
  list-style: none;
  /* color:white; */
}
.child2 > ul > li:hover {
  color: rgb(126, 169, 224);
}
.child2 > ul > li:last-child {
  border-bottom: 0;
}
/*  */
</style>
