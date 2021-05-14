<template>
  <div class="create" v-show="hideCreate">
    <div class="title">
      <span>新建字段</span>
      <span class="close" @click="closecreate">X</span>
    </div>
    <Form :model="formItem" :label-width="80">
      <FormItem label="字段名称：">
        <Input v-model="datasetName" placeholder />
      </FormItem>
      <FormItem label=" 类型：">
        <Select v-model="datasetType">
          <Option value="integer">integer</Option>
          <Option value="string">string</Option>
          <Option value="double">double</Option>
        </Select>
      </FormItem>
      <FormItem label="长度：">
        <Input v-model="datasetLength" placeholder />
      </FormItem>
      <FormItem label="默认：">
        <Input  placeholder />
      </FormItem>
      <FormItem label=" 默认递增：">
        <CheckboxGroup v-model="formItem.checkbox">
          <Checkbox label></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="add()">确定</Button>
        <Button @click="handleReset('formCustom')" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { post, get } from "@/api/load";
export default {
  data() {
    return {
      hideCreate: true,
      formItem: {
        input: "",
        select: ""
      },
      datasetName: "",
      datasetType: "",
      datasetLength: "",
    };
  },
  methods: {
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    closecreate() {
      this.hideCreate = false;
    },
    add(dataset_id) {
      let url =
        "http://piecloud.piesat.cn/api/v1/spatiotemporal/vectordatasets/addFeatureField";
      let param = {
        datasetId: this.dataset_id,
        fieldList: [
          {
            name: this.datasetName,
            type: this.datasetType,
            length: this.datasetLength
          }
        ]
      };
      console.log(url)
      console.log(param)
      post(url, param).then(data => {
        if (data.code == 0) {
          console.log(data.message);
        } else {
          console, log(data.message);
        }
      });
    }
  }
};
</script>
<style scoped>
.create {
  width: 500px;
  height: 400px;
  background-color: antiquewhite;
  padding-left: 20px;
  padding-top: 10px;
}
.title {
  display: flex;
  justify-content: space-between;
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
</style>