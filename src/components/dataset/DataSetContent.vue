<template>
  <div class="tabcontent" v-show="closeContent">
    <div class="title" @click="getTabContent">
      表内容
      <span @click="close" class="closeBtn">X</span>
    </div>
    <Table :columns="title" :data="contents" height="400" width="870" class="table">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row,index)">编辑</Button>
        <Button type="error" size="small" @click="remove(index)">删除</Button>
      </template>
    </Table>
    <div class="pages" style="text-align: center;margin: 4px;">
      <Page
        :page-size="4"
        @on-change="pageChange"
        :current="currentPage"
        :total="pageCount"
        show-elevator
      />
    </div>
    <div class="mask" v-show="showform">
      <Form class="create" v-model="proper">
        <div class="title">
          <span>修改内容</span>
          <span class="close" @click="closeContenTable();showform=false">X</span>
        </div>
        <div class="formContent">
          <FormItem
            v-for="(item,index) in title"
            :key="index"
            :label="item.title"
            class="inputItem"
          >
            <Input v-model="proper[item.title]" placeholder />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="editContent()">确定</Button>
            <Button style="margin-left: 8px">取消</Button>
          </FormItem>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import { post, get } from "@/api/load";
export default {
  props: ["contentId"],
  data() {
    return {
      datasetId: "",
      title: [],
      pageSize: 7,
      contents: [],
      pageCount: 0,
      currentPage: 1, //当前页
      total: 0, //总页数
      closeContent: true,
      action: "modify",
      delete: "delete",
      contentTable_index: "",
      indexId: "",
      geometry: "",
      properties: "",
      showform: false,
      name: "",
      lenght: "",
      proper: {},
      features: [],
      rowFeatures: {}
    };
  },
  mounted() {
    this.getStructure();
    this.getTabContent();
  },
  watch: {
    contentId() {
      this.getTabContent();
    }
  },
  methods: {
    // 分页
    pageChange(current) {
      this.currentPage = current;
      this.getTabContent();
    },
    // 关闭
    close() {
      this.$emit("handleModalClose");
    },
    closeContenTable() {
      this.showform = !this.showform;
    },
    // 调用表结构的接口来获取表内容的表头
    getStructure() {
      let param = {
        datasetId: this.contentId
      };
      // let url =
      //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/datasets/findDatasetInfoById";
      let url = this.$interfacePath.dataSet.findDatasetInfoById;
      console.log(param);
      let _this = this;
      _this.title = [];
      get(url, param).then(data => {
        if (data.code == 0) {
          console.log(data.data.field_list);
          // _this.tableBody = data.data.field_list;
          for (let i = 0; i < data.data.field_list.length; i++) {
            let temp = {
              title: data.data.field_list[i].name,
              key: data.data.field_list[i].name,
              width: "100px"
            };
            _this.title.push(temp);
          }
          let button = {
            title: "操作",
            slot: "action",
            fixed: "right",
            width: "100px"
          };
          _this.title.push(button);
          $(".ivu-table-tip").niceScroll({
            cursorcolor: "#37A2FF", // 改变滚动条颜色，使用16进制颜色值
            cursorwidth: "7px", // 滚动条的宽度，单位：便素
            cursorborder: "1px solid #37A2FF", // CSS方式定义滚动条边框
            cursorborderradius: "5px", // 滚动条圆角（像素）
            scrollspeed: 60, // 滚动速度
            mousescrollstep: 40, // 鼠标滚轮的滚动速度 (像素) 
        });
        } else {
          console.log(data.data.message);
        }
      });
    },
    //获取表内容
    getTabContent() {
      let param = {
        datasetId: this.contentId,
        pageCount: this.pageSize,
        pageNum: 1,
        queryGeo: false
      };
      // let url =
      //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/vectordatasets/queryFeatures";
      let url = this.$interfacePath.dataSet.queryFeatures;
      let _this = this;
      _this.contents = [];
      // _this.title = [];
      console.log(param);
      post(url, param).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.pageCount = data.data.count;
          this.features = data.data.features;
          // console.log(this.features);
          if (this.features.length > 0) {
            for (let i = 0; i < this.features.length; i++) {
              _this.contents.push(this.features[i].properties);
            }
            // console.log(_this.contents)
          } else {
            console.log(data.message);
          }
        } else {
          this.$Message.error("未查询出结果");
        }
      });
    },
    show(row, index) {
      console.log(this.features[index]);
      this.rowFeatures = this.features[index];
      for (let i = 0; i < this.title.length; i++) {
        this.proper[this.title[i].title] = this.contents[index][
          this.title[i].key
        ];
      }
      this.showform = true;
    },
    //对表内容进行编辑
    editContent() {
      let _this = this;
      console.log(_this.features);
      // let url =
      //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/vectordatasets/updateFeatures";
      let url = this.$interfacePath.dataSet.updateFeatures;
      let param = {
        dataset_list: [
          {
            dataset_id: this.contentId,
            features: [
              {
                action: this.action,
                id: this.rowFeatures.id,
                properties: this.proper
              }
            ]
          }
        ]
      };
      post(url, param).then(data => {
        if (data.code == 0) {
          this.getTabContent();
          this.showform = !this.showform;
          // this.contents.splice(index, 1);
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    //删除
    remove(index) {
      // let url =
      //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/vectordatasets/deleteFeatures";
      this.rowFeatures = this.features[index];
      for (let i = 0; i < this.title.length; i++) {
        this.proper[this.title[i].title] = this.contents[index][
          this.title[i].key
        ];
      }
      let url = this.$interfacePath.dataSet.deleteFeatures;
      let param = {
        datasetId: this.contentId,
        features: [
          {
            action: this.delete,
            id: this.rowFeatures.id
          }
        ]
      };
      console.log(param);
      //  this.contents.splice(index, 1);
      post(url, param).then(data => {
        if (data.code == 0) {
          this.contents.splice(index, 1);
        } else {
          this.$Message.error(data.message);
        }
      });
    }
  }
};
</script>
<style scoped>
.tabcontent {
  position: absolute;
  /* top: 150px; */
  width: 870px;
  height: 500px;
  /* overflow: auto; */
  background-color: rgb(243, 243, 243);
  border-radius:5px;
  /* top: 50%;
  left: 50%; */
  margin:-60px 0 0 -200px;
}
.title {
  border: 0;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
}
/* 表格样式 */
.tab {
  margin-top: 40px;
}
.ivu-table {
  width: 870px;
  height: 474px;
  font-size: 16px;
  border: 1px solid rgba(219, 212, 212, 0.5);
  color: rgba(224, 217, 217, 0.5);
  text-align: center;
  background-color: rgb(243, 243, 243);
  overflow: auto;
}
.ivu-table:before {
  background-color: rgb(243, 243, 243);
}
.ivu-table td,
.ivu-table th {
  background-color: rgb(243, 243, 243);
}
.ivu-table-wrapper {
  width: 1000px;
  height: 390px;
}
/* 修改内容 */
.create {
  width: 500px;
  height: 400px;
  background-color: rgb(243, 243, 243);
  padding-left: 20px;
  padding-top: 10px;
  position: absolute;
  left: 600px;
  top: 150px;
  /* display:flex */
}
.title {
  display: flex;
  justify-content: space-between;
  color: black;
  border: 0;
  margin: 0;
  font-size: 16px;
  margin-left: 410px;
  margin-top: 10px;
  margin-bottom: 8px;
}
.inputItem {
  display: flex;
  /* flex-wrap: wrap */
}
.ivu-form-label-left {
  text-align: center;
}
.ivu-input-wrapper {
  background-color: #fff;
  border-radius: 5px;
}
.ivu-input {
  width: 100px;
  position: relative;
  right: 300px;
  size: small;
}
.ivu-form-item {
  display: inline-block;
  margin-right: 5px;
}
.formContent {
  height: 350px;
  overflow-y: scroll;
}
.closeBtn {
  /* margin-right: 15px; */

  background-color: #EE2C2C;
  color: #fff;
  width: 20px;
  height: 20px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  /* margin-top: 5px; */
  margin-right: 15px;
  border-radius: 5px
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
/* .popper {
  z-index: 11;
} */
</style>