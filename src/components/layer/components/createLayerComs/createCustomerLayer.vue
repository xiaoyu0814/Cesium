<template>
  <div class="createCustomerLayerWrapper">
    <Form :model="createForm" :label-width="95">
      <FormItem label="所属地图数据">
        <div>{{mapName}}</div>
      </FormItem>
      <FormItem label="图层名称">
        <Input v-model="layerName" placeholder="输入图层名称" />
      </FormItem>
      <!-- <FormItem label="图层类型">
                <RadioGroup v-model="layerType">
                    <Radio v-for="(item, index) in layerTypeList" :label="item.label" :key="index">
                        {{item.name}}
                    </Radio>
                </RadioGroup>
      </FormItem>-->
      <FormItem label="是否公开">
        <i-switch v-model="isPublic">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem label="关联数据集">
        <div class="flex">
          <Input
            search
            placeholder="查询我的数据集"
            style="width: 200px;margin-right: 15px;"
            @on-search="searchDataSet(1)"
            v-model="dataSetSearchText"
          />
          <Button @click="triggleCreateDataSet">创建数据集</Button>
        </div>
      </FormItem>
    </Form>
    <div class="group-header flex">
      <div class="select">#</div>
      <div class="type">数据类型</div>
      <div class="name">数据名称</div>
      <div class="detail">详情</div>
    </div>
    <RadioGroup v-if="dataSetData.length" v-model="dataSetSelect" vertical>
      <Radio
        class="data_set_list"
        v-for="(item, index) in dataSetData"
        :label="item.id"
        :key="index"
      >
        <div class="list_item flex">
          <div style="width: 40px;">{{layerTypeObj[item.type]}}</div>
          <div>{{item.name}}</div>
          <img
            @click.stop="triggleDataDetail(item)"
            src="../../../../assets/icons/file.png"
            style="width: 24px"
          />
        </div>
      </Radio>
    </RadioGroup>
    <div v-else style="text-align: center;">暂无相关数据集</div>
    <div class="pages" style="text-align: center;margin: 4px;">
      <Page
        :page-size="4"
        @on-change="pageChange"
        :current="currentPage"
        :total="totalDataSet"
        simple
      />
    </div>
    <createDataSet
      v-if="createDataSet"
      :showModal="createDataSet"
      modalName="createDataSet"
      @handleModalClose="triggleCreateDataSet"
      @handleCreateSuccess="searchDataSet"
    />
    <mModal
      v-if="showDetail"
      :modal="showDetail"
      modalTitle="数据集详情"
      :modalWidth="750"
      :hideFooter="true"
      @listenModal="triggleDataDetail"
    >
      <dataSetDetail :id="currentDataSetId" />
    </mModal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { createLayer, getDataSetList } from "@/api/layer.js";
import createDataSet from "../../dataSet/AddDataSet";
import dataSetDetail from "./dataSetDetail";

export default {
  components: {
    createDataSet,
    dataSetDetail
  },
  data() {
    return {
      currentDataSetId: "", // 当前点击的数据集id
      showDetail: false, // 是否显示数据及详情
      createForm: {},
      layerName: `图层-${this.$store.state.globalLayerList.length + 1}`,
      currentPage: 1,
      totalDataSet: 0,
      // layerType: 'point',
      isPublic: false, // 是否公开
      dataSetSearchText: "", // 数据集搜索字段
      dataSetSelect: "",
      createDataSet: false, // 创建数据集弹窗
      dataSetData: [],
      layerTypeList: [
        { label: "point", name: "点" },
        { label: "line", name: "线" },
        { label: "polygon", name: "面" },
        { label: "raster", name: "栅格" }
      ],
      layerTypeObj: {
        point: "点",
        line: "线",
        polygon: "面",
        raster: "栅格"
      }
    };
  },
  computed: {
    ...mapGetters(["currentMapId", "globalLayerList", "mapName"])
  },
  methods: {
    pageChange(current) {
      this.currentPage = current;
      this.searchDataSet();
    },
    searchDataSet(current) {
      // 查询关联数据集
      const params = {
        userId: Number(window.localStorage.getItem("userId")),
        search: this.dataSetSearchText,
        type: this.layerType,
        page: current || this.currentPage,
        size: 4
      };
      getDataSetList(params)
        .then(res => {
          if (res.code == 0) {
            this.dataSetData = res.data.data || [];
            this.totalDataSet = res.data.count || 0;
          } else {
            this.totalDataSet = 0;
            this.dataSetData = [];
          }
        })
        .catch(err => {
          this.totalDataSet = 0;
          this.dataSetData = [];
          this.$Message.error("查询失败!");
        });
    },
    getParams() {
      // 将图层参数暴露出去
      let layerType = "",
        dataId = "";
      for (let i = 0; i < this.dataSetData.length; i++) {
        if (this.dataSetData[i].id == this.dataSetSelect) {
          layerType = this.dataSetData[i].type;
          dataId = this.dataSetData[i].data_id;
          break;
        }
      }
      return {
        map_id: this.currentMapId,
        dataset_id: this.dataSetSelect,
        is_public: this.isPublic ? 1 : 0,
        name: this.layerName,
        type: layerType,
        data_id: dataId,
        user_id: Number(window.localStorage.getItem("userId")),
        dataId
      };
    },
    triggleCreateDataSet() {
      this.createDataSet = !this.createDataSet;
    },
    triggleDataDetail(item) {
      if (item) this.currentDataSetId = item.data_id;
      this.showDetail = !this.showDetail;
    }
  },
  watch: {
    layerType() {
      // this.searchDataSet(1);
    }
  },
  mounted() {
    this.searchDataSet();
  }
};
</script>
<style lang="less">
.createCustomerLayerWrapper {
  .group-header {
    text-align: center;
    padding: 0 40px;
    margin: 6px 0;
    .select {
      width: 20px;
    }
    .type {
      width: 60px;
    }
    .name {
      width: 200px;
    }
    .detail {
      width: 52px;
    }
  }
  .data_set_list {
    padding: 0 40px;
    display: flex;
    align-items: center;
    .list_item {
      display: inline-flex;
      justify-content: space-between;
      align-content: center;
      font-size: 16px;
      width: 300px;
      > div {
        text-align: center;
        width: 215px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }
    }
  }
}
</style>