<template>
  <div class="polgyonStyle" v-show="hidepolygon">
    <div>
      <div class="secondFloor">
        <div class="polText">
          <div class>选择符号：</div>
          <div class="selectInput">
            <select>
              <option value>默认</option>
              <option value>全部</option>
            </select>
          </div>
          <div>预览：</div>
        </div>
      </div>
      <div class="three">
        <div class="colorList">
          <div
            class="item pointer"
            :class="{'active': currentSelect.name == item.name}"
            @click="selectedColor(item)"
            v-for="item of polygonImgs"
            :key="item.key"
          >
            <img :src="`/static/img/layerStyle/Region/${item.name}.png`" alt style="width: 100%;height: auto" />
            <p class="overflow" :title="item.name" style="text-align: center;">{{item.name}}</p>
          </div>
        </div>
        <div class="rightNav">
          <div class="preview" id="preview">
             <img v-if="currentSelect.name" :src="`/static/img/layerStyle/Region/${currentSelect.name}.png`" alt />
          </div>
          <div>选项：</div>
          <div class="flex">
            透明度：
            <span class="input">
              <input v-model="opacity" style="width: 80px">
            </span>
          </div>
          <div style="font-weight: bold;font-size: 14px;text-align:center;">透明度为0-1的小数</div>
          <div class="flex" style="margin: 4px 0">
            是否填充：
            <span class="input">
              <i-switch v-model="isFill">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
              </i-switch>
            </span>
          </div>
          <div class="flex">
            线宽：
            <span class="input">
              <input style="width: 80px" type="number" v-model="strokeWidth">
            </span>
          </div>
        </div>
      </div>
      <div style="font-size: 16px;margin: 6px 6px 6px 0;display: flex;align-items: center;">框线颜色&nbsp;&nbsp;{{strokeColor.hex}}</div>
      <slider-picker v-model="strokeColor" />
      <div v-if="isFill" style="font-size: 16px;margin: 6px 6px 6px 0;display: flex;align-items: center;">填充颜色&nbsp;&nbsp;{{fillColor.hex}}</div>
      <slider-picker v-if="isFill" v-model="fillColor" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
        styleProps: {
            type: Object,
            default: () => {},
            required: true
        }
    },
  data() {
    
    return {
      isFill: this.styleProps.isFill || false,
      opacity: this.styleProps.opacity || 1,
      strokeWidth: this.styleProps.strokeWidth || 1,
      strokeColor: { hex: this.styleProps.strokeColor || '#000000' }, // 颜色选择
      fillColor: { hex: this.styleProps.fillColor || '#000000' }, // 颜色选择
      hidepolygon: true,
      img:false,
      img1:false,
      img2:false,
      img3:false,
      img4:false,
      img5:false,
      currentcolor:'',
      currentSelect: {key: '01', name: '暗黄色'},      
      polygonImgs: [
        {key: '01', name: '暗黄色'},
        {key: '02', name: '暗蓝色'},
        {key: '03', name: '暗绿色'},
        {key: '04', name: '橙色'},
        {key: '05', name: '淡紫色'},
        {key: '06', name: '粉色'},
        {key: '07', name: '橄榄色'},
        {key: '08', name: '黄褐色'},
        {key: '09', name: '黄色'},
        {key: '10', name: '灰色'},
        {key: '11', name: '蓝色'},
        {key: '12', name: '绿色'},
        {key: '13', name: '绿玉色'},
        {key: '14', name: '玫瑰色'},
        {key: '15', name: '米黄色'},
        {key: '16', name: '浅橙色'},
        {key: '17', name: '珊瑚红'},
        {key: '18', name: '紫罗兰色'},
        {key: '19', name: '有序点画'},
        {key: '20', name: '冰川'},
        {key: '21', name: '草地'},
        {key: '22', name: '灌木丛'},
        {key: '23', name: '果园或苗圃'},
        {key: '24', name: '红树林'},
        {key: '25', name: '湖泊'},
        {key: '26', name: '间歇水'},
        {key: '27', name: '开放式牧场'},
        {key: '28', name: '空心'},
        {key: '29', name: '历史古迹'},
        {key: '30', name: '农田'},
        {key: '31', name: '葡萄园'},
        {key: '32', name: '散生树'},
        {key: '33', name: '沙石'},
        {key: '34', name: '太阳'},
        {key: '35', name: '沼泽'},
      ]
    };
  },
  methods: {
    hidePolygon() {
      this.hidepolygon = false;
    },
    selectedColor(item){
      this.currentSelect = item;
    },
    getParams() {
      if(this.opacity <= 0 || this.opacity > 1) {
        this.$Message.error('请输入合法的透明度!')
        return false;
      }
      return {
        fillColor: this.fillColor.hex,
        strokeColor: this.strokeColor.hex,
        opacity: this.opacity,
        isFill: this.isFill,
        strokeWidth: this.strokeWidth
      }
    }
  },
  mounted() {
    $(".colorList").niceScroll({
      cursorcolor: "#37A2FF", // 改变滚动条颜色，使用16进制颜色值
      cursorwidth: "5px", // 滚动条的宽度，单位：便素
      cursorborder: "1px solid #37A2FF", // CSS方式定义滚动条边框
      cursorborderradius: "5px", // 滚动条圆角（像素）
      scrollspeed: 60, // 滚动速度
      mousescrollstep: 40, // 鼠标滚轮的滚动速度 (像素) 
    });
  }
};
</script>
<style scoped>
.polgyonStyle {
  width: 440px;
  margin-left: 15px;
  background-color: #fff;
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
  margin-top: 5px;
  margin-right: 10px;
}
/* 第二层 */
.secondFloor {
  font-size: 16px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
}
.polText {
  display: flex;
  width: 320px;
  justify-content: space-between;
  margin-left: 5px;
}
.selectInput {
  display: flex;
}
.colorList {
  width: 250px;
  height: 276px;
  overflow: auto;
  border: 1px solid;
  /* background-color: aquamarine; */
  margin-left: 5px;
}
.colorList .item {
  cursor: pointer;
  display: inline-block;
  width: 40px;
  margin: 4px 8px;
  border: 1px solid rgba(255,255,255,0);
}
.colorList .active {
  border: 1px solid #007AFF;
}
.preview {
  width: 130px;
  height: 130px;
  border: 1px solid;
  margin-bottom: 10px;
  padding-left: 6px;
  padding-top: 7px;
}

.three {
  display: flex;
}
.rightNav {
  font-size: 16px;
  margin-left: 10px;
}
.ColorSelect > select {
  width: 100px;
  height: 30px;
  margin-bottom: 5px;
}
.BorderStyle {
  width: 80px;
  height: 30px;
}
button {
  margin: 0;
  padding: 0;
  width: 60px;
  background-color: #fff;
  margin-right: 20px;
}
.btn {
  display: flex;
  /* justify-content: center; */
  margin-top: 20px;
}
button:first-child {
  margin-left: 50px;
}
.ColorCard {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  margin-bottom: 10px;
}
.ColorCard > div {
  padding: 5px;
}
.grass {
  display: flex;
  margin-left: 15px;
  margin-right: 15px;
}
.preview > img {
  width: 110px;
  margin-left: 3px;
  margin-top: 5px;
}
.preview:nth-child(2){
  display: none;
}
</style>