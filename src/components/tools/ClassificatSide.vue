<template>
    <!--地物分类成功之后的分类样式条组件 -->
    <div class="classificat_side">
        <div class="lengendCon">
            <i class="con_one"></i>
            <em title="耕地">耕地</em>
        </div>
        <div class="lengendCon">
            <i class="con_two"></i>
            <em title="园林">园林</em>
        </div>
        <div class="lengendCon">
            <i class="con_three"></i>
            <em title="林地">林地</em>
        </div>
        <div class="lengendCon">
            <i class="con_four"></i>
            <em title="草地">草地</em>
        </div>
        <div class="lengendCon">
            <i class="con_five"></i>
            <em title="商服用地">商服用地</em>
        </div>
        <div class="lengendCon">
            <i class="con_six"></i>
            <em title="工矿仓储用地">工矿仓储用地</em>
        </div>
        <div class="lengendCon">
            <i class="con_seven"></i>
            <em title="住宅用地">住宅用地</em>
        </div>
        <div class="lengendCon">
            <i class="con_eight"></i>
            <em title="公共管理与公共服务用地">公共管理与公共服务用地</em>
        </div>
        <div class="lengendCon">
            <i class="con_nine"></i>
            <em title="特殊用地">特殊用地</em>
        </div>
        <div class="lengendCon">
            <i class="con_ten"></i>
            <em title="交通运输用地">交通运输用地</em>
        </div>
        <div class="lengendCon">
            <i class="con_eleven"></i>
            <em title="水域及水利设施用地">水域及水利设施用地</em>
        </div>
        <div class="lengendCon">
            <i class="con_tweven"></i>
            <em title="其他土地">其他土地</em>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    }
}
</script>
<style scoped>
.classificat_side{
    width: 230px;
    height: 320px;
    padding:15px;
    background-color: rgba(0, 0, 0, 0.5);
    margin-left: 5px;
    border: 1px solid rgb(126, 169, 224);
    border-radius: 5px;
    color: #fff;
    margin-top: 50px;
}
.lengendCon{
    width: 200px;
    height: 24px;
    cursor: pointer;
    /* border: 1px solid red; */
}
.lengendCon i{
    float: left; 
    width: 25px; 
    height: 12px; 
    margin-top: 5px; 
    border-radius: 2px; 
}
.lengendCon em{
    float: left;
    font-style: normal; 
    margin-left: 10px; 
    width: 120px; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap;
}
.con_one{
    background: rgb(248, 208, 114);
}
.con_two{
    background: rgb(231, 204, 226);
}
.con_three{
    background: rgb(49, 173, 105);
}
.con_four{
    background: rgb(131, 194, 56);
}
.con_five{
    background: rgb(226, 161, 149);
}
.con_six{
    background:rgb(197, 154, 140);
}
.con_seven{
    background:rgb(229, 103, 102);
}
.con_eight{
    background:rgb(241, 165, 180);
}
.con_nine{
    background:rgb(193, 114, 97);
}
.con_ten{
    background:rgb(209, 201, 211);
}
.con_eleven{
    background:rgb(163, 214, 245);
}
.con_tweven{
    background:rgb(222, 221, 214);
}
</style>