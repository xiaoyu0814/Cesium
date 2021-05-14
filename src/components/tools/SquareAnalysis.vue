<!-- 方量分析子组件 -->
<template>
  <div class="square" v-show="hidesquare" v-drag>
    <!-- 表头 -->
    <div class="top">
      <div class="title">
        <img src="@/assets/compare.png" alt=" " />
        <div>方量分析</div>
      </div>
      <div class="close" @click="hideSquare">X</div>
    </div>
    <!-- 二楼 -->
    <div class="secondFloor">
      <div class="top_text">方量分析</div>
      <div class="clear">清除</div>
    </div>
    <!-- 三楼 -->
    <div class="threeFloor">
      <div>
        基准面高：
        <input type="text" placeholder="0" />
        (米)
      </div>
      <div class="text">点选基准面</div>
    </div>

    <div class="bottom">
      围墙高度：
      <input type="text" placeholder="0" />
      (米)
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hidesquare: true
    };
  },
  methods: {
    hideSquare() {
      this.hidesquare = false;
    }
  },
  // 整个组件可以拖拽
  directives: {
    drag(el) {
      el.onmousedown = function(e) {
        var disx = e.clientX - el.offsetLeft;
        var disy = e.clientY - el.offsetTop;
        document.onmousemove = function(e) {
          el.style.left = e.clientX - disx + "px";
          el.style.top = e.clientY - disy + "px";
        };
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null;
        };
      };
    }
  }
};
</script>
<style   scoped>
/* 整体样式 */
.square {
  width: 330px;
  height: 300px;
  border: 1px solid;
  border: 1px solid rgb(126, 169, 224);
  color: #fff;
  background-color: gray;
  background-color: rgba(0, 0, 0, 0.5);
  margin-left: 10px;
  font-size: 14px;
  border-radius: 6px;
  margin-top: 50px;
}
/* 头部样式 */
.top {
  display: flex;
  padding-bottom: 15px;
  margin-top: 10px;
  justify-content: space-between;
  border-bottom: 1px solid rgb(126, 169, 224);
}
.title {
  display: flex;
  margin-left: 5px;
}
.close {
  display: inline;
  margin-right: 30px;
}
.top_text {
  border: 1px solid rgb(126, 169, 224);
  margin-left: 5px;
  margin-right: 10px;
  padding: 0 15px;
}
input {
  width: 100px;
  height: 30px;
  background-color: gray;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgb(126, 169, 224);
  color: #fff;
}
/*二楼样式 */
.secondFloor {
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
}
.clear {
  border: 1px solid rgb(111, 243, 232);
  padding: 0 15px;
}
.clear:hover {
  background-color: rgb(111, 243, 232);
}
/* 三楼样式 */
.threeFloor {
  display: flex;
  margin-bottom: 15px;
  margin-left: 5px;
}
/* 三楼字体样式 */
.text {
  margin-left: 20px;
  border: 1px solid rgb(126, 169, 224);
  padding: 3px;
}
.bottom {
  margin-left: 5px;
}
</style> 