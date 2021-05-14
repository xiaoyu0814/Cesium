<template>
  <mModal
    :modal="showModal"
    :headerSlot="true"
    :modalWidth="500"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="handleEditComfirm"
  >
    <div class="title" slot="title">{{styleModalTitle[outType]}}图层样式</div>
    <PolygonStyle ref="polygon" :styleProps="getStyleProps" v-if="outType == 'polygon'"></PolygonStyle>
    <LineStyle ref="line" :styleProps="getStyleProps" v-if="outType == 'line'"></LineStyle>
    <pointStyle ref="point" :styleProps="getStyleProps" v-if="outType == 'point'" />
  </mModal>
</template>
<script>
import PolygonStyle from "./PolygonStyle";
import LineStyle from "./LineStyle";
import pointStyle from "./pointStyle";
import modalMixins from "./modalMixins.js";
import { updateLayer } from "@/api/layer.js";

export default {
  mixins: [modalMixins],
  components: {
    PolygonStyle,
    LineStyle,
    pointStyle
  },
  props: {
    outType: {
      type: String,
      default: "",
      required: true
    },
    currentLayer: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      styleModalTitle: {
        polygon: "面",
        line: "线"
      }
    };
  },
  computed: {
    getStyleProps() {
      return this.currentLayer.style || {};
    }
  },
  methods: {
    handleEditComfirm() {
      let params = this.$refs[this.outType].getParams(); // 搜集样式数据
      if (this.currentLayer.style) {
        params = { ...this.currentLayer.style, ...params };
      }
      if (!params) return; // 参数不合法
      updateLayer({
        id: this.currentLayer.id,
        style: {
          ...params
        }
      })
        .then(res => {
          if (res.code == 0) {
            this.$Message.success("更新成功!");
            this.handleModalClose(this.modalName);
            this.$store.dispatch("updateLayer", {
              ...this.currentLayer,
              style: { ...params }
            });
          } else {
            this.$Message.error("更新失败!");
          }
        })
        .catch(err => {
          this.$Message.error("更新失败!");
        });
    }
  }
};
</script>
<style lang="less">
.title{
  text-align: center;
}
</style>