<template>
    <!-- 地物分类 -->
    <div class="extract">
        <div class="head">地物分类</div>
        <!--s 步骤条 s-->
        <div class="mapStep">
            <el-steps :active="active"  finish-status="success">
                <el-step title="分割"></el-step>
                <el-step title="采样"></el-step>
                <el-step title="分类"></el-step>
            </el-steps>
        </div>
        <button class="cut" @click="startCut">开始分割</button>
    </div>
</template>
<script>
export default {
    data() {
      return {
        active:null,
      };
    },
    methods: {
        //开始分割
        startCut(){
            this.active = 1
        }
    }
}
</script>
<style scoped>
.extract {
    position: relative;
    top: 0px;
    left: 0;
    width: 100vw;
    height: 140px;
    background-color: rgba(0, 0, 0, 0.3);
}
.head{
    margin: 0px auto;
    width: 200px;
    height: 40px;
    line-height: 40px;
    color: white;
    font-size: 30px;
    text-align: center;
    border: 1px solid #000;
}
.mapStep{
    margin: 6px auto;
    width: 400px;
    height: 54px;
    border: 1px solid #000;
}
.el-steps{
    width: 400px;
}
.cut{
    position: absolute;
    top: 50px;
    left: 0px;
    width: 70px;
    height:40px;
    line-height: 40px;
    font-size: 16px;
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 20px;

}
</style>