<template>
  <div class="container layerManageWrapper">
    <div class="first">
      <div>
        <p style="font-size: 25px;">我的数据集</p>
      </div>
      <div>
        <span>
          <!-- <img
            @click="showComponents('createLayer')"
            style="width:20px;height:20px;opacity:1"
            src="../../assets/icons/setup.png"
            alt
          />-->
        </span>
        <span @click="triggleMaskShow('createDataSet')">
          <img
            style="width:20px;height:20px;margin-right:10px;"
            src="../../assets/icons/folder.png"
            alt
          />
        </span>
      </div>
    </div>
    <div class="second">
      <Input search placeholder="请输入图层名称" style="width:260px" />
    </div>
    <div class="third">
      <div class="list" v-for="(item,index) in res" :key="index">
        <div class="list-item">
          <div class="images">
            <img
              v-if="item.type == 'point'"
              class="type"
              src="../../assets/icons/point.png"
              alt="点"
            />
            <img v-if="item.type == 'line'" class="type" src="../../assets/icons/line.png" alt="线" />
            <img
              v-if="item.type == 'polygon'"
              class="type"
              src="../../assets/icons/area.png"
              alt="面"
            />
            <img
              v-if="item.type == 'raster'"
              class="type"
              src="../../assets/icons/ras.png"
              alt="ras"
            />
          </div>
          <div class="name" :title="item.name">{{item.name}}</div>
          <div class="btns" style="display:flex;justify-content:felx-end">
            <i-button type="text" size="small" @click="handleAddToMap(item)">一键添加</i-button>
            <i-button type="text" size="small" @click="dataSet(item)">字段</i-button>
            <i-button type="text" size="small" @click="dataContent(item)">内容</i-button>
          </div>
          <div class="righImg">
            <Poptip content="content" placement="right" class="Poptip" trigger="hover">
              <Button class="more" style="color:#000;">
                <img
                  style="width:20px;height:20px;margin-right:10px"
                  src="../../assets/icons/more.png"
                  alt
                />
              </Button>
              <div
                class="tips-item"
                slot="content"
                v-for="(more_item,index) in more_list"
                :key="index"
                @click.stop.prevent="triggleMaskShow(more_item.value,item)"
              >
                <div>{{more_item.name}}</div>
              </div>
            </Poptip>
          </div>
        </div>
      </div>
    </div>
    <div></div>
    <div class="mask" v-if="maskFlag"></div>
    <!-- 数据集属性 -->
    <div
      class="proper popper"
      v-show="maskManage.showProper"
      @handleModalClose="triggleMaskShow('showProper')"
    >
      <div class="propertyTitle">
        数据集的属性
        <span class="close"  @click="closeProperty">X</span>
      </div>
      <div class="propertyContent">
        <Table border :columns="columns1" :data="data1"></Table>
      </div>
    </div>
    <!-- 数据集字段 -->
    <dataset
      class="popper"
      ref="dataSet"
      style="position:absolute;left:520px;top:100px;"
      :id="itemId"
      v-if="maskManage.dataset"
      @handleModalClose="triggleMaskShow('dataset')"
    ></dataset>
    <!-- 数据集内容 -->
    <DataSetContent
      class="popper"
      ref="dataContent"
      style="position:absolute;left:520px;top:100px;"
      v-if="maskManage.datacontent"
      :contentId="itemId"
      @handleModalClose="triggleMaskShow('datacontent')"
    ></DataSetContent>
    <!-- SQL语句 -->
    <SqlQuery
      class="popper"
      style="position:absolute;left:720px;top:100px;"
      v-if="maskManage.sqlcontent"
      @handleModalClose="triggleMaskShow('sqlcontent')"
    ></SqlQuery>
    <!-- 新建数据集 -->
    <createDataSet
      v-if="maskManage.createDataSet"
      :showModal="maskManage.createDataSet"
      modalName="createDataSet"
      @handleModalClose="triggleMaskShow"
      @handleCreateSuccess="getDataSetList"
    />
    <!-- 重命名 -->
    <Rename
      :result="result"
      v-if="maskManage.rename"
      :showModal="maskManage.rename"
      modalName="rename"
      @handleModalClose="triggleMaskShow('rename')"
      @handleRenameSuccess="getDataSetList"
    />
  </div>
</template>
<script>
import { createLayer } from "@/api/layer.js";
import { mapGetters, mapActions } from "vuex";
import { post, get } from "@/api/load";
import dataset from "../dataset/DataSet.vue";
import DataSetContent from "../dataset/DataSetContent.vue";
import Rename from "../dataset/Rename.vue";
import SqlQuery from "../layer/dataSet/SqlQuery.vue";
import { getDataSetList } from "@/api/dataset.js";
import createDataSet from "@/components/layer/dataSet/AddDataSet.vue";
export default {
  props: ["name"],
  data() {
    return {
      maskManage: {
        // 公共的弹框管理对象
        dataset: false,
        datacontent: false,
        showProper: false,
        adddataset: false,
        sqlcontent: false,
        createDataSet: false,
        deleteDataset: false,
        rename: false
      },
      selectDataId: "",
      res: [],
      itemId: "",
      crs: "",
      columns1: [],
      data1: [],
      columns1: [
        { width: "76px", title: "srid", key: "srid" },
        { width: "80px", title: "name", key: "name" },
        { width: "80px", title: "crsid", key: "crsid" },
        { width: "80px", title: "min_x", key: "min_x" },
        { width: "80px", title: "min_y", key: "min_y" },
        { width: "80px", title: "max_x", key: "max_x" },
        { width: "80px", title: "max_y", key: "max_y" }
      ],
      more_list: [
        {
          name: "属性",
          value: "showProper"
        },
        {
          name: "SQL语句",
          value: "sqlcontent"
        },
        {
          name: "重命名",
          value: "rename"
        },
        {
          name: "移除",
          value: "deleteDataset"
        }
      ],
      result: "",
      propertyId: ""
    };
  },
  computed: {
    ...mapGetters(["currentMapId"]),
    maskFlag() {
      return (
        this.maskManage.dataset ||
        this.maskManage.datacontent ||
        this.maskManage.showProper ||
        this.maskManage.adddataset ||
        this.maskManage.sqlcontent ||
        this.maskManage.rename
      );
    }
  },
  created() {
    this.res = this.name;
    console.log(this.res);
  },
  mounted() {
    this.getDataSetList();
    $(".third").niceScroll({
            cursorcolor: "#424242", // 改变滚动条颜色，使用16进制颜色值
            cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
            cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
            cursorwidth: "10px", // 滚动条的宽度，单位：便素
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
    // 获取数据集属性
    getProperty(propertyId) {
      let param = {
        datasetId: propertyId
      };
      // let url =
      // "http://piecloud.piesat.cn/api/v1/spatiotemporal/datasets/findDatasetInfoById";
      let url = this.$interfacePath.dataSet.findDatasetInfoById;
      console.log(param);
      let _this = this;
      _this = this;
      get(url, param).then(data => {
        if (data.code == 0) {
          console.log(111);
          let crs = data.data.crs;
          let box = data.data.bbox;
          let temp = {
            ...crs,
            ...box
          };
          _this.data1 = [temp];
          console.log(data.data.crs);
        } else {
          console.log(data.message);
        }
      });
      console.log(param);
      console.log(propertyId);
    },
    triggleMaskShow(name, item) {
      console.log(name);
      this.maskManage = {
        dataset: false,
        datacontent: false,
        showProper: false,
        adddataset: false,
        sqlcontent: false,
        deleteDataset: false,
        rename: false,
        [name]: !this.maskManage[name]
      };
      if (!item) return;
      console.log(this.maskManage);
      let propertyId = item.data_id;
      console.log(propertyId);
      this.result = item;
      console.log(this.resultName);
      if ((this.maskManage.name = this.maskManage.showProper)) {
        this.getProperty(propertyId);
      }
      if ((this.maskManage.name = this.maskManage.deleteDataset)) {
        this.deleteAllDataset(propertyId);
      }
    },
    // SQL语句的页面关闭
    sqlShow() {
      this.sqlcontent = !this.sqlcontent;
    },
    // 属性关闭页面
    closeProperty() {
      this.maskManage.showProper = false;
    },
    //获取数据集列表
    getDataSetList() {
      let param = {
        userId: window.localStorage.getItem("userId")
      };
      let _this = this;
      getDataSetList(param).then(res => {
        if (res.code == 0) {
          console.log(res.data);
          _this.res = res.data.data;
        } else {
        }
      });
    },
    // 字段
    dataSet(item) {
      this.itemId = item.data_id;
      this.selectDataId = this.itemId;
      this.id = item.data_id;
      this.triggleMaskShow("dataset");
      // this.changeSetData()
    },
    changeSetData(){
       this.addSetData = !this.addSetData
    },
    // 内容
    dataContent(item) {
      this.itemId = item.data_id;
      this.selectDataId = item.data_id;
      this.id = item.data_id;
      this.triggleMaskShow("datacontent");
    },
    // 将数据集添加到地图
    handleAddToMap(item) {
      if (!this.currentMapId) {
        this.$Message.error("请先选择地图!");
        return;
      }
      const layer = {
        name: new Date().getTime(),
        dataset_id: item.id,
        data_id: item.data_id,
        type: item.type,
        show: true,
        data_type: item.type == "raster" ? "Imagery" : "GeoJson"
      };
      createLayer({
        ...layer,
        map_id: this.currentMapId,
        user_id: Number(window.localStorage.getItem("userId"))
      })
        .then(res => {
          if (res.code == 0) {
            this.$Message.success("创建成功!");
            this.$store.dispatch("addLayer", {
              ...layer,
              id: res.data.layerId,
              data_id: item.data_id
            });
          } else {
            this.$Message.error("创建失败!");
          }
        })
        .catch(err => {
          this.$Message.error("创建失败!");
        });
    },
    //删除数据集
    deleteAllDataset(propertyId) {
      let url = this.$interfacePath.dataSet.deleteDatasetById;
      let param = {
        datasetId: propertyId,
        userId: window.localStorage.getItem("userId")
      };
      get(url, param).then(data => {
        if (data.code == 0) {
          this.$Message.success("移除成功");
          this.getDataSetList();
        } else {
          this.$Message.error("移除失败");
          this.$Message.info(data.message);
        }
      });
    }
  },
  components: {
    dataset,
    DataSetContent,
    SqlQuery,
    createDataSet,
    Rename
  }
};
</script>
<style lang="less" scoped>
/* 整体样式 */
.container {
  width: 370px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 80px;
  font-size: 15px;
  background-color: #00000099;
  border: 1px solid black;
  padding-left: 20px;
  color: #fff;
}
/* 第一层样式 */
.first {
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 5px;
  display: flex;
}
/* 第二层样式 */
.second {
  margin-bottom: 5px;
}
.second > button {
  width: 130px;
  height: 27px;
}
.third {
  // margin-top: 30px;
  //margin-left: 20px;
  padding: 10px;
  height: calc(100% - 90px);
  // position:relative;
}
.list {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.list-item {
  display: flex;
  // justify-content: flex-end
  .name {
    margin-left: 13px;
    max-width: 100px;
    width:100px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }
}
.images {
  margin-right: 10px;
}
.images > img {
  width: 20px;
  height: 20px;
   margin-left: -10px;
  // position: absolute;
  // left: 10px;
}
.righImg {
  // position: absolute;
  // right: 10px;
}
button {
  margin: 0px;
  border: 1px solid;
  margin-left: 5px;
  color: #fff;
}
.btns {
  // position: absolute;
  // right: 50px;
}
.more {
  font-size: 20px;
  padding: 0;
  height: 0;
  border: none;
  vertical-align: baseline;
}
.tips-item {
  color: #000;
  padding: 5px;
  cursor: pointer;
}
// 属性的样式
.proper {
  position: absolute;
  top: 100px;
  left: 500px;
  width: 600px;
  height: 300px;
  background-color: #e2e3e5;
  color: #000;
  border-radius:5px;
  // display: flex;
}
.propertyTitle {
  display: flex;

  // border-bottom: 1px solid #000;
  // padding: 10px;
  
  justify-content: space-between;
  margin-left: 250px;
  margin-top: 10px;
}
.propertyContent {
  margin: 10px;
}
.propertyContent div {
  margin: 10px;
}
.mask {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
.popper {
  z-index: 11;
}

.close{
  background-color: #EE2C2C;
   color: #fff; 
  width: 20px;
  height: 20px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  /* margin-top: 5px; */
  margin-right: 10px;
  border-radius: 5px
}
</style>
