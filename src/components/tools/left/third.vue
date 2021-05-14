<template>
  <div>
    <!-- 样本模板面板 -->
    <div class="model">
      <!-- <button class="new">新建样本模板</button> -->
      <Button type="primary" @click="createTemplate = true">新建样本模板</Button>
      <Modal v-model="createTemplate" title="新建样本模板" @on-ok="setUp" @on-cancel="cancel">
        <p>
          模板名称:
          <input type="string" id="aa" />
        </p>
      </Modal>
      <div style="height:20px"></div>
      <div class="divstyle">
        <Table border :columns="sampleName" :data="sampleData" height="520">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button
              icon="ios-trash-outline"
              type="error"
              size="small"
              @click="deleteUserStyle(row)"
            ></Button>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from "@/api/load";
export default {
  data() {
    return {
      map: {},
      createTemplate: false,
      sampleName: [
        {
          title: "序号",
          slot: "name",
          width: 80,
          align: "center"
        },
        {
          title: "名称",
          key: "text",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.text
                  }
                },
                params.row.text
              )
            ]);
          }
        },
        {
          title: "ID",
          key: "value",
          width: 80,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 100,
          align: "center"
        }
      ],
      sampleData: []
    };
  },
  mounted() {
    this.userStyle();
  },
  methods: {
    firstmethod() {
      this.$emit("firstmethod");
    },
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      });
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    },
    setUp() {
      var self = this;
      let url = this.$interfacePath.identification.segmentationAndClassification
        .insertTemp;
      // "http://piecloud.piesat.cn/api/v1/business_server/sample/insertTemp";
      var tempName = document.getElementById("aa").value;
      var param = {
        tempName: tempName
      };
      post(url, param).then(data => {
        // console.log(data);
        self.userStyle();
        // debugger
        self.firstmethod();
      });
    },
    userStyle() {
      let self = this;
      let url = this.$interfacePath.identification.segmentationAndClassification
        .queryTemp;
      // "http://piecloud.piesat.cn/api/v1/business_server/sample/queryTemp";
      get(url).then(data => {
        var tp = data.data;
        for (var i = 0; i < tp.length; i++) {
          tp[i].name = i;
        }
        // console.log("fei0",tp)
        self.sampleData = tp;
      });
    },
    deleteUserStyle(row) {
      var self = this;
      var id = row.value;
      let url =
        this.$interfacePath.identification.segmentationAndClassification
          .delTem +
        // "http://piecloud.piesat.cn/api/v1/business_server/sample/delTem/"
        `${id}`;
      get(url).then(data => {
        console.log(row.value);
        self.userStyle();
      });
    }
  }
};
</script>

<style>
/* 样本模板中按钮样式 */
.new {
  background-color: #2ca8ff;
  font-size: 16px;
  border-radius: 8px;
  padding: 5px;
  color: #fff;
  margin-left: 20px;
  margin-bottom: 10px;
  margin-top: 5px;
}
.ivu-modal .ivu-modal-header .ivu-modal-header-inner{
  text-align: center;
}
.model table {
  width: 460px;
  height: 150px;
  text-align: center;
}
.clear {
  background-color: #2ca8ff;
  border-radius: 8px;
  padding: 3px;
  color: #fff;
}
.model tr {
  border: 1px solid gray;
}
.ivu-table-wrapper {
  position: relative;
  overflow: hidden;
  /* border: 1px solid #dcdee2; */
  /* border-bottom: 0; */
  /* border-right: 0; */
  /* height:700; */
  
  width: 455px;
}
.ivu-table {
  width: inherit;
  color: #515a6e;
  font-size: 12px;
  background-color: #fff;
  box-sizing: border-box;
}
.ivu-tabs .ivu-tabs-tabpane {
    flex-shrink: 0;
    width: 100%;
    transition: opacity .3s;
    opacity: 1;
    outline: 0;
    height: 600px;
}
.divstyle {
  overflow: scroll;
  overflow-x: hidden;
  height: 520px;
}
</style>