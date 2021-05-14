<template>
  <div class="setBody" v-show="closeTable">
    <div class="top_text">
      <span @click="getStructure " style="color:#000; margin-left: 400px">表结构</span>
      <span class="closeDataSet" @click="close" style="margin-right:20px; color:#fff">X</span>
    </div>
    <!-- 遮罩层 -->
    <!--  -->
    <div class="newBtn" >
      <button @click="form" id="newBtn">新建字段</button>
    </div>
    <!-- 新建数据集 -->
    <!-- maskManage.showform -->
    <div class="popper" v-show="true" @handleModalClose="triggleMaskShow('showform')">
      <div class="tab">
        <i-table height="480" :content="self" :columns="tableTitle" :data="tableBody" class="table"></i-table>
      </div>
      <div class="mask" v-show="showform">
        <Form class="create" :label-width="80">
          <div class="title">
            <span>新建字段</span>
            <span class="close" @click="closecreate();showform=false">X</span>
          </div>
          <FormItem label="字段名称："  class="input">
            <Input v-model="datasetName" placeholder />
          </FormItem>
          <FormItem label=" 类型："  class="input">
            <Select v-model="datasetType">
              <Option value="integer">integer</Option>
              <Option value="string">string</Option>
              <Option value="double">double</Option>
            </Select>
          </FormItem>
          <FormItem label="长度：" class="input">
            <Input v-model="datasetLength" placeholder />
          </FormItem>
          <FormItem label="默认：" class="input">
            <Input placeholder />
          </FormItem>
          <FormItem label=" 默认递增：">
            <CheckboxGroup>
              <Checkbox label></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="add()" style="margin-left: 85px">确定</Button>
            <Button style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <!-- 修改表内容 -->
    <!-- maskManage.showedit -->
    <div class="popper" v-show="true" @handleModalClose="triggleMaskShow('showedit')">
      <div class="mask" v-show="showedit">
      <Form class="create" >
        <div class="title">
          <span>修改字段</span>
          <span class="closeFeid" @click="closeText(); showedit=false">X</span>
        </div>
        <div>
          <FormItem label="oldName" class="input">
            <Input v-model="oldName" placeholder="oldName..." style="color:#000" />
          </FormItem>
          <FormItem label=" newName" class="input">
            <Input v-model="name" placeholder />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="edit"  style="margin-left: 153px">确定</Button>
            <Button style="margin-left: 8px">取消</Button>
          </FormItem>
        </div>
      </Form></div>
    </div>
  </div>
</template>
<script>
import { post, get } from "@/api/load";
export default {
  props: ["id"],
  data() {
    return {
      tableData_index: "",
      name: "",
      type: "",
      length: "",
      // 新建数据集
      hideCreate: true,
      formItem: {
        input: "",
        select: ""
      },
      oldName: "", //修改字段名称
      datasetName: "",
      datasetType: "",
      datasetLength: "",
      showform: false, //新建字段
      showedit: false, //修改字段
      showCreate: false,
      self: this,
      // 关闭整个页面
      closeTable: true,
      // 表内容
      title: [],
      contents: [],
      pageCount: "",
      //表结构
      crsid: "EPSG:4326",
      dataset_name: "",
      dataset_type: "",
      newName: "",
      tableTitle: [
        {
          title: "字段名称",
          key: "name",
          width: 120
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
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          fixed: "right",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableBody: [],
      datasetId: ""
    };
  },
  mounted() {
    //console.log(this.id);
    this.getStructure();
  },
  computed: {
    maskFlag() {
      return this.maskManage.showform || this.maskManage.showedit;
    }
  },
  watch: {
    id() {
      this.getStructure();
    }
  },
  methods: {
    close() {
      this.$emit("handleModalClose");
    },
    triggleMaskShow(name) {
      console.log(name);
      this.maskManage = {
        showform: false,
        showedit: false,
        [name]: !this.maskManage[name]
      };
      if (!item) return;
      console.log(this.maskManage);
    },
    // 获取单个数据集详情
    getStructure() {
      let param = {
        datasetId: this.id
      };
      // let url =
      //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/datasets/findDatasetInfoById";
      let url = this.$interfacePath.dataSet.findDatasetInfoById;
      console.log(param);
      let _this = this;
      get(url, param).then(data => {
        if (data.code == 0) {
          console.log(data.data.field_list);
          _this.tableBody = data.data.field_list;
        } else {
          console.log(data.data.message);
        }
      });
    },
    closeText() {
      this.showedit = false;
    },
    // 删除
    remove(index) {
      this.tableData_index = index;
      this.oldName = this.tableBody[index].name;
      // let url =
      //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/vectordatasets/deleteFeatureField";
      let url = this.$interfacePath.dataSet.deleteFeatureField;
      let param = {
        datasetId: this.id,
        name: this.oldName //err
      };
      console.log(param);
      get(url, param).then(data => {
        if (data.code == 0) {
          this.tableBody.splice(index, 1);
          // console.log();
        } else {
          console.log(data.message);
        }
      });
    },
    // 编辑
    edit() {
      this.showform = false;
      this.oldName = this.tableBody[this.tableData_index].name;
      // let url =
      //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/vectordatasets/updateFeatureFieldName";
      let url = this.$interfacePath.dataSet.updateFeatureFieldName;
      let param = {
        datasetId: this.id,
        oldName: this.oldName, //err
        newName: this.name
      };
      console.log(param);
      get(url, param).then(data => {
        if (data.code == 0) {
          this.getStructure();
          this.showedit = false;
          console.log(data);
        } else {
          console.log(data.message);
        }
      });
    },
    show(index) {
      this.showedit = !this.showedit;
      this.tableData_index = index;
      console.log(this.tableBody[index].name);
      this.oldName = this.tableBody[index].name;
    },
    closecreate() {
      this.showform = false;
    },
    form() {
      console.log(this.showform);
      this.showform = !this.showform;
    },
    add() {
      // let url =
      //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/vectordatasets/addFeatureField";
      let url = this.$interfacePath.dataSet.addFeatureField;
      let param = {
        datasetId: this.id,
        fieldList: [
          {
            name: this.datasetName,
            type: this.datasetType,
            length: this.datasetLength
          }
        ]
      };
      console.log(param);
      post(url, param).then(data => {
        if (data.code == 0) {
          this.datasetName = "";
          this.datasetType = "";
          this.datasetLength = "";
          this.getStructure();
          this.showform = false;
          console.log(data.message);
        } else {
          this.$Message.error(data.message);
        }
      });
    }
  },
  components: {}
};
</script>
<style scoped>
.closeDataSet {
  background-color: #EE2C2C;
  /* color: #fff; */
  width: 20px;
  height: 20px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  /* margin-top: 5px; */
  margin-right: 10px;
  border-radius: 5px
}


.top_text {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-left: 25px;
  margin-top: 10px;
  margin-bottom: 8px;
  color: #fff;
}
.title {
  display: flex;
  border: 1px solid rgba(219, 212, 212, 0.5);
  width: 320px;
  margin-left: 25px;
  border-radius: 5px;
  margin-top: 10px;
  color: #fff;
}
.newBtn {
  background-color: #fff;
}
#newBtn {
   /* margin-top: 40px;  */
  margin-top: 5px;
  margin-bottom: 5px;
  color: white;
  background-color: rgb(45, 140, 240)
}
.structure,
.content {
  border-right: 1px solid;
  width: 120px;
  font-size: 16px;
  display: flex;
  justify-content: center;
}
.property {
  width: 120px;
  font-size: 16px;
  display: flex;
  justify-content: center;
}
.btn {
  margin-top: 30px;
  margin-left: 350px;
}
button {
  width: 100px;
  border-radius: 10px;
  font-size: 16px;
  border: 0;
  margin-left: 20px;
}
/* 表格样式 */
.tab {
  /* margin-top: 40px; */
  height: 70%;
  overflow: auto;
}
.ivu-table {
  width: 870px;
  height: 60%;
  font-size: 16px;
  border: 1px solid rgba(219, 212, 212, 0.5);
  color: rgba(224, 217, 217, 0.5);
  text-align: center;
  background-color: rgba(153, 153, 153, 1);
  overflow: auto;
}
/* 滚动条 */
 .table >>> .ivu-table-overflowY::-webkit-scrollbar {
  width: 7px;
}
.table >>> .ivu-table-overflowY::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #37A2FF;
}
.table >>> .ivu-table-overflowY::-webkit-scrollbar-track {
  background: white;
}
.table >>> .ivu-table-overflowY::-webkit-scrollbar-corner {
  background-color: white;
}
.setBody {
  position: absolute;
  width: 890px;
  height: 90%;
  border: 1px solid #fff;
  /* margin-left: 5px; */
  margin:-70px 0 0 -200px;
  background-color: #e2e3e5;
  border-radius: 5px
  /* rgba(153, 153, 153, 1); */
}
.contents {
  margin-top: 20px;
  width: 872px;
  height: 470px;
  overflow: scroll;
}
.pro {
  width: 872px;
  height: 494px;
  background-color: antiquewhite;
}
.contents > .ivu-table-wrapper {
  overflow-x: scroll;
  width: 3000px;
}
/* 新建数据集 */
.create {
  width: 500px;
  height: 410px;
  background-color: rgb(231, 231, 230);
  padding-left: 20px;
  padding-top: 10px;
  position: absolute;
  left: 30%;
  top: 20%;
  border-radius: 5px;
}
.title {
  display: flex;
  justify-content: space-between;
  color: black;
  border: 0;
  margin: 0;
  margin-bottom: 8px;
  margin-left: 205px;
 
}
.type {
  margin-top: 20px;
  margin-bottom: 10px;
}
.length {
  margin-bottom: 20px;
}
.auto {
  margin-top: 20px;
  margin-bottom: 10px;
}
button {
  width: 70px;
}
.ivu-input {
  width: 50%;
}
.ivu-form-item-lable {
  width: 60px;
}
.closeFeid {
  position: absolute;
  right: 20px;
  font-size: 16px;
  color: #fff;
  background-color: #EE2C2C;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  border-radius: 5px
}
.close {
  position: absolute;
  right: 10px;
  top: 0px;
  margin: 6px;
   width: 20px;
  height: 20px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  color: #fff;
  background-color: #EE2C2C;
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
.popper {
  z-index: 11;
}

.input{
  margin-right: 40px;
}
</style>