<template>
  <div id="city">
    <div class="currentCity">
      当前城市:
      <span>北京市</span>
    </div>
    <hr />
    <div class="search">
      <Input v-model="value" placeholder="请输入城市名" style="width: 200px;height:30px" />
      <Button>搜索</Button>
    </div>
    <hr />
    <ul class="scrollbar" v-if="cityList_box_show">
      <li v-for="(item,index) in allProvince" :key="index" class="cityList_box">
        <div class="province">
          <span @click="skippingTo('province',item)">{{item.name}}</span>
        </div>
        <div class="city">
          <span
            v-for="(children,index) in item.children"
            :key="index"
            @click="skippingTo('city',children)"
          >{{children.name}}</span>
        </div>
      </li>
    </ul>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import { get, post } from "@/api/load";
import PolygonLayer from "@/utils/Layers/PolygonLayer";
export default {
  data() {
    return {
      value: "",
      allProvince: [],
      cityList_box_show: false,
      spinShow: true,
      boundaryVectorLine: "",
      externalRectangle: ""
    };
  },
  beforeCreate() {},
  created() {
    this.getProvinceList();
  },
  beforeMount() {
    // this.getProvinceList();
  },
  mounted() {
    // this.getProvinceList();
    setTimeout(() => {
      this.cityList_box_show = true;
      this.spinShow = false;
    }, 4000);
  },
  methods: {
    getProvinceList() {
      let self = this;
      let url = this.$interfacePath.other.search_province;
      let param = {};
      get(url, param).then(data => {
        if (data.code === 0) {
          self.allProvince = data.data;
          for (let i = 0; i < self.allProvince.length; i++) {
            self.getCityList(self.allProvince[i].code, self.allProvince[i]);
          }
        }
      });
    },
    getCityList(cityCode, father) {
      let self = this;
      let url = this.$interfacePath.other.search_city;
      let param = {
        provinceid: cityCode
      };
      get(url, param).then(data => {
        if (data.code === 0) {
          father.children = data.data;
          for (let i = 0; i < father.children.length; i++) {
            self.getCountyList(father.children[i].code, father.children[i]);
          }
        }
      });
    },
    getCountyList(cityCode, father) {
      let self = this;
      let url = this.$interfacePath.other.search_area;
      let param = {
        cityid: cityCode
      };
      get(url, param).then(data => {
        if (data.code === 0) {
          father.children = data.data;
        }
      });
    },
    skippingTo(level, item) {
      let self = this;
      let url = this.$interfacePath.other.query_area;
      let param = {
        level: level,
        code: item.code
      };

      get(url, param).then(data => {
        if (data.code === 0) {
          self.boundaryVectorLine = data.data.area_data; //边界矢量线
          self.externalRectangle = data.data.box; //外接矩形框
          console.log(self.boundaryVectorLine);
          console.log(self.externalRectangle);
          if (this.polygon) {
            this.map.layerManager.removeLayer(this.polygon);
          }
          let f = {
            features: self.boundaryVectorLine,
            type: "FeatureCollection"
          };
          this.polygon = new PolygonLayer({
            strokeWidth: 3,
            strokeColor: "#f00",
            fillColor: "#f00",
            opacity: 1,
            isFill: false,
            data: f,
            id: "边界矢量线"
          });
          this.map.layerManager.addLayer(this.polygon);
          let box = {
            west: self.externalRectangle.min_x,
            south: self.externalRectangle.min_y,
            east: self.externalRectangle.max_x,
            north: self.externalRectangle.max_y
          };
          self.map.setView(box);
        }
      });
    }
  }
};
</script>

<style>
#city .ivu-spin-fix {
  position: absolute;
  top: 15px;
  left: 6px;
  z-index: 8;
  width: 96%;
  height: 90%;
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
<style scoped>
#city {
  /* position: absolute;
  right: 80px;
  bottom: 0px; */
  width: 280px;
  height: 240px;
  background-color: #fff;
  padding: 10px;
  overflow: hidden;
  border-radius: 4px;
  text-align: left;
  /* font-weight: normal; */
}
#city hr {
  margin: 10px 0;
}
.currentCity {
  height: 20px;
  line-height: 20px;
}

.search {
  height: 45px;
  line-height: 45px;
}
#city .scrollbar {
  /* padding: 5px; */
  margin: 5px;
  height: calc(100% - 110px);
  overflow-y: auto;
}
.cityList_box {
  display: flex;
  color: rgb(10, 113, 247);
}
.province {
  width: 50px;
  padding: 2px;
  white-space: pre-wrap;
}
.province span,
.currentCity span {
  font-weight: bold;
}
.city {
  width: calc(100% - 50px);
  padding: 2px;
  white-space: pre-wrap;
}
.city span {
  padding: 3px;
  white-space: nowrap;
}
.province span:hover,
.city span:hover {
  text-decoration: underline;
  cursor: pointer;
}

.scrollbar::-webkit-scrollbar {
  /*滚动条整体样式*/

  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/

  height: 1px;
}

.scrollbar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/

  border-radius: 10px;

  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);

  background: #707070;
}

.scrollbar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/

  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);

  border-radius: 10px;

  background: #ededed;
}
</style>