<template>
  <div class="create_vectorlayer">
    <div class="layer_header" v-show="layershow">
      <h2>创 建 矢 量 层</h2>
      <span @click="close">X</span>
    </div>
    <div class="layer_content">
      <i-form :model="formItem" :label-width="80">
        <Form-item label="图层的名字:">
          <i-input :value.sync="formItem.input" placeholder="请命名"></i-input>
        </Form-item>
        <p class="line_head"></p>
        <Form-item label="类型:">
          <i-select :model.sync="formItem.select" placeholder="请选择类型">
            <i-option value="Point" style="text-align:center">点</i-option>
            <i-option value="Line" style="text-align:center">线</i-option>
            <i-option value="Polygon" style="text-align:center">面</i-option>
            <i-option value="Raster" style="text-align:center">栅格</i-option>
          </i-select>
        </Form-item>
        <p class="line"></p>
         <Form-item label="描述:">
            <i-input :value.sync="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请具体描述..."></i-input>
        </Form-item>
        <p class="line"></p>
        <Form-item label="服务URL:">
          <i-select :model.sync="formItem.select" placeholder="请选择服务URL">
            <i-option value="beijing" style="text-align:center">北京市</i-option>
            <i-option value="shanghai" style="text-align:center">上海市</i-option>
            <i-option value="shenzhen" style="text-align:center">深圳市</i-option>
          </i-select>
        </Form-item>
        <p class="line"></p>
         <Form-item>
            <i-button class="btn" type="primary">提交</i-button>
            <i-button class="btn" type="ghost" style="margin-left: 20px;color:black">取消</i-button>
        </Form-item>
      </i-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "CreateVectorLayer",
  data() {
    return {
        layershow:true,
        formItem: {
            input: "",
            select: "",
        }
    };
  },
  methods: {
      close(){
          this.layershow = false;
      }
  }
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
.create_vectorlayer {
  width: 400px;
  height: 320px;
  background-color: #ffffff;
  border: 1px solid #000;
}
.layer_header {
  position: relative;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: gainsboro;
}
.layer_header h2 {
  display: inline-block;
  color: #000;
  font-size: 16px;
  font-weight: bold;
}
.layer_header span {
  position: absolute;
  top: 8px;
  right: 5px;
  display: inline-block;
  width: 15px;
  height: 15px;
  line-height: 15px;
  font-size: 10px;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  background-color: red;
}
.layer_content {
  width: 350px;
  margin: 20px auto;
  /* border: 1px solid #000; */
}
Form-item label{
    font-size: 16px;
}
.line_head{
    height: 8px;
    border-bottom: 1px solid #000;
    margin-bottom: 8px;
}
.line{
    height: 15px;
}
.btn{
    width: 120px;
    height: 30px;;
}
</style>