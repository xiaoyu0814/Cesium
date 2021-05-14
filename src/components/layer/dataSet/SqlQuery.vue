<template>
  <div class="sql_query" v-show="show">
    <p>
      <RadioGroup v-model="operation">
        <label for>操作：</label>
        <Radio label="Select"></Radio>
        <Radio label="Updata"></Radio>
        <Radio label="Delete"></Radio>
      </RadioGroup>
      <span class="close" @click="close">X</span>
    </p>
    <div class="sql_content">
      <div class="sql_left">
        <Table border ref="selection" :columns="columns4" :data="data1" class="left"></Table>
      </div>
      <div class="sql_right">
        <p>条件：</p>
        <Input v-model="value5" type="textarea" placeholder="where id>10..." />
        <p>sql预览</p>
        <Input
          v-model="value6"
          type="textarea"
          :rows="4"
          placeholder="select China.field1,China.field3,China.field5 from China where id >10"
        />
        <p class="sql_btn">
          <Button>清除</Button>
          <Button>验证</Button>
          <Button>执行</Button>
        </p>
      </div>
    </div>
    <div class="sql_bottom">
      <p>结果：</p>
    </div>
  </div>
</template>
<script>
import { get } from "../../../api/load";
export default {
  name: "SqlQuery",
  data() {
    return {
      show:true,
      operation: "select",
      value5: "",
      value6: "",
      datalist:"",
      columns4: [
        {
          type: "selection",
          width: 50,
          align: "center"
        },
        {
          title: "文件名",
          key: "filename"
        }
      ],
      data1: []
    };
  },
  mounted() {
    let headers =  window.localStorage.getItem("userId")
    // let url =
    //   "http://piecloud.piesat.cn/api/v1/spatiotemporal/datasets/findDatasetListByUserId?userId="+headers;
    let url = this.$interfacePath.dataSet.sqlQuery+'?userId='+headers;
    get(url).then(data => {
      if (data.code == 0) {
        let datalength = data.data.data.length;
        for(var i=0 ;i<datalength;i++){
        var datalist = data.data.data[i].name;
        var temp ={
          filename : datalist
        }
        this.data1.push(temp)
        }
        $(".sql_left").niceScroll({
          cursorcolor: "#37A2FF", // 改变滚动条颜色，使用16进制颜色值
          cursorwidth: "5px", // 滚动条的宽度，单位：便素
          cursorborder: "1px solid #37A2FF", // CSS方式定义滚动条边框
          cursorborderradius: "5px", // 滚动条圆角（像素）
          scrollspeed: 60, // 滚动速度
          mousescrollstep: 40, // 鼠标滚轮的滚动速度 (像素) 
        });
      } else {
        this.$Message.error("系统报错" + data.message);
      }

    });
  },
  methods:{
    close(){
      // this.show = !this.show;
      this.$emit('handleModalClose')
    }
  }
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  color: #333;
  list-style: none;
}
.sql_query {
  margin: -50px  0 0 -200px;
  width: 540px;
  height: 500px;
  background-color: rgb(243, 243, 243);
  border:1px solid #fff;
  border-radius:5px;
  padding-left: 20px;
  padding-right: 20px;
}
.sql_query p {
  margin-top: 20px;
  height: 30px;
}
.close{
  float: right;
  cursor: pointer;
  background-color: #EE2C2C;
   color: #fff; 
  width: 20px;
  height: 20px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  border-radius: 5px
}
.sql_content {
  width: 100%;
  height: 300px;
  margin-top: 20px;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
}
.sql_left {
  display: inline-block;
  width: 45%;
  /* height: 300px;` */
  overflow-y: scroll;
  /* border: 1px solid #000; */
}
.sql_left::-webkit-scrollbar {
	display:none
}

.sql_right {
  display: inline-block;
  width: 45%;
  /* height: 300px; */
  /* border: 1px solid #000; */
}
.sql_btn {
  width: 100%;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
}
button {
  width: 30%;
  height: 30px;
}
.sql_bottom {
  margin-top: 20px;
  width: 100%;
}
</style>