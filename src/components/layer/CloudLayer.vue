<template>
  <div class="AllCloudLayer" v-show="hideclound">
    <!-- 顶部导航条 -->
    <div class="TopNav">
      <div class="text">导入图层</div>
      <div class="close" @click="hideClound">X</div>
    </div>
    <!-- 中间部分 -->
    <div class="Middle">
      <div class="NameInput">
        图层名称：
        <input type="text" />
      </div>
      <div class="Input">
        <div class="TypeInput">
          Filter：
          <select name id>
            <option value>所有类型</option>
            <option value>类型1</option>
          </select>
        </div>
        <div class="keyWord">
          <input type="text" placeholder="关键字" />
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <table >
        <thead>
           <tr>
            <td>入口</td>
            <td>名字</td>
            <td>类型</td>
            <td></td>
            <td></td>
        </tr> 
        </thead>
        <tbody>
            <tr>
                <td>
                    <Checkbox style="margin-left:8px;margin-top:5px"></Checkbox>
                </td>
                <td>图层1</td>
                <td>点</td>
                <td><button>移除</button></td>
                <td><button>获取</button></td>
            </tr>
            <tr>
                <td>
                    <Checkbox style="margin-left:8px"></Checkbox>
                </td>
                <td>图层2</td>
                <td>线</td>
                <td><button>移除</button></td>
                <td><button>获取</button></td>
            </tr>
            <tr>
                <td>
                    <Checkbox style="margin-left:8px"></Checkbox>
                </td>
                <td>图层3</td>
                <td>面</td>
                <td><button>移除</button></td>
                <td><button>获取</button></td>
            </tr>
            <tr>
                <td>
                    <Checkbox style="margin-left:8px"></Checkbox>
                </td>
                <td>图层4</td>
                <td>Ras</td>
                <td><button>移除</button></td>
                <td><button>获取</button></td>
            </tr>
            <tr>
                <td>
                    <Checkbox style="margin-left:8px"></Checkbox>
                </td>
                <td>图层5</td>
                <td>Ras</td>
                <td><button>移除</button></td>
                <td><button>获取</button></td>
            </tr>
        </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hideclound:true
    };
  },
  methods:{
    hideClound(){
      this.hideclound=false;
      
    }
  },
};
</script>
<style   scoped>
.AllCloudLayer {
  width: 440px;
  height: 420px;
  border: 1px solid;
  margin-left: 15px;
  background-color: #fff
}
/* 顶部导航条 */
.TopNav {
  width: 100%;
  height: 30px;
  background-color: bisque;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid;
}
/* 文字样式 */
.text {
  font-size: 16px;
  margin-left: 150px;
  border-bottom: 0;
}
/* 关闭按钮 */
.close {
  background-color: brown;
  color: #fff;
  width: 20px;
  height: 20px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  cursor:pointer;
}
/* 中间部分 */
.Middle {
  margin-top: 15px;
  margin-left: 20px;
  width:360px ;
}
.NameInput {
  font-size: 16px;
  border-bottom: 1px solid;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.Input{
    display: flex;
}
.TypeInput {
  font-size: 16px;
  display: flex;
}
.keyWord>input{
    font-size: 16px;
    margin-left: 5px;
    width: 120px;
}
table{
    margin-left: 40px;
    margin-top: 10px;
    width: 320px;
    
}
tr{
    border: 1px solid;
}
td{
    border: 1px solid;
    padding: 5px;
}
button{
    margin: 0;padding: 0;
    background-color: #fff;
    margin-left: 5px;
    border: #fff;
}

</style>