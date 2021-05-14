<template>
  <div id="map">
    <div id="cesiumContainer"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.initMap("map");
    this.map.viewer.extend(Cesium.viewerCesiumNavigationMixin, {
      defaultResetView: Cesium.Rectangle.fromDegrees(73, 3, 137, 54)
    });
    var distanceLegendDiv = document.getElementById("distanceLegendDiv");
    if (distanceLegendDiv != null) {
      //设置指北针位置
      distanceLegendDiv.style.position = "absolute";
      distanceLegendDiv.style.top = "100px";
      distanceLegendDiv.style.left = "100px";
    }

    //设置比例尺位置
    var distancelegend = document.getElementsByClassName("distance-legend");
    if (distancelegend != null) {
      distancelegend[0].style.position = "absolute";
      distancelegend[0].style.bottom = "100px";
      distancelegend[0].style.left = "10px";
    }
  },
  methods: {
    initMap(id) {
      var mapObj = {
        container: id
      };
      var _this = this;
      this.map.initMap(mapObj);
      this.addLayer();
      this.map.getPosition(position => {
        // console.log(position);
        _this.coordinate = position;
      });
    },
    addLayer() {
      var ImageUrlLayer = {
        id: "ditu",
        url: "http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}",
        region: [-180, -90, 180, 90],
        opacity: 1
      };
      this.map.addUrlTemplateImageryLayer(ImageUrlLayer);
    }
  }
};
</script>
<style scoped>
</style>

