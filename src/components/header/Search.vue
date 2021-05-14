<template>
  <div class="ddd">
    <!--左边的搜索框  -->
    <Input class="search" search enter-button placeholder="搜索地点" />
    <!-- 右边导航栏 -->
    <Breadcrumb class="right">
      <div>
        <div class="aaa">
          <div calss="firstfloor" id="firstfloor" @click="handel">
            <p>
              <img class="middle" src="@/assets/basemap1.png" alt /> 底图
            </p>
          </div>

          <div calss="firstfloor" id="firstfloor" @click="showPanel">
            <p>
              <img class="middle" src="@/assets/basemap1.png" alt /> 图层
            </p>
          </div>

          <div calss="firstfloor" id="firstfloor" @click="showData">
            <p>
              <img class="middle" src="@/assets/basemap1.png" alt /> 数据源
            </p>
          </div>

          <div calss="firstfloor" id="firstfloor" @click=" handel2">
            <p>
              <img class="middle" src="@/assets/basemap1.png" alt /> 工具
            </p>
          </div>
        </div>
      </div>
    </Breadcrumb>
    <!--引入底图的子组件  -->
    <BaseMap v-show="basemap"></BaseMap>
    <!-- 引入图层的子组件 -->
    <Tree v-show="tree" class="three"></Tree>
    <!-- 引入数据源的子组件-->
    <dataSource v-show="datasource" class="Sdata"></dataSource>
    <!-- 引入工具的子组件 -->
    <Tools v-show="tools " class="Ctools" v-on:ceshi="ceshi($event)"></Tools>
  </div>
</template>
<script>
import Tree from "@/components/topNav/Tree";
import BaseMap from "@/components/topNav/BaseMap";
import Tools from "@/components/topNav/Tools";
import dataSource from "@/components/topNav/dataSource";
export default {
  name: "Search",
  data() {
    return {
      basemap: false,
      tree: false,
      tools: false,
      datasource: false
    };
  },
  methods: {
    handel() {
      if (this.basemap) {
        this.closeAll();
      } else {
        this.closeAll();
        this.basemap = !this.basemap;
      }
    },
    ceshi(item) {
      //item{name status}
      this.tools = false;
      this.$emit("toolShow", item);
      // console.log(item)
    },

    showPanel() {
      if (this.tree) {
        this.closeAll();
      } else {
        this.closeAll();
        this.tree = !this.tree;
      }
    },
    handel2() {
      if (this.tools) {
        this.closeAll();
      } else {
        this.closeAll();
        this.tools = !this.tools;
      }
    },
    closeAll() {
      this.basemap = false;
      this.tree = false;
      this.tools = false;
      this.datasource = false;
    },
    showData() {
      if (this.datasource) {
        this.closeAll();
      } else {
        this.closeAll();
        this.datasource = !this.datasource;
      }
    }
  },
  //组件引入
  components: {
    Tree,
    BaseMap,
    Tools,
    dataSource
  }
};
</script>
<style scoped>
.ddd {
  display: flex;
  justify-content: space-between;
  /* background-color: rgba(0, 0, 0, 1); */
  position: relative;
}
.search {
  display: none; /*暂时隐藏*/
  width: 260px;
  margin-top: 5px;
  height: 30px;
}
.right {
  /* background-color:black; */
  /* background-color:rgba(0, 0, 0, 0.7); */
  /* display: flex; */
  margin-top: 5px;
  margin-right: 15px;
  padding-top: 5px;
  color: #fff;
  font-size: 16px;
  border-radius: 3px;
  z-index: 1000;
  position: fixed;
  top: 0;
  right: 5px;
}
.right > div {
  display: inline-block;
}
.three,
.Ctools,
.Sdata {
  position: fixed;
  right: 70px;
  top: 50px;
}
.layers,
.base,
.Atools,
.source {
  display: inline;
}
.layout3 {
  position: fixed;
  top: 8%;
  right: 0;
}
.aaa {
  display: flex;
  cursor: pointer;
  background-color: gray;
  background-color: rgba(0, 0, 0, 0.5);
  height: 30px;
  border-radius: 4px;
}
p {
  display: flex;
  display: inline;
  padding: 8px;
}
img.middle {
  vertical-align: middle;
  width: 25px;
}
</style>