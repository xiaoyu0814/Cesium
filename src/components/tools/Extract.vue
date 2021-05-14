<template>
  <div>
    <div class="extract_all" v-show="hideextract">
      <!-- 这是地物分割组件 -->
      <div class="top">
        <div class="extact_title">地物分类</div>
        <div class="close" @click="hideExtract">X</div>
      </div>
      <div>
        <div class="text">数据源</div>
        <div class="checkbox">
          <!-- <CheckboxGroup v-model="select" @on-change="addSourceLayer"> -->
          <Col span="24" v-for="(item,index) in fengeSources" :key="index">
            <Checkbox :label="index" @on-change="addSourceLayer(item,this)">{{item.dtName}}</Checkbox>
          </Col>
          <!-- </CheckboxGroup> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { get, post } from "@/api/load";
export default {
  data() {
    return {
      single: false,
      hideextract: true,
      select: [],
      fengeSources: []
    };
  },
  methods: {
    addSource() {
      var _this = this;
      let url = "http://piecloud.piesat.cn/api/v1/business_server/metaset/findMetaSetList"

      get(url).then(res => {
        console.log(res);
        var dtname = res.data[0].dtName;
        var url =
          "http://piecloud.piesat.cn/geographic_search/v1/geocode/query_intersects?polygon=116.37553893931857,39.916164040650614;116.40987121471511,39.916164040650614;116.40987121471511,39.903704432697225;116.37553893931857,39.903704432697225;116.37553893931857,39.916164040650614&type=" +
          dtname +
          "&output=geojson";
        // _this.addSourceLayer(url)
        _this.fengeSources = res.data;
        for (var i = 0; i < _this.fengeSources.length; i++) {
          _this.fengeSources[i].checked = false;
        }
      });
    },
    addSourceLayer(item) {
      var _this = this;
      item.checked = !item.checked;
      if (item.checked) {
        var dtname = item.dtName;
        var url =
          "http://piecloud.piesat.cn/geographic_search/v1/geocode/query_intersects?polygon=116.37553893931857,39.916164040650614;116.40987121471511,39.916164040650614;116.40987121471511,39.903704432697225;116.37553893931857,39.903704432697225;116.37553893931857,39.916164040650614&type=" +
          dtname +
          "&output=geojson";
        get(url).then(res => {
          console.log(res);
          var data = res.data;
          this.map.addDiWuLayer(data, dtname);
        });
      } else {
        this.map.removeDiWuLayer(item.dtName);
      }
    },
    hideExtract() {
      this.$emit("toolShow", { name: "extract", status: false });
    }
  },
  mounted() {
    // this.addSource();
    //this.addLayer();
    //https://cloud.piesat.cn/dataservices/service/v1/tile?map=CN16M&x={x}&y={y}&z={z}
  }
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
.top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(126, 169, 224);
}
/* 标题字体样式 */
.extact_title {
  font-size: 20px;
  margin-left: 5px;
  padding: 5px;
}
.close {
  font-size: 20px;
  margin-top: 5px;
  display: flex;
  margin-right: 15px;
}
/* 文字样式 */
.text {
  font-size: 16px;
  border-bottom: 1px solid #d3cbcb;
  padding-left: 8px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-bottom: 5px;
}
/* 复选框样式 */
.checkbox {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}
.ivu-checkbox-wrapper {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>