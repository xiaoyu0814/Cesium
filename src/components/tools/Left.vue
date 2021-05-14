<template><!--  暂时保存--->
  <div>
    <!-- 整体 -->
    <div class="all">
      <!-- 标题字 -->
      <div class="title">地物分类</div>
      <div class="body">
        <div class="top_nav">
          <Tabs>
            <TabPane label="样本" @click="handelTem" tabindex="1">
              <First class="tem" @firstmethod="firstmethod" ref="child1Container"></First>
            </TabPane>
            <TabPane label="图层" @click="handelMap" tabindex="2">
              <Second class="map"></Second>
            </TabPane>
            <TabPane label="样本模板" @click="handelExam" tabindex="3">
              <Third class="exam"></Third>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
   
  </div>
</template>
<script>
import First from "@/components/tools/left/first";
import Second from "@/components/tools/left/second";
import Third from "@/components/tools/left/third";
export default {
  data() {
    return {
      tem: true,
      map: false,
      exam: false
    };
  },
  methods: {
    firstmethod(){
      this.$refs.firstContainer.userStyle();
    },
    handelTem() {
      if (this.tem) {
          this.closeAll();
      }else{
          this.closeAll();
          this.tem=!this.tem;
      }
      
    },
    handelMap() {
        if (this.map) {
        this.closeAll();
      }else{
          this.closeAll();
          this.map=!this.map;
      }
    },
    handelExam() {
        if (this.exam) {
        this.closeAll();
      }else{
          this.closeAll();
          this.exam=!this.exam;
      }
    },
    closeAll(){
        this.tem=false;
        this.map=false;
        this.exam=false
    }
  },
  components: {
    First,
    Second,
    Third
  },
  mounted(){
    this.closeAll()
  }
};
</script>
<style scoped>
/* 整体样式 */
.all {
  width: 500px;
  height: 700px;
  /* border: 1px solid; */
  margin-left: 15px;
  /* overflow-y: auto; */
  margin-top: 10px;
}
/* 标题字体样式 */
.title {
  font-size: 18px;
  margin-left: 5px;
  padding: 5px;
  background-color: #fafafa;
  color:#000
}
.top_nav{font-size: 18px;
   display: flex;
    flex-direction: row;
    margin-left: 15px;
    
}
.frist,.second,.third{
    border-right: 1px solid #f1f2f6;
    border-top: 1px solid #f1f2f6;
    border-bottom: 1px solid #f1f2f6;
    padding: 5px  ;
    width: 100px;
    text-align: center;
    width: 153px;background-color: #dee0e9
}
.frist{
    border-left: 1px solid #f1f2f6;
    border-top-left-radius:5px;
    border-bottom-left-radius: 5px; 
  
}
.third{
    border-top-right-radius:5px;
    border-bottom-right-radius: 5px;
}
/* 样本子组件样式 */
/* .tem,.map,.exam{ 
    position: fixed;
    top: 20 %;
} */
.top_nav>div:focus{
    background-color: #2ca8ff;
    color: #f1f2f6
}
.body{
    background-color: #f1f2f6;
}
</style>