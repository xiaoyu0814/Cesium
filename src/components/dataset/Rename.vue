<template>
  <mModal
    :modal="showModal"
    modalTitle="重命名"
    :modalWidth="550"
    @listenModal="handleModalClose(modalName)"
    @listenModalOk="changeName"
  >
    <div>
      <div class="container">
        <div style="width: 80px;">数据集名称:</div>
        <Input v-model="rename" placeholder="请输入新的数据集名称" style="width: 200px;" />
      </div>
    </div>
  </mModal>
</template>
<script>
import { post } from "@/api/load.js";
import modalMixins from "@/components/layer/components/modalMixins.js";
export default {
  mixins: [modalMixins],
  props: ["result"],
  data() {
    return {
      rename: this.result.name
    };
  },
  mounted() {
    console.log(this.result);
  },
  methods: {
    changeName() {
      const params = {
        dataset_name: this.rename,
        id: this.result.id
      };
      let url = this.$interfacePath.dataSet.updateDatasetInfoById;
      post(url, params)
        .then(res => {
          if (res.code == 0) {
            this.handleModalClose(this.modalName);
            this.$emit("handleRenameSuccess");
          } else {
            this.$Message.error("修改失败");
          }
        })
        .catch(err => {
          this.$Message.error("修改失败!");
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
  align-items: center;
  font-size: 13px;
  color: black;
}
.container > div {
  margin-top: 10px;
}
.container > div > input {
  width: 250px;
}
</style>
