<template>
  <div class="lineStyle" v-show="hidepolygon">
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
            <img :src="`/static/img/layerStyle/Line/${item.name}.png`" alt style="width: 100%;height: auto" />
            <p class="overflow" :title="item.name" style="text-align: center;">{{item.name}}</p>
          </div>
        </div>
        <div class="rightNav">
          <div class="preview" id="preview">
             <img v-if="currentSelect.name" :src="`/static/img/layerStyle/Line/${currentSelect.name}.png`" alt />
          </div>
          <div>选项：</div>
          <div>
            线宽：
            <span class="input">
              <input type="number" v-model="lineWidth">
            </span>
          </div>
          <div>
            透明度：
            <span class="input">
              <input v-model="opacity">
            </span>
          </div>
          <div style="font-weight: bold;font-size: 14px;text-align:center;">透明度为0-1的小数</div>
        </div>
      </div>
      <div style="font-size: 16px;margin: 6px 6px 6px 0;display: flex;align-items: center;">颜色&nbsp;&nbsp;{{selectColor.hex}}</div>
      <slider-picker v-model="selectColor" />
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
      opacity: this.styleProps.opacity || 1,
      lineWidth: this.styleProps.lineWidth || 1,
      selectColor: { hex: this.styleProps.color || '#000000' }, // 颜色选择
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
        {key: '01', name: '边界，城市'},
        {key: '02', name: '边界，国家'},
        {key: '03', name: '边界，军事设施'},
        {key: '04', name: '边界，县'},
        {key: '05', name: '边界，镇区'},
        {key: '06', name: '边界，州'},
        {key: '07', name: '边界，住宅区'},
        {key: '08', name: '单线，航海晕线 2'},
        {key: '09', name: '单线，航海晕线'},
        {key: '10', name: '单线，宽'},
        {key: '11', name: '单线，窄'},
        {key: '12', name: '道路，提议'},
        {key: '13', name: '道路，未定义'},
        {key: '14', name: '道路，未铺砌'},
        {key: '15', name: '等值线，地形，补充'},
        {key: '16', name: '等值线，地形，索引'},
        {key: '17', name: '等值线，地形，填方'},
        {key: '18', name: '等值线，地形，洼地'},
        {key: '19', name: '等值线，地形，中间'},
        {key: '20', name: '等值线，深海探测，补充'},
        {key: '21', name: '等值线，深海探测，索引'},
        {key: '22', name: '等值线，深海探测，中间'},
        {key: '23', name: '等值线，深海探测，主索引'},
        {key: '24', name: '等值线，深海探测，主要'},
        {key: '25', name: '堤坝'},
        {key: '26', name: '点划线'},
        {key: '27', name: '渡口'},
        {key: '28', name: '堆叠式多道路'},
        {key: '29', name: '堆叠式多道路斜坡'},
        {key: '30', name: '辅助道路'},
        {key: '31', name: '高速公路，提议'},
        {key: '32', name: '高速公路，在建'},
        {key: '33', name: '高速公路'},
        {key: '34', name: '高速公路匝道'},
        {key: '35', name: '高占用率车道'},
        {key: '36', name: '高占用率车道斜坡'},
        {key: '37', name: '公共交通'},
        {key: '38', name: '公交路线'},
        {key: '39', name: '公路'},
        {key: '40', name: '公路匝道'},
        {key: '41', name: '沟渠'},
        {key: '42', name: '海岸线'},
        {key: '43', name: '河流，可航行'},
        {key: '44', name: '河流'},
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
      if(this.lineWidth <= 0) {
        this.$Message.error('请输入合法的线宽!')
        return false;
      }
      if(this.opacity <= 0 || this.opacity > 1) {
        this.$Message.error('请输入合法的透明度!')
        return false;
      }
      return {
        width: this.lineWidth,
        color: this.selectColor.hex,
        opacity: this.opacity
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
.lineStyle {
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
.input>input {
  width: 100px;
  height: 30px;
  margin-bottom:5px;
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