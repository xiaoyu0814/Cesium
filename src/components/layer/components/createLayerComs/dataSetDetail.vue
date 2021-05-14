<template>
  <div class="dataSetDetailsWrapper">
    <Table :columns="tableTitle" :data="tableBody" :height="600" />
  </div>
</template>
<script>
import { get } from "@/api/load";

export default {
  props: ["id"],
  data() {
    return {
      tableTitle: [
        {
          title: "字段名称",
          key: "name"
        },
        {
          title: "字段类型",
          key: "type"
        },
        {
          title: "字段长度",
          key: "length"
        },
        {
          title: "默认值",
          key: "default"
        },
        {
          title: "自增",
          key: "index"
        },
        {
          title: "非空",
          key: "null"
        },
        {
          title: "备注",
          key: "precision"
        }
      ],
      tableBody: []
    };
  },
  methods: {
    // 获取单个数据集详情
    getStructure() {
      let param = {
        datasetId: this.id
      };
      let url =
        "http://piecloud.piesat.cn/api/v1/spatiotemporal/datasets/findDatasetInfoById";
      console.log(param);
      let _this = this;
      get(url, param).then(data => {
        if (data.code == 0) {
          _this.tableBody = data.data.field_list;
        } else {
        }
      });
    }
  },
  mounted() {
    this.getStructure();
  }
};
</script>
<style lang="less">
.dataSetDetailsWrapper {
}
</style>