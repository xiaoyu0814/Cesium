<template>
  <div>
    <div class="extract_all" v-show="hideextract2">
      <!-- 这是地物分割组件 -->
      <div class="top">
        <div class="extact_title">地物分类</div>
        <div class="close" @click="hideExtract2">X</div>
      </div>
      <div>
        <el-radio-group class="text" v-model="textButton">
          <el-radio-button class="fenlei" :label="true">分类数据源</el-radio-button>
          <el-radio-button class="fenge" :label="false">分割数据源</el-radio-button>
        </el-radio-group>
        <div>
          <div class="checkbox" v-show="textButton">
            <Checkbox :checked="single">分割矢量</Checkbox>
            <Checkbox :checked="single">工矿仓储用地</Checkbox>
            <Checkbox :checked="single">园地</Checkbox>
            <Checkbox :checked="single">公共管理与公共服务用地</Checkbox>
            <Checkbox :checked="single">特殊用地</Checkbox>
            <Checkbox :checked="single">耕地</Checkbox>
            <Checkbox :checked="single">草地</Checkbox>
            <Checkbox :checked="single">住宅用地</Checkbox>
            <Checkbox :checked="single">交通运输用地</Checkbox>
            <Checkbox :checked="single">其他土地</Checkbox>
            <Checkbox :checked="single">商服用地</Checkbox>
            <Checkbox :checked="single">水域及水利设施用地</Checkbox>
            <Checkbox :checked="single">林地</Checkbox>
          </div>
          <div class="checkbox" v-show="!textButton">
            <Checkbox :checked="single">分割矢量</Checkbox>
            <Checkbox :checked="single">工矿仓储用地</Checkbox>
            <Checkbox :checked="single">园地</Checkbox>
            <Checkbox :checked="single">公共管理与公共服务用地</Checkbox>
            <Checkbox :checked="single">特殊用地</Checkbox>
            <Checkbox :checked="single">耕地</Checkbox>
            <Checkbox :checked="single">草地</Checkbox>
            <!--  <Checkbox :checked="single">住宅用地</Checkbox>
            <Checkbox :checked="single">交通运输用地</Checkbox>
            <Checkbox :checked="single">其他土地</Checkbox>
            <Checkbox :checked="single">商服用地</Checkbox>
            <Checkbox :checked="single">水域及水利设施用地</Checkbox>
            <Checkbox :checked="single">林地</Checkbox>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      single: false,
      textButton: true,
      hideextract2:true
    };
  },
   methods:{
    hideExtract2(){
      this.hideextract2=false;
    },
   },
};
</script>
<style>
/* 整体样式 */
.extract_all {
  width: 300px;
  height: 550px;
  border: 1px solid rgb(126, 169, 224);
  margin-left: 15px;
  margin-top: 10px;
  color: #fff;
  background-color: gray;
  background-color: rgba(0, 0, 0, 0.5);
}
.top{
  display:flex;
  justify-content: space-between; 
}
/* 标题字体样式 */
.extact_title {
  font-size: 20px;
  margin-left: 5px;
  padding: 5px;
}
.close{
  font-size: 20px;
  margin-top: 5px;
  display:flex;
  margin-right: 15px;
  
}
/* 文字样式 */
.text {
  font-size: 16px;
  border-bottom: 1px solid #d3cbcb;
  padding-left: 28px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-bottom: 5px;
  display: flex;
}

/* 复选框样式 */
.checkbox {
  display: flex;
  flex-direction: column;
  margin-left: 15px;
}
.ivu-checkbox-wrapper {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>