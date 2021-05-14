<template>
  <!-- 添加数据集 -->
  <mModal
      :modal="showModal"
      modalTitle="创建数据集"
      :modalWidth="550"
      @listenModal="handleModalClose(modalName)"
      @listenModalOk="handleCreateDataSet"
  >
  <div class="addData_set">
    <Tabs v-model="createType" type="card" style="width: 100%;margin: 10px auto;text-align: center;">
      <!-- <TabPane label="导入云端公共数据集">标签一的内容</TabPane> -->
      <TabPane name="upload" label="上传本地数据集文件" style="width: 100%;margin: 10px auto;text-align: center;">
        <div class="local_data">
          <div class="local_top">
            <!-- :headers="{}" -->
            <!-- multipart/form-data -->
            <Upload
              action="https://piecloud.piesat.cn:8443/api/v1/spatiotemporal/datasets/fileUpload"
              accept=".zip"
              :format="['zip']"
              :data="{'userId':userId}"
              :max-size="512000"
              :on-exceeded-size="fileMaxSize"
              :before-upload="uploadBefore"
              :on-success="uploadSuccess"
            >
              <Button icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>
          </div>
        </div>
      </TabPane>
      <TabPane name="template" label="参考模板创建数据集" style="width: 100%;margin: 10px auto;text-align: center;">
        <Form :model="createForm" :label-width="95">
          <FormItem label="数据集名称">
            <Input v-model="dataName" placeholder="请输入..." />
          </FormItem>
          <FormItem label="数据集名称">
            <Cascader v-model="cascaderData" :data="paneldata" :load-data="loadData"></Cascader>
          </FormItem>
          <FormItem label="数据集投影">
            <Select v-model="dataSetProjection" clearable>
              <Option
                v-for="item in projection"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否公开">
            <RadioGroup v-model="dataSetDisclosure">
              <Radio label="1">共有数据集</Radio>
              <Radio label="0">私有数据集</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
  </mModal>
</template>
<script>
import { get, post } from "../../../api/load";
import modalMixins from '../components/modalMixins'

export default {
  name: "AddDataSet",
  mixins: [modalMixins],
  data() {
    return {
      userId: window.localStorage.getItem("userId"),
      createType: 'upload',
      createForm: {},
      cascaderData: [], //级联选中的数据项
      cascaderListData: [], // 级联二级菜单的数据
      dataName: "", //数据集名称
      paneldata: [
        {
          value: "point",
          label: "点",
          children: [],
          loading: false
        },
        {
          value: "line",
          label: "线",
          children: [],
          loading: false
        },
        {
          value: "polygon",
          label: "面",
          children: [],
          loading: false
        }
      ],
      projection: [
        //投影列表
        {
          value: "EPSG:4326",
          label: "EPSG:4326"
        },
        {
          value: "EPSG:3857",
          label: "EPSG:3857"
        }
      ],
      dataSetpanel: "", //选择面板
      dataSetProjection: "", //数据集投影
      dataSetDisclosure: null, //数据集是否公开
      interval: [],
      currentFrequency: 0
    };
  },
  watch: {
    cascaderData(val) {
      console.log("1111" + val);
    }
  },
  methods: {
    // 创建确定
    handleCreateDataSet() {
      if(this.createType == 'upload') {
        // 上传的确定操作
      } else {
        // 参考模板的创建确定
        this.modelDataSet();
      }
    },
    loadData(item, callback) {
      item.loading = true;
      // 获取模板接口
      let tempvalue = item.value
      console.log(item.value);
      // let url =
        // "http://piecloud.piesat.cn/api/v1/spatiotemporal/datasets/findDatasetInfoModel?datasetType=" +
        // item.value;
        let url = this.$interfacePath.dataSet.requireModuled+'?datasetType='+tempvalue;
      get(url).then(data => {
        if (data.code == 0) {
          item.loading = false;
          if (data.data.length) {
            this.cascaderListData = data.data;
            item.children = data.data.map(item => {
              return {
                ...item,
                value: item.data_id,
                label: item.name
              };
            });
            console.log(item.children[0].field);
          } else {
            // 没有数据的加载内容
            this.$Message.error("暂无数据");
          }
          callback();
        } else {
          item.loading = false;
          this.$Message.error("系统报错" + data.message);
        }
      });
    },
    // 参考模板创建数据集
    modelDataSet() {
      // let url =
      //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/datasets/createDataset";
      let url = this.$interfacePath.dataSet.moduledDataSet;
      let param = {
        user_id :this.userId,
        model_data_id: this.cascaderData[1],
        dataset_name: this.dataName, //数据集名称
        crsid: this.dataSetProjection, //数据集投影
        is_public: this.dataSetDisclosure //是否公开
      };
      post(url, param).then(data => {
        if (data.code == 0) {
          this.$Message.success('创建成功!');
          this.handleModalClose(this.modalName);
          this.$emit('handleCreateSuccess');
        } else {
          this.$message.error("创建失败");
        }
      });
    },
    fileMaxSize(file) {
      this.$Spin.hide();
      this.$Notice.warning({
        title: "文件大小超过限制",
        desc: "上传的文件大小不可超过500M."
      });
    },
    uploadBefore() {
      this.handleSpinCustom();
    },
    uploadSuccess(response, file, fileList) {
      this.$Spin.hide();
      if (response.code === 0) {
        for (let i = 0; i < response.data.mission_list.length; i++) {
          this.getFindTaskStatus(response.data.mission_list[i], i);
          let temp = window.setInterval(() => {
            this.getFindTaskStatus(response.data.mission_list[i], i);
          }, 2000);
          this.interval.push(temp);
        }
      } else {
        this.$message.error(data.message);
      }
    },
    getFindTaskStatus(taskId, index) {
      let path = this.$interfacePath.layer.findTaskStatus;
      let param = {
        taskId: taskId
      };
      get(path, param).then(data => {
        if (data.code === 0) {
          if (data.data.missionStatus === 5) {
            window.clearInterval(this.interval[index]);
            this.currentFrequency++;
            if (this.currentFrequency === this.interval.length) {
              this.currentFrequency = 0;
            }
          } else {
            console.log(data.data);
            console.log(data.data.missionStatus);
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    handleSpinCustom() {
      this.$Spin.show({
        render: h => {
          return h("div", [
            h("Icon", {
              class: "demo-spin-icon-load",
              props: {
                type: "ios-loading",
                size: 18
              }
            }),
            h("div", "Loading")
          ]);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
// * {
//   margin: 0;
//   padding: 0;
//   color: #333;
//   list-style: none;
// }
.addData_set {
  .local_data {
    text-align: left;
  }
  .ivu-tabs-tabpane {
    height: 150px;
  }
}
</style>