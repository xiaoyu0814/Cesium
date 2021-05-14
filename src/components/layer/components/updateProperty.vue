<template>
  <mModal
    :modal="showModal"
    modalTitle="属性信息"
    :modalWidth="550"
    hideFooter
    @listenModal="handleModalClose(modalName)"
  >
    <div class="updatePropertyWrapper">
      <RadioGroup
        style="width: 100%;margin: 10px auto;text-align: center;"
        v-model="prototypeType"
        type="button"
      >
        <Radio label="original" :type="prototypeType == 'original' ? 'primary' : 'normal'">基本属性</Radio>
        <Radio label="project" :type="prototypeType == 'project' ? 'primary' : 'normal'">其他属性</Radio>
      </RadioGroup>
      <div v-if="prototypeType == 'original'">
        <div class="prototype-item layer-name flex">
          <div class="bold label">图层名称:&nbsp;</div>
          <div>{{updataMessage.datacontent}}</div>
        </div>
        <div class="prototype-item Operation flex">
          <div class="bold label">数据集名称:&nbsp;</div>
          <div>{{updataMessage.datatype}}</div>
        </div>
        <div class="prototype-item Operation flex">
          <div class="bold label">描述:&nbsp;</div>
          <div>{{updataMessage.description}}</div>
        </div>
      </div>
      <div v-else>
        <div class="prototype-item layer-name flex">
          <div class="bold label">坐标系:&nbsp;</div>
          <div>{{updataMessage.projection}}</div>
        </div>
        <div class="prototype-item Operation flex">
          <div class="bold label">单位:&nbsp;</div>
          <div>{{updataMessage.danwei}}</div>
        </div>
        <div class="prototype-item Operation flex">
          <div class="bold label">坐标信息:&nbsp;</div>
          <div>
            {{updataMessage.sit}}
          </div>
        </div>
      </div>
    </div>
  </mModal>
</template>
<script>
import modalMixins from "./modalMixins.js";
import { get } from "../../../api/load";
export default {
  name: "updateProperty",
  props: ["currentLayer"],
  mixins: [modalMixins],
  data() {
    return {
      prototypeType: "original",
      operations: [
        { label: "选择", name: "select" },
        { label: "更新", name: "update" },
        { label: "删除", name: "delete" }
      ],
      fieldData: [
        { field: "field1" },
        { field: "field1" },
        { field: "field1" },
        { field: "field1" },
        { field: "field1" },
        { field: "field1" }
      ],
      tableData: [{}, {}, {}],
      updataMessage: {
        datacontent:"",//图层名称
        datatype:"",//数据集名称
        description:"",//描述
        projection:"",//坐标系
        danwei:"",//单位
        sit:""//坐标信息
      }
    };
  },
  computed: {
    fieldCol() {
      return [
        {
          title: "属性名",
          key: "field",
          align: "center",
          tooltip: true
        },
        {
          type: "selection",
          width: 60,
          align: "center"
        }
      ];
    },
    tableCol() {
      return [
        {
          title: "字段1",
          key: "field",
          align: "center",
          tooltip: true
        },
        {
          title: "字段2",
          key: "field",
          align: "center",
          tooltip: true
        },
        {
          title: "字段3",
          key: "field",
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          key: "field",
          align: "center",
          tooltip: true
        }
      ];
    }
  },
  methods: {
    byclick() {
      // 展示属性信息
      let Id = this.currentLayer.id;
      // let url = "https://piecloud.piesat.cn:8443/api/v1/spatiotemporal/layers/getLayerInfoById?Id=" + Id;
      let url = this.$interfacePath.dataSet.updataproperty+'?Id='+Id;
      get(url).then(data => {
        if (data.code == 0) {
          let datacontent = data.data;
          let datalength = data.data.length;
          this.updataMessage.datacontent = datacontent.dataset_name; //图层名称
          this.updataMessage.datatype = datacontent.data_type; //数据集名称
          this.updataMessage.description = datacontent.description; //描述
          this.updataMessage.projection = datacontent.projection; //坐标系
          this.updataMessage.danwei = "暂无数据"; //单位
          this.updataMessage.sit = "暂无数据"; //坐标信息
        } else {
          this.$Message.error("系统报错" + data.message);
        }
      });
    }
  },
  mounted() {
      console.log("qidong")
    this.byclick();
  }
};
</script>
<style lang="less">
.updatePropertyWrapper {
  padding: 0 20px;
  font-size: 14px;
  .prototype-item {
    padding: 12px 0; 
    .layer-name {
      border-bottom: 1px solid #000000;
    }
    .label {
      width: 90px;
      min-width: 90px;
      text-align: right;
      padding-right: 5px;
    }
  }
}
</style>