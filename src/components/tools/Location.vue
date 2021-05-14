<template>
  <div class="location" v-show="hideLocation" v-drag>
    <div class="location_top">
      <div class="location_text">
        <img src="../../assets/compute.png" alt=" " />
        <div>坐标定位</div>
      </div>
      <div class="location_close" @click="location_close">X</div>
    </div>
      <div class="second">
          <div>经度<input type="number"   min="1" max="100"   /></div>
          <div>纬度<input type="number" step="1" min="1" max="100"   /></div>
          <div>高度<input type="number" step="1" min="1" max="100"   /></div>

      </div>
    <button>确定</button>
  </div>
</template> 
<script>
export default {
  data() {
    return {
      hideLocation: true
    };
  },
  methods: {
    location_close() {
      this.hideLocation = false;
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
<style scoped>
.location {
  width: 300px;
  height: 220px;
  background-color: rgba(0, 0, 0, 0.5);
  margin-left: 5px;
  border: 1px solid rgb(126, 169, 224);
  border-radius: 5px;
  color: #fff;
  margin-top: 50px;
}
.location_top {
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  justify-content: space-between;
  border-bottom: 1px solid rgb(126, 169, 224);
}
.second {
  margin-left: 10px;
}
input {
  width: 100px;
  margin-bottom: 10px;
  margin-left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border: solid 1px gray;
  color: #fff;
}
.location_text {
  display: flex;
  margin-left: 10px;
}
.location_close {
  margin-right: 20px;
}
button {
  margin-left: 70%;
  font-size: 14px;
  padding: 5px 8px;
  background-color: rgba(0, 0, 0, 0.5);
  border: solid 1px gray;
  border-radius: 5px;
  color: #fff;
}
</style>