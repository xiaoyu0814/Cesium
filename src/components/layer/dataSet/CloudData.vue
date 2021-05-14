<template>
  <div class="cloud_date">
    <div class="cloud">
      <p>数据集名称</p>
      <Input v-model="dataName" placeholder="请输入..." clearable style="width:220px;" />
      <p>数据集类型</p>
      <RadioGroup v-model="dataSetType">
        <Radio label="点数据集"></Radio>
        <Radio label="线数据集"></Radio>
        <Radio label="面数据集"></Radio>
      </RadioGroup>
      <p>数据集投影</p>
      <Select v-model="dataSetProjection" clearable style="width:220px">
        <Option v-for="item in projection" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <p>数据集是否公开</p>
      <RadioGroup v-model="dataSetDisclosure">
        <Radio label="公开数据集"></Radio>
        <Radio label="私有数据集"></Radio>
      </RadioGroup>
    </div>
    <div class="data">
      <div class="search">
        <Input search placeholder="Enter something..." style="width:220px" />
      </div>
    </div>
    <div class="cloud_btn">
        <button class="save">保存</button>
        <button class="cancel">取消</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "CloudData",
  data() {
    return {
      dataName: "", //数据集名称
      dataSetType: "点数据集", //数据集类型
      projection: [
        {
          value: "AAA投影",
          label: "AAA投影"
        },
        {
          value: "BBB投影",
          label: "BBB投影"
        },
        {
          value: "CCC投影",
          label: "CCC投影"
        }
      ],
      dataSetProjection: "", //数据集投影
      dataSetDisclosure: "" //数据集是否公开
    };
  },
  methods: {
 
    
  }
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.cloud_date {
  width: 100%;
  height: 100%;
  /* background-color: yellow; */
}
.cloud {
  display: inline-block;
  width: 45%;
  height: 85%;
  border: 1px solid #000;
}
.cloud p {
  width: 100%;
  padding: 20px 0px 5px;
}
.data {
  float: right;
  width: 50%;
  height: 85%;
  border: 1px solid #000;
}
.data .search {
  margin-top: 20px;
  width: 100%;
  height: 30px;
  border: 1px solid #000;
}
.cloud_btn{
    width: 100%;
    height: 15%;
    padding-top: 15px;
    text-align: center;
    border: 1px solid #000;
}
.cloud_btn button{
  width: 90px;
  height: 25px;
  font-size: 12px;
  background-color: #fff;
  border-radius: 20px;
  border: none;
}
.save {
  margin-right: 40px;
}
</style>