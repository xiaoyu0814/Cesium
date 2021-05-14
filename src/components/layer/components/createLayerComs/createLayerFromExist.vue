<template>
  <div class="createLayerFromExistWrapper">
    <div v-if="dataSetData.length">
      <Table
        border
        :data="dataSetData"
        :columns="tableCol"
        :max-height="400"
        @on-row-click="handleRowClick"
        highlight-row
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getLayersByUserId } from "@/api/layer.js";
export default {
  data() {
    return {
      dataSetData: [],
      currentSelectRow: {}
    };
  },
  computed: {
    ...mapGetters(["currentMapId"]),
    tableCol() {
      return [
        {
          title: "类型",
          key: "type",
          align: "center",
          tooltip: true
        },
        {
          title: "图层名称",
          key: "name",
          align: "center",
          tooltip: true
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            const { create_time = "" } = params.row;
            const date = new Date(create_time);
            const str = `${date.getFullYear()}-${date.getMonth() +
              1}-${date.getDate()}`;
            return h("div", [h("span", str)]);
          }
        }
      ];
    }
  },
  methods: {
    searchDataSet() {
      // 查询用户名下的关联图层
      const params = {
        userId: Number(window.localStorage.getItem("userId"))
      };
      getLayersByUserId(params)
        .then(res => {
          if (res.code == 0) {
            this.dataSetData = res.data || [];
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
    handleRowClick(row) {
      this.currentSelectRow = row;
    },
    getParams() {
      // 这种情况下  数据id字段还得先查询接口才能拿到
      return {
        map_id: this.currentMapId,
        dataset_id: this.currentSelectRow.dataset_id,
        is_public: this.currentSelectRow.is_public,
        name: this.currentSelectRow.name,
        type: this.currentSelectRow.type,
        user_id: Number(window.localStorage.getItem("userId"))
      };
    }
  },
  mounted() {
    this.searchDataSet();
  }
};
</script>
<style lang="less">
.createLayerFromExistWrapper {
  .ivu-table-wrapper {
    .ivu-table {
      tr {
        td {
          height: 32px;
        }
      }
    }
  }
}
</style>