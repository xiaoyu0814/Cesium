<template>
  <div class="container layerManageWrapper">
    <div v-if="currentMapId">
      <div class="first">
        <div>
          <p>{{mapName || '地图名字'}}</p>
        </div>
        <div>
          <span>
            <img
              @click="showComponents('createLayer')"
              style="width:20px;height:20px;opacity:1"
              src="../../assets/icons/folder.png"
              alt
            />
          </span>
          <span>
            <img
              style="width:20px;height:20px;margin-right:10px;"
              src="../../assets/icons/notice.png"
              alt
            />
          </span>
        </div>
      </div>
      <div class="second">
        <Input v-model="layerSearchName" search placeholder="请输入图层名称" style="width:260px" />
      </div>
      <div class="third">
        <!-- table -->
        <div class="layer_list" v-if="filterLayerList.length">
          <div class="layer_list_item" v-for="(item, index) in filterLayerList" :key="index">
            <img
              class="is_show"
              @click="changeEyes(item)"
              v-if="item.show"
              src="../../assets/icons/show.png"
              alt
            />
            <img
              class="is_show"
              @click="changeEyes(item)"
              v-else
              src="../../assets/icons/hide.png"
              alt
            />
            <!-- 图层类型 -->
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
            <img
              v-if="item.type == 'text'"
              class="type"
              src="../../assets/icons/text.png"
              alt="ras"
            />
            <!-- 图层类型end -->

            <div class="name">{{item.name || '--'}}</div>
            <div class="ops">
              <img
                class="ops_item button"
                @click="showComponents('edit', item);tools_show=!tools_show"
                src="../../assets/icons/edit.png"
                :style="{visibility: item.type == 'raster' || item.type == 'text' ? 'hidden' : 'visible'}"
                alt
              />
              <img
                :style="{visibility: item.type == 'raster' || item.type == 'text' ? 'hidden' : 'visible'}"
                class="ops_item button"
                @click="showComponents('style', item)"
                src="../../assets/icons/style.png"
                alt
              />
              <Poptip trigger="hover" class="layer-ops-poptip" title placement="right">
                <div
                  style="text-align: center;padding: 4px 0;font-size: 14px;cursor: pointer;"
                  v-for="(chiItem,index) in rightList"
                  :key="index"
                  slot="content"
                >
                  <!-- 没有子菜单的项目 -->
                  <div
                    v-if="!chiItem.children"
                    class="tips-item"
                    @click="showComponents(chiItem.type, item)"
                  >
                    <div>{{chiItem.name}}</div>
                  </div>
                  <!-- 有子菜单的项目 -->
                  <Poptip
                    trigger="hover"
                    v-if="chiItem.children"
                    class="layer-ops-poptip"
                    title
                    placement="right-start"
                  >
                    <div slot="content">
                      <template v-for="(innerItem,index) in chiItem.children">
                        <!-- 非点图层无提示专题图 -->
                        <div
                          v-if="!(innerItem.type == 'toootipSetting' && item.type != 'point')"
                          :key="index"
                          class="tips-item"
                          @click="handleInnerPopClick(innerItem.type, item)"
                        >
                          <div>{{innerItem.name}}</div>
                        </div>
                      </template>
                    </div>
                    <!-- 内层pop挂载dom -->
                    <div>{{chiItem.name}}</div>
                  </Poptip>
                </div>
                <!-- 外层pop挂载dom -->
                <img class="button ops_item" src="../../assets/icons/more.png" alt />
              </Poptip>
            </div>
          </div>
        </div>
        <div v-else class="no_data_tips">暂无图层信息</div>
      </div>
      <!-- 数据集弹窗 -->
      <!-- <dataSet
                v-if="modalManage.dataSet"
                :showModal="modalManage.dataSet"
                modalName="dataSet"
                @handleModalClose="showComponents('dataSet')"
      />-->
      <!-- 样式集弹窗 -->
      <editStyle
        v-if="modalManage.style"
        :outType="currentLayer.type"
        :currentLayer="currentLayer"
        :showModal="modalManage.style"
        modalName="style"
        @handleModalClose="showComponents('style')"
      />
      <!-- 更新属性弹窗 -->
      <updateProperty
        v-if="modalManage.property"
        :showModal="modalManage.property"
        :currentLayer="currentLayer"
        modalName="property"
        @handleModalClose="showComponents('property')"
      />
      <!-- 创建图层弹窗 -->
      <createLayer
        v-if="modalManage.createLayer"
        :showModal="modalManage.createLayer"
        modalName="createLayer"
        @handleModalClose="showComponents('createLayer')"
        @handleCreateOk="handleCreateOk"
      />
      <CloudLayer style="position:absolute;top:80px;left:300px;" v-show="modalManage.importLayer"></CloudLayer>
      <!-- 重命名弹窗 -->
      <Rename
        v-on:refresh="refreshLayer"
        :currentLayer="currentLayer"
        v-if="modalManage.rename"
        :showModal="modalManage.rename"
        modalName="rename"
        @handleModalClose="showComponents('rename')"
      />
      <!-- 删除弹窗 -->
      <Delete
        :id="currentLayer.id"
        v-if="modalManage.delete"
        :showModal="modalManage.delete"
        modalName="delete"
        @handleModalClose="showComponents('delete')"
      />
      <!-- 专题图-提示信息弹窗 -->
      <tooptipSetting
        v-if="modalManage.toootipSetting"
        :showModal="modalManage.toootipSetting"
        :currentLayer="currentLayer"
        modalName="toootipSetting"
        @handleModalClose="showComponents('toootipSetting')"
      />
      <!-- 专题图-分割图弹窗 -->
      <segmentTooltip
        v-if="modalManage.segmentToolTip"
        :showModal="modalManage.segmentToolTip"
        :currentLayer="currentLayer"
        modalName="segmentToolTip"
        @handleModalClose="showComponents('segmentToolTip')"
      />
      <!-- 专题图-热力图弹窗 -->
      <heapMap
        v-if="modalManage.heapMap"
        :showModal="modalManage.heapMap"
        :currentLayer="currentLayer"
        modalName="heapMap"
        @handleModalClose="showComponents('heapMap')"
      />
    </div>
    <div
      v-else
      style="height: 100%;display: flex;align-items: center;justify-content: center;"
    >请先选择地图</div>
    <Interpretation v-show="tools_show" :currentLayer="currentLayer"></Interpretation>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { get, post } from "@/api/load.js";
import { findLayerList, findDataSet } from "@/api/layer.js";
// import dataSet from './components/dataSet.vue'
import updateProperty from "./components/updateProperty";
import CloudLayer from "@/components/layer/CloudLayer";
import createLayer from "./components/createLayer";
import Rename from "./components/ReName";
import Delete from "./components/Delete";
import editStyle from "./components/editStyle";
import tooptipSetting from "./components/tooptipSetting";
import Interpretation from "./components/Interpretation";
import segmentTooltip from "./components/segmentTooltip";
import PolygonLayer from "@/utils/Layers/PolygonLayer";
import heapMap from "./components/heapMap";
import { changeViewByDataId } from "@/common/js/layerOps";

export default {
  components: {
    CloudLayer: CloudLayer,
    // dataSet,
    updateProperty,
    createLayer,
    Rename,
    Delete,
    editStyle,
    tooptipSetting,
    Interpretation,
    segmentTooltip,
    heapMap
  },
  data() {
    return {
      tools_show: false,
      layerSearchName: "", // 模糊搜索图层关键字
      currentLayer: {}, // 当前操作的图层
      modalManage: {
        // 弹窗控制对象
        edit: false,
        rename: false,
        delete: false,
        style: false,
        dataSet: false,
        property: false,
        importLayer: false,
        createLayer: false,
        toootipSetting: false,
        segmentToolTip: false,
        heapMap: false
      },
      polygonstyle: false,
      rightList: [
        {
          name: "排序>",
          type: "order",
          children: [
            { name: "上移一层", type: "u1" },
            { name: "下移一层", type: "d1" },
            { name: "移到顶部", type: "uu" },
            { name: "移到底部", type: "dd" }
          ]
        },
        { name: "重命名", type: "rename" },
        { name: "删除", type: "delete" },
        { name: "全尺寸", type: "fullsize" },
        {
          name: "专题图>",
          type: "feature",
          children: [
            { name: "提示信息", type: "toootipSetting" },
            { name: "分割图", type: "segmentToolTip" },
            { name: "热力图", type: "heapMap" }
          ]
        },
        {
          name: "比例尺>",
          type: "scale",
          children: [
            { name: "最小比例尺显示", type: "minScale" },
            { name: "最大比例尺显示", type: "maxScale" },
            { name: "默认比例尺显示", type: "defaultScale" }
          ]
        },
        // {name:'样式', type: 'style'},
        // {name:'数据集', type: 'dataSet'},
        { name: "属性", type: "property" }
      ]
    };
  },
  computed: {
    ...mapGetters(["currentMapId", "globalLayerList", "mapName"]),
    filterLayerList() {
      // 过滤后的图层列表
      return this.globalLayerList.filter(item => {
        let name = String(item.name) || "";
        return name.indexOf(this.layerSearchName) != -1;
      });
    }
  },
  mounted() {
    const oldMapId = window.sessionStorage.getItem("oldMapId") || "";
    if (this.currentMapId && oldMapId != this.currentMapId) {
      // 清除底图
      this.cleanMap(() => {
        this.findLayerLists();
      });
    }
  },
  beforeDestroy() {
    // 组件卸载前保存当前地图id  避免重复请求列表
    window.sessionStorage.setItem("oldMapId", this.currentMapId);
  },
  methods: {
    refreshLayer() {},
    findLayerLists() {
      // 查询图层列表
      const params = { mapId: this.currentMapId };
      findLayerList(params)
        .then(res => {
          if (res.code == 0) {
            const { data = [] } = res;
            const list = data.map(item => {
              let style = {};
              if (item.style) {
                style = JSON.parse(item.style);
              }
              return {
                ...item,
                style,
                show: true
              };
            });
            this.$store.dispatch("setGlobalLayerList", list);
          } else {
            this.$store.dispatch("setGlobalLayerList", []);
          }
        })
        .catch(err => {
          this.$store.dispatch("setGlobalLayerList", []);
        });
    },
    // 图层显示隐藏
    changeEyes(item) {
      let id = item.id,
        index = -1;
      this.globalLayerList.forEach((forItem, forIndex) => {
        if (forItem.id == id) index = forIndex;
      });
      if (this.globalLayerList[index].show) {
        // 隐藏图层
        this.map.layerManager.hideLayer(this.globalLayerList[index]);
      } else {
        // 显示图层
        this.map.layerManager.showLayer(this.globalLayerList[index]);
      }
      this.$set(
        this.globalLayerList[index],
        "show",
        !this.globalLayerList[index].show
      );
    },
    showComponents(type, currentItem) {
      // 控制弹窗打开关闭的方法 type: 弹窗的类型  currentItem  当前
      if (type == "fullsize") {
        // 今后可能有多中类型
        changeViewByDataId(currentItem.data_id, currentItem.type);
        return;
      }
      if (currentItem) {
        this.currentLayer = currentItem;
      }
      this.modalManage = {
        edit: false,
        rename: false,
        delete: false,
        style: false,
        dataSet: false,
        property: false,
        importLayer: false,
        createLayer: false,
        toootipSetting: false,
        segmentToolTip: false,
        heapMap: false,
        [type]: !this.modalManage[type]
      };
    },
    // 创建成功的回调
    handleCreateOk(layer) {
      this.$store.dispatch("addLayer", layer);
    },
    // 内层pop项目点击处理
    handleInnerPopClick(type, faItem) {
      if (this.modalManage.hasOwnProperty(type)) {
        // 显示弹框的处理
        this.showComponents(type, faItem);
      } else {
        // 其他处理
      }
    },
    // 清除地图图层
    cleanMap(callback) {
      if (this.globalLayerList && this.globalLayerList.length) {
        this.globalLayerList.forEach(item => {
          this.$store.dispatch("removeLayer", item.id);
        });
      }
      callback();
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
/* 整体样式 */
.container {
  width: 300px;
  height: 790px;
  position: fixed;
  top: 40px;
  left: 88px;
  font-size: 15px;
  background-color: white;
  border: 1px solid black;
  padding-left: 10px;
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
/* 第三层table样式 */
table {
  width: 280px;
}
table > tr {
  border: 1px solid black;
  text-align: center;
}
/* table第一列 */
table > tr > td:first-child {
  width: 30px;
}
/* table第二列 */
table > tr > td:nth-child(2) {
  width: 40px;
}
/* table第二列图片 */
table > tr > td:nth-child(2) > img {
  vertical-align: middle;
}
/* table第三列 */
table > tr > td:nth-child(3) {
  width: 85px;
}
/* table第四列 */
table > tr > td:nth-child(4) {
  width: 110px;
}

/* 第四层样式 */
.fourth {
  width: 130px;
  position: fixed;
  top: 113px;
  left: 233px;
  background-color: white;
}
.fourth > div {
  border: 1px solid black;
}
/* 统一按钮样式 */
.button {
  width: 30px;
  height: 30px;
  margin: 0;
  border: 0;
}
.layerManageWrapper {
  top: 0;
  left: 80px;
  height: 100%;
  background-color: #00000099;
  padding: 10px;
  border-left: 2px solid #fff;
  color: #fff;
  .layer_list {
    .layer_list_item {
      padding: 6px 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      margin: 4px 10px;
      img {
        margin: 0 2px;
      }
      &:last-child {
        border: none;
      }
      .is_show {
        width: 18px;
      }
      .type {
        width: 18px;
      }
      .name {
        width: 150px;
        padding: 0 10px;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
      }
      .ops {
        display: inline-flex;
        align-items: center;
        .ops_item {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          width: 18px;
          height: auto;
        }
      }
    }
  }
  .no_data_tips {
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>>
