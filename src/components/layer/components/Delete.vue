<template>
  <mModal
    :modal="showModal"
    modalTitle="删除"
    :modalWidth="550"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="deleteLayer"
  >
    <div class="container">
      <img src="@/assets/icons/warning.png" alt style="margin-right: 20px" />
      <div>您确定要删除此图层吗?</div>
    </div>
  </mModal>
</template>
<script>
import { deleteLayer } from "@/api/layer.js";
import modalMixins from "./modalMixins.js";
export default {
  mixins: [modalMixins],
  props: ["id"],
  methods: {
    deleteLayer() {
      // 删除图层
      const params = {
        layerId: this.id
      };
      deleteLayer(params)
        .then(res => {
          if (res.code == 0) {
            this.$Message.success("删除成功!");
            this.$store.dispatch("removeLayer", this.id);
            this.handleModalClose(this.modalName);
          } else {
            this.$Message.error("删除失败!");
          }
        })
        .catch(err => {
          this.$Message.error("删除失败!");
        });
    }
  }
};
</script>
<style scoped>
.container {
  display: flex;
  margin: 20px auto;
  justify-content: center;
  font-size: 14px;
  color: black;
}
.container > div {
  margin-top: 10px;
}
.container > div > image {
  vertical-align: middle;
}
</style>
 